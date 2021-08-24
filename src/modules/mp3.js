const youtubeMp3Converter = require('youtube-mp3-converter')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

function Down(url) {
    return new Promise(resolve => {
    try {
        const pathToSaveFiles = './src/tmp'
        // creates Download function
        const convertLinkToMp3 = youtubeMp3Converter(pathToSaveFiles)
        // Downloads mp3 and Returns path were it was saved.
        const pathToMp3 = convertLinkToMp3(encodeURI(url).slice(3), {
            title: 'music'
        });
        resolve(pathToMp3)
    }
    catch (error) {
        return error
    };
})
}
module.exports = {
    down: Down,
    ffmpeg: ffmpeg
}