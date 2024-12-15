const { rudhra, mode, uploadToImageKit,TelegraphUpload } = require("../lib/");
const axios = require("axios");
const fs = require("fs");
const util = require("util");
rudhra({
    pattern: 'turl ?(.*)',
    fromMe: mode,
    desc: 'Upload files to ImageKit (images) or Telegraph (videos)',
    type: 'generator'
}, async (m, text) => {
    if (!m.quoted) return m.reply("Reply to an image/video message");
    try {
        let media;
        if (m.quoted.image) {  
            media = await m.quoted.download("buffer");
            const uploadResponse = await uploadToImageKit(media, 'image');
            if (uploadResponse && uploadResponse.url) {
                await m.reply(uploadResponse.url);
            } else {
                await m.reply("Failed to upload image.");
            }
        } else if (m.quoted.video) {
           media = await m.quoted.download("buffer");
            const filePath = 'video.mp4'; 
            fs.writeFileSync(filePath, media); 
            const url = await TelegraphUpload(filePath);
            if (url) {
                await m.reply(`${util.format(url)}`);
            } else {
                await m.reply("Failed to upload video.");
            }
            fs.unlinkSync(filePath); 
        } else if (m.quoted.audio) {
            media = await m.quoted.download("buffer");
            const uploadResponse = await uploadToImageKit(media, 'audio');
            if (uploadResponse && uploadResponse.url) {
                await m.reply(uploadResponse.url);
            } else {
                await m.reply("Failed to upload audio.");
            }
        } else {
            return m.reply("_Reply to a video/image/audio!_");
        }
    } catch (error) {
        console.log('Error:', error);
        await m.reply(`Error: ${error.message}`);
    }
});
