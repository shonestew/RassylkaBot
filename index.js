const { Telegraf } = require('telegraf') 
const fs = require('fs') 
 
const token = '7453336444:AAE4WJ9gyZV-iui2y8x5_fHu2LGGr5o85sY' 
 
const bot = new Telegraf(token); 
 
const admins = ['shonestew'] 
 
function addUser(users) { 
    fs.writeFileSync('usernames.json', JSON.stringify(users, null, 2)); 
} 
 
function checkUser() { 
    try { 
        const data = fs.readFileSync("usernames.json", "utf8"); 
        return JSON.parse(data); 
    } catch (err) { 
        console.error('Ошибка при загрузке информации:', err); 
        return {}; 
    } 
} 
 
bot.command('start', async (ctx) => { 
    try { 
        const userCheck = checkUser() 
        const chatId = ctx.message.chat.id; 
        ctx.telegram.sendMessage(chatId, '🔰 Добро пожаловать в бота для рассылки! Для того, чтобы выйти из рассылки, напишите "/off"') 
        if (!userCheck.includes(chatId.toString())) { 
            const users = [] 
            users.push(chatId.toString()); 
            addUser(users) 
            ctx.telegram.sendMessage(chatId, '✅ Вы были добавлены в список рассылки!') 
        } else { 
            ctx.telegram.sendMessage(chatId, 'Вы итак в списке рассылки.') 
        }; 
    } catch (err) { 
        console.log('Ошибка при попытке добавить айди:', err) 
    } 
}); 
 
bot.command('off', async (ctx) => { 
    try { 
        const usersList = checkUser() 
        const chatId = ctx.message.chat.id.toString() 
        if (usersList.includes(chatId)) { 
            const users = usersList.filter(id => id !== chatId); 
            addUser(users); 
            ctx.telegram.sendMessage(chatId, '✅ Вы были убраны из списка рассылки!') 
        } else { 
            ctx.telegram.sendMessage(chatId, 'Вы итак исключены из рассылки.'); 
        } 
    } catch (err) { 
        console.log('ошибка при попытке удалить айди:', err) 
    } 
}); 
 
bot.command('rassyl', async (ctx) => { 
    try { 
        const userCheck = checkUser() 
        if (admins.includes(ctx.message.from.username)) { 
            ctx.telegram.sendMessage(ctx.message.chat.id, '✏ Введите сообщение, которое хотите отправить.') 
            bot.on('message', async (ctx2) => { 
                userCheck.forEach( async (chatId) => await ctx.telegram.sendMessage(chatId, ctx2.message.text.replace('/rassyl ', '')) ) 
                ctx.telegram.sendMessage(ctx.message.chat.id, '✅ Сообщение отправлен всем в списке!') 
            }) 
        } else { 
            await ctx.telegram.sendMessage(chatId, '⛔ Вам отказано в доступе!') 
            return; 
        } 
    } catch (err) { 
        console.log('Ошибка при попытке отправить рассылку:', err) 
    } 
}) 
 
bot.launch()
