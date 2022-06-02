// Requiring module
const { Telegraf, Markup } = require('telegraf')
const LocalSession = require('telegraf-session-local')

let s1 = s2 = 0;

// Your Token
var token = '5557161888:AAF1mbbC-utGuMol5z10FqUDucr6UpD0_80';
  
// Creating object of Telegraf
const bot = new Telegraf(token); 

let count = 0;
bot.use((new LocalSession({ database: 'example_db.json' })).middleware())

bot.command('tinh', async (ctx) => {
    count++;
    ctx.session.count = 1;
    await ctx.reply('nhap so thu nhat');
})

bot.hears('/exit', async(ctx) => {
    count = 0;
    await ctx.reply('bye bye');
})

bot.on('text', async (ctx) => {
    if(count >= 1) {
        console.log('ctx.message = ', ctx.message.text);
        if(!isNaN(Number(ctx.message.text))) {
            count++;
            if(count == 2) {
                s1 = Number(ctx.message.text);
                await ctx.reply('so thu nhat = ' + ctx.message.text);
                await ctx.reply('nhap so thu 2');
            } else if (count == 3) {
                s2 = Number(ctx.message.text);
                await ctx.reply('so thu 2 = ' + ctx.message.text);
                count++;
            }
            
        }
        else {
            await ctx.reply('wrong format');
        }
        if(count === 4) {
            // count = 0;
            return ctx.reply(
                `Chon phep tinh mong muon cho 2 so: ${s1} va ${s2}`,
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
    if(count != 0) {
        count = 0;
        return ctx.reply('+ = ' + (s1+s2));
    }
})

bot.action('-', (ctx, next) => {
    console.log('-coumt = ', count);
    if (count != 0) {
        count = 0;
        return ctx.reply('- = '+ (s1 - s2));
    }
})

bot.action('*', (ctx, next) => {
    if(count != 0) {
        count = 0;
        return ctx.reply('* = '+ (s1*s2));
        
    }
})

bot.action('/', (ctx, next) => {
    if( count != 0) {
        count = 0;
        if(s2 ==0) return ctx.reply('khong the chia cho 0');
        return ctx.reply('/ = ' + (s1/s2));
    }
    
})

  
// Launch the program
bot.launch()