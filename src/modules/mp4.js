const ytdl = require('ytdl-core');
const fs = require('fs');

async function mp4(text) {
    let url = encodeURI(text.slice(4)).slice(3)
    const stream = fs.createWriteStream('./src/tmp/video.mp4')
    await ytdl(url)
        .pipe(stream);

}

module.exports = {
    mp4: mp4
};