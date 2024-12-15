const {
  rudhra,
  mode,
  isUrl,
  getJson,
  PREFIX,
  AddMp3Meta,
  getBuffer,
  toAudio,
  yta,
  ytv,
  ytsdl,
  parsedUrl
} = require("../lib");
const axios = require('axios');
const fetch = require('node-fetch');
const config = require('../config');
const yts = require("yt-search");

rudhra({
    pattern: 'ytd ?(.*)',
    fromMe: mode,
    desc: 'Download audio or video from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    const userInput = match || message.reply_message?.text;
    if (!userInput) return await message.reply("Please provide a YouTube link.");
    if (!isUrl(userInput)) return await message.reply("Invalid YouTube link. Please provide a valid one.");

    const YtbUrl = userInput.trim();
    const apiUrls = [
        `https://meitang.xyz/download/ytdl?url=${YtbUrl}`,
        `https://btch.us.kg/download/ytdl?url=${YtbUrl}`,
        `https://api.tioo.eu.org/download/ytdl?url=${YtbUrl}`,
        `https://api.tioprm.eu.org/download/ytdl?url=${YtbUrl}`
    ];

    let ytMediaData = null;
    for (const apiUrl of apiUrls) {
        try {
            const response = await axios.get(apiUrl, { timeout: 10000 }); // 10-second timeout
            if (response.data && response.data.result) {
                ytMediaData = response.data.result;
                break; // Exit loop if successful
            }
        } catch (error) {
            console.error(`Error fetching from ${apiUrl}:`, error.message);
        }
    }

    if (!ytMediaData) {
        return await message.reply("Failed to retrieve media from all sources. Please try again later.");
    }

    const { mp3, mp4, title } = ytMediaData;
    const optionsText = `*${title}*\n\n *1.* *Video*\n *2.* *Audio*\n *3.* *Document*\n\n*ʀᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ*`;
    const contextInfoMessage = {
        text: optionsText,
        contextInfo: {
            externalAdReply: {
                title: "𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿",
                body: "ʀᴜᴅʜʀᴀ ʙᴏᴛ",
                sourceUrl: YtbUrl,
                mediaUrl: YtbUrl,
                mediaType: 1,
                showAdAttribution: true,
                thumbnailUrl: "https://i.imgur.com/xWzUYiF.png"
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

            if (userReply === '1' && mp4) {
                // Send video
                await client.sendMessage(
                    message.jid,
                    { video: { url: mp4 }, mimetype: "video/mp4" },
                    { quoted: message.data }
                );
            } else if (userReply === '2' && mp3) {
                // Send audio
                await client.sendMessage(
                    message.jid,
                    { audio: { url: mp3 }, mimetype: "audio/mpeg" },
                    { quoted: message.data }
                );
            } else if (userReply === '3' && mp3) {
                // Send document
                await client.sendMessage(
                    message.jid,
                    {
                        document: { url: mp3 },
                        mimetype: 'audio/mpeg',
                        fileName: `${title}.mp3`,
                        caption: `_${title}_`
                    },
                    { quoted: message.data }
                );
            } else {
                await client.sendMessage(message.jid, { text: "Invalid option or unavailable media. Please reply with 1, 2, or 3." });
            }
        }
    });
});

rudhra({
    pattern: 'song ?(.*)',
    fromMe: mode,
    desc: 'Search and download audio from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) {
        return await message.reply('Please provide a search query.');
    }

    const query = match;
    try {
        const { videos } = await yts(query);
        if (videos.length === 0) {
            return await message.reply('No results found.');
        }

        const firstVideo = videos[0];
        const videoUrl = firstVideo.url;

        const response = await axios.get(`https://meitang.xyz/download/ytdl?url=${videoUrl}`);
        const { result, title } = response.data;
        const mp3 = result.mp3;
        await message.reply(`_Downloading ${result.title}_`);
        await message.client.sendMessage(
            message.jid,
            { audio: { url: mp3 }, mimetype: 'audio/mp4' },
            { quoted: message.data }
          );
          await message.client.sendMessage(
            message.jid,
            { document: { url: mp3 }, mimetype: 'audio/mpeg', fileName: `${result.title}.mp3`, caption: `_${result.title}_` },
            { quoted: message.data }
          );
    } catch (error) {
        console.error('Error fetching audio:', error);
        await message.reply('Failed to download audio. Please try again later.');
    }
});
rudhra({
    pattern: 'video?(.*)',
    fromMe: mode,
    desc: 'Search and download video from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) {
        return await message.reply('Please provide a search query.');
    }

    const query = match;
    try {
        const { videos } = await yts(query);
        if (videos.length === 0) {
            return await message.reply('No results found.');
        }

        const firstVideo = videos[0];
        const videoUrl = firstVideo.url;

        const response = await axios.get(`https://meitang.xyz/download/ytdl?url=${videoUrl}`);
        const { result, title } = response.data;
        const mp4 = result.mp4;
        await message.reply(`_Downloading ${result.title}_`);
        await message.client.sendMessage(
            message.jid,
            { video: { url: mp4 }, mimetype: 'video/mp4', fileName: `${result.title}.mp4` },
            { quoted: message.data }
        );
    } catch (error) {
        console.error('Error fetching video:', error);
        await message.reply('Failed to download video. Please try again later.');
    }
});

rudhra({
    pattern: 'yta ?(.*)',
    fromMe: mode,
    desc: 'Download audio from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a YouTube link");
    if (!isUrl(match)) return await message.reply("Give me a YouTube link");

    const videoUrl = match;
    try {
        const response = await axios.get(`https://meitang.xyz/download/ytdl?url=${videoUrl}`);
        const { result, title } = response.data;
        const mp3 = result.mp3;
        await message.reply(`_Downloading ${result.title}_`);
        await message.client.sendMessage(
            message.jid,
            { audio: { url: mp3 }, mimetype: 'audio/mp4' },
            { quoted: message.data }
          );
          await message.client.sendMessage(
            message.jid,
            { document: { url: mp3 }, mimetype: 'audio/mpeg', fileName: `${result.title}.mp3`, caption: `_${result.title}_` },
            { quoted: message.data }
          );
    } catch (error) {
        console.error('Error fetching audio:', error);
        await message.reply('Failed to download audio. Please try again later.');
    }
});

rudhra({
    pattern: 'ytv ?(.*)',
    fromMe: mode,
    desc: 'Download video from YouTube.',
    type: 'info'
}, async (message, match, client) => {
    match = match || message.reply_message.text;
    if (!match) return await message.reply("Give me a YouTube link");
    if (!isUrl(match)) return await message.reply("Give me a YouTube link");

    const videoUrl = match;
    try {
        const response = await axios.get(`https://meitang.xyz/download/ytdl?url=${videoUrl}`);
        const { result, title } = response.data;
        const mp4 = result.mp4;
        await message.reply(`_Downloading ${result.title}_`);
        await message.client.sendMessage(
            message.jid,
            { video: { url: mp4 }, mimetype: 'video/mp4', fileName: `${result.title}.mp4` },
            { quoted: message.data }
        );
    } catch (error) {
        console.error('Error fetching video:', error);
        await message.reply('Failed to download video. Please try again later.');
    }
});

rudhra({
    pattern: 'play ?(.*)',
    fromMe: mode,
    desc: 'Search and download audio or video from YouTube',
    type: 'media'
}, async (message, match, client) => {
    if (!match) {
        await client.sendMessage(message.jid, { text: "Please provide a YouTube URL or search query after the command. Example: .play <search query>" });
        return;
    }

    let videoUrl = match;

    // If the input isn't a URL, perform a YouTube search
    if (!match.startsWith('http')) {
        try {
            const results = await yts(match);
            if (!results || results.videos.length === 0) {
                await client.sendMessage(message.jid, { text: "No results found for your search." });
                return;
            }
            videoUrl = results.videos[0].url;
        } catch (error) {
            await client.sendMessage(message.jid, { text: "Error occurred while searching. Please try again." });
            return;
        }
    }

    const apiUrl = `https://meitang.xyz/download/ytdl?url=${videoUrl}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Display download options to the user
        const optionsText = `*_${data.title}_*\n\n\`\`\`1.\`\`\` *audio*\n\`\`\`2.\`\`\` *video*\n\n_*Send a number as a reply to download*_`;
        const contextInfoMessage = {
            text: optionsText,
            contextInfo: {
                mentionedJid: [message.sender],
                externalAdReply: {
                    title: data.title,
                    body: "ʀᴜᴅʜʀᴀ ʙᴏᴛ",
                    sourceUrl: data.source_url,
                    mediaUrl: data.source_url,
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: false,
                    thumbnailUrl: data.thumbnail
                }
            }
        };

        const sentMsg = await client.sendMessage(message.jid, contextInfoMessage, { quoted: message.data });

        // Listen for user response (1 for audio, 2 for video)
        client.ev.on('messages.upsert', async (msg) => {
            const newMessage = msg.messages[0];

            if (
                newMessage.key.remoteJid === message.jid &&
                newMessage.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id
            ) {
                const userReply = newMessage.message?.conversation || newMessage.message?.extendedTextMessage?.text;

                if (userReply === '1') {
                    // Send audio file
                    const externalAdReply = {
                        title: data.title,
                        body: "ʀᴜᴅʜʀᴀ ʙᴏᴛ",
                        sourceUrl: data.source_url,
                        mediaUrl: data.source_url,
                        mediaType: 1,
                        showAdAttribution: true,
                        renderLargerThumbnail: false,
                        thumbnailUrl: data.thumbnail
                    };
                    await client.sendMessage(
                        message.jid,
                        {
                            audio: { url: data.result.mp3 },
                            mimetype: 'audio/mpeg',
                            fileName: `rudhra-bot.mp3`,
                            contextInfo: { externalAdReply: externalAdReply }
                        },
                        { quoted: message.data }
                    );
                } else if (userReply === '2') {
                    // Send video file
                    await client.sendMessage(
                        message.jid,
                        {
                            video: { url: data.result.mp4 },
                            mimetype: 'video/mp4',
                            caption: `*Title:* ${data.title}\n*Duration:* ${data.duration} seconds`
                        },
                        { quoted: message.data }
                    );
                } else {
                    await client.sendMessage(message.jid, { text: "Invalid option. Please reply with 1 or 2." });
                }
            }
        });
    } catch (error) {
        await client.sendMessage(message.jid, { text: "An error occurred while fetching media. Please try again." });
    }
});

rudhra({
  pattern: 'yts ?(.*)', 
  fromMe: mode,
  desc: 'Search for videos on YouTube.',
  type: 'downloader'
}, async (message, match, client) => {
  const query = match;
  if (!query) {
    return await message.reply('*Please provide a search query.*');
  }

  yts(query, async (err, result) => {
    if (err) {
      return message.reply('*Error occurred while searching YouTube.*');
    }

    if (result && result.videos.length > 0) {
      let formattedMessage = '*YouTube Search Results:*\n\n';
      
      result.videos.slice(0, 10).forEach((video, index) => {
        formattedMessage += `*${index + 1}. ${video.title}*\nChannel: ${video.author.name}\nURL: ${video.url}\n\n`;
      });

      const contextInfoMessage = {
        text: formattedMessage,
        contextInfo: {
          mentionedJid: [message.sender],
          externalAdReply: {
          title: "𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 𝗥𝗲𝘀𝘂𝗹𝘁𝘀",
                    body: "ʀᴜᴅʜʀᴀ ʙᴏᴛ",
                    sourceUrl: "https://youtube.com/princerudh",
                    mediaUrl: "https://youtube.com",
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: false,
                    thumbnailUrl: "https://raw.githubusercontent.com/rudhraan/media/refs/heads/main/image/yts.png"
          }
        }
      };

      await message.client.sendMessage(message.jid, contextInfoMessage);
    } else {
      await message.reply('*No results found for that query.*');
    }
  });
});
