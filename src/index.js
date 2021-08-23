const TelegramBot = require('node-telegram-bot-api');
const {BOT_TOKEN} = require('./config/configs');
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    let text = msg.text;
    if (text == '/start') {
        bot.sendMessage(chatId, `Welcome ${msg.from.first_name}  in DaemonBot`,{
            reply_to_message_id: msg.message_id
          });

    }
});