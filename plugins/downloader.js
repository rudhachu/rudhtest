const { rudhra, mode } = require("../lib");
const fetch = require('node-fetch');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

rudhra({
    pattern: 'fb ?(.*)',
    fromMe: mode,
    desc: 'Download Facebook Videos',
    type: 'downloader'
}, async (message, match, client) => {
    const fbUrl = match || message.reply_message?.text;

    if (!fbUrl) {
        return await message.reply('_Enter a Facebook URL!_');
    }

    const apiUrl = `https://api.dorratz.com/fbvideo?url=${fbUrl}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.result || (!data.result.sd && !data.result.hd)) {
            return await client.sendMessage(message.jid, { text: "Failed to fetch video. Please ensure the URL is valid." });
        }

        // Display download options
        const optionsText = `*${data.result.title}*\n\n *1.* *SD video*\n *2.* *HD video*\n\n*ʀᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ*`;
        const contextInfoMessage = {
            text: optionsText,
            contextInfo: {
                externalAdReply: {
                    title: "𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿",
                    body: "ʀᴜᴅʜʀᴀ ʙᴏᴛ",
                    sourceUrl: fbUrl,
                    mediaUrl: fbUrl,
                    mediaType: 1,
                    showAdAttribution: true,
                    thumbnailUrl: "https://i.imgur.com/ohBQOGf.jpeg"
                }
            }
        };

        const sentMsg = await client.sendMessage(message.jid, contextInfoMessage, { quoted: message.data });

        // Listen for user response
        client.ev.on('messages.upsert', async (msg) => {
            const newMessage = msg.messages[0];

            if (
                newMessage.key.remoteJid === message.jid &&
                newMessage.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id
            ) {
                const userReply = newMessage.message?.conversation || newMessage.message?.extendedTextMessage?.text;

                if (userReply === '1' && data.result.sd) {
                    // Send SD video
                    await client.sendMessage(
                        message.jid,
                        { video: { url: data.result.sd }, mimetype: "video/mp4" },
                        { quoted: message.data }
                    );
                } else if (userReply === '2' && data.result.hd) {
                    // Send HD video
                    await client.sendMessage(
                        message.jid,
                        { video: { url: data.result.hd }, mimetype: "video/mp4" },
                        { quoted: message.data }
                    );
                } else {
                    await client.sendMessage(message.jid, { text: "Invalid option or unavailable quality. Please reply with 1 or 2." });
                }
            }
        });
    } catch (error) {
        console.error(error);
        await client.sendMessage(message.jid, { text: "An error occurred while fetching the media. Please try again later." });
    }
});
