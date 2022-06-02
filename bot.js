// Requiring module
const { Telegraf, Markup } = require('telegraf');
const LocalSession = require('telegraf-session-local');

let s1 = s2 = 0;

// Your Token
var token = '5557161888:AAF1mbbC-utGuMol5z10FqUDucr6UpD0_80';
  
// Creating object of Telegraf
const bot = new Telegraf(token); 

let count = 0;
bot.use((new LocalSession({ database: 'example_db.json' })).middleware())

bot.command('tinh', async (ctx) => {
    // count++;
    ctx.session.count = 1;
    ctx.session.s1 = 0;
    ctx.session.s2 = 0
    await ctx.reply('Nhập số thứ nhất');
})

bot.hears('/exit', async(ctx) => {
    ctx.session.count = 0;
    ctx.session.s1 = 0;
    ctx.session.s2 = 0
    await ctx.reply('bye bye');
})

bot.on('text', async (ctx) => {
    if(ctx.session.count >= 1) {
        console.log('ctx.message = ', ctx.message.text);
        if(!isNaN(Number(ctx.message.text))) {
            ctx.session.count++;
            if(ctx.session.count == 2) {
                ctx.session.s1 = Number(ctx.message.text);
                await ctx.reply('Số thứ nhất bạn nhập = ' + ctx.message.text);
                await ctx.reply('Nhập số thứ 2');
            } else if (ctx.session.count == 3) {
                ctx.session.s2 = Number(ctx.message.text);
                await ctx.reply('Số thứ 2 bạn nhập = ' + ctx.message.text);
                ctx.session.count++;
            }
            
        }
        else {
            await ctx.reply('Sai định dạng, phiền bạn nhập lại');
        }
        if(ctx.session.count === 4) {
            // count = 0;
            return ctx.reply(
                `Chọn phép tính mong muốn cho 2 số : ${ctx.session.s1} và ${ctx.session.s2}`,
                Markup.inlineKeyboard([
                    Markup.button.callback('+', '+'),
                    Markup.button.callback('-', '-'),
                    Markup.button.callback('*', '*'),
                    Markup.button.callback('/', '/'),
                ]).oneTime().resize()
              )
        }
    }
});

bot.action('+', (ctx, next) => {
    if(ctx.session.count != 0) {
        ctx.session.count = 0;
        return ctx.reply(`${ctx.session.s1} + ${ctx.session.s2} = ${ctx.session.s1 + ctx.session.s2}`);
    }
})

bot.action('-', (ctx, next) => {
    if (ctx.session.count != 0) {
        ctx.session.count = 0;
        return ctx.reply(`${ctx.session.s1} - ${ctx.session.s2} = ${ctx.session.s1 - ctx.session.s2}`);
    }
})

bot.action('*', (ctx, next) => {
    if(ctx.session.count != 0) {
        ctx.session.count = 0;
        return ctx.reply(`${ctx.session.s1} * ${ctx.session.s2} = ${ctx.session.s1 * ctx.session.s2}`);
    }
})

bot.action('/', (ctx, next) => {
    if(ctx.session.count != 0) {
        ctx.session.count = 0;
        if (ctx.session.s2 == 0) return ctx.reply('Không thể chia cho 0!');
        return ctx.reply(`${ctx.session.s1} / ${ctx.session.s2} = ${ctx.session.s1 / ctx.session.s2}`);
    }
    
})

function resetCtx(ctx) {
    ctx.session.count = 0;
    ctx.session.s1 = 0;
    ctx.session.s2 = 0;
}
// Launch the program
bot.launch()