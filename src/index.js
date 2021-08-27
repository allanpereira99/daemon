const TelegramBot = require("node-telegram-bot-api");
const { BOT_TOKEN } = require("./config/configs");
const fs = require("fs");
const { down } = require("./modules/mp3");
const { mp4 } = require("./modules/mp4");
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
bot.on("message", async (msg) => {
  const reply = { reply_to_message_id: msg.message_id };
  const missing = "missing parameter";
  const chatId = msg.chat.id;
  let text = msg.text;
  if (text == "/start") {
    bot.sendMessage(
      chatId,
      `Welcome ${msg.from.first_name}  in DaemonBot`,
      reply
    );
  }
  if (text.slice(0, 4) == "/mp3") {
    if (text.slice(5, 29) == "https://www.youtube.com/") {
      bot.sendMessage(chatId, "📬Downloading music!...", reply);
      await down(text.slice(4));
      const stream = fs.readFileSync("./src/tmp/music.mp3");
      await bot.sendAudio(chatId, stream, {
        reply_to_message_id: msg.message_id,
      });
      await fs.unlinkSync("./src/tmp");
    } else {
      bot.sendMessage(chatId, `${missing}`, reply);
    }
  }
  if (text.slice(0, 3) == "/yt") {
    if (text.length > 4) {
      const search = require("youtube-search");
      const { YT_KEY } = require("./config/configs");
      let opts = {
        maxResults: 1,
        key: YT_KEY,
        type: "video",
      };
      search(text, opts, function (err, results) {
        return new Promise((resolve) => {
          if (err) return console.log(err);
          resolve(bot.sendMessage(chatId, `${results[0].link}`, reply));
        });
      });
    } else {
      bot.sendMessage(chatId, `${missing}`, reply);
    }
  }

  if (text.slice(0, 4) == "/mp4") {
    if (text.slice(5, 29) == "https://www.youtube.com/") {
      bot.sendMessage(chatId, "📬Downloading video!...", reply);
      mp4(text);
      setTimeout(() => {
        bot.sendVideo(chatId, "./src/tmp/video.mp4", reply);
      }, 20000);
    } else {
      bot.sendMessage(chatId, `${missing}`, reply);
    }
  }

  if (text.slice(0, 5) == "/help") {
    switch (text) {
      case "/help yt":
        bot.sendMessage(chatId, `/yt name from the video`, reply);
        break;
      case "/help mp3":
        bot.sendMessage(chatId, `/mp3 link from video youtube`, reply);
        break;
      default:
        bot.sendMessage(chatId, `for help " /help command "`, reply);
        break;
    }
  }
});
