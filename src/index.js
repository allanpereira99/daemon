const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN } = require('./config/configs');
const fs = require('fs');
const { down } = require('./modules/mp3');
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    let text = msg.text;
    if (text == '/start') {
        bot.sendMessage(chatId, `Welcome ${msg.from.first_name}  in DaemonBot`, {
            reply_to_message_id: msg.message_id
        });

    }
    if (text.slice(0, 4) == '/mp3') {
        bot.sendMessage(chatId, '📬Downloading music!...', {
            reply_to_message_id: msg.message_id
        });
        await down(text.slice(4));
        const stream = fs.readFileSync('./src/tmp/music.mp3');
        await bot.sendAudio(chatId, stream, {
            reply_to_message_id: msg.message_id
        });
        await fs.unlinkSync('./src/tmp');
    };
    if (text.slice(0, 3) == '/yt') {
        const search = require('youtube-search');
        const { YT_KEY } = require('./config/configs');
        let opts = {
            maxResults: 1,
            key: YT_KEY,
            type: 'video'
        };
        search(text, opts, function (err, results) {
            return new Promise(resolve => {
                if (err) return console.log(err);
                resolve(bot.sendMessage(chatId, `${results[0].link}`, { reply_to_message_id: msg.message_id }))
            });

        });
    };
});