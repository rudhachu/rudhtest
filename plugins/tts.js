const { rudhra, mode, convertTextToSound } = require('../lib/');
const config = require('../config');
const fs = require('fs');

rudhra({
    pattern: 'tts ?(.*)',
    fromMe: mode,
    desc: 'It converts text to sound.',
    type: 'generator'
}, async (message, match) => {
    match = match || message.quoted?.text;
    if (!match) return await message.reply('_Need Text!_\n_Example: tts Hello_\n_tts Hello {en}_');
    if (!fs.existsSync('./temp/tts')) {
        fs.mkdirSync('./temp/tts');
    }

    let LANG = 'en';  // Default language is English
    let SPEED = 1.0;  // Default speech speed is normal (1.0)
    let ttsMessage = match.replace("tts", "").trim();  // Remove "tts" from the query

    if (/[\u0D00-\u0D7F]+/.test(ttsMessage)) {
        LANG = 'ml';  // Set to Malayalam if Malayalam script is detected
    }

    const langMatch = ttsMessage.match("\\{([a-z]{2})\\}");
    if (langMatch) {
        LANG = langMatch[1];  // Extract language from {xx}
        ttsMessage = ttsMessage.replace(langMatch[0], '').trim();  // Remove language code from the text
    }

    const speedMatch = ttsMessage.match("\\{([0-9]+\\.[0-9]+)\\}");
    if (speedMatch) {
        SPEED = parseFloat(speedMatch[1]);  // Extract speed from {x.x}
        ttsMessage = ttsMessage.replace(speedMatch[0], '').trim();  // Remove speed code from the text
    }

    try {
        const audioData = await convertTextToSound(ttsMessage, LANG, SPEED);

        await message.client.sendMessage(message.chat, {
            audio: audioData,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true,
            waveform: Array.from({ length: 40 }, () => Math.floor(Math.random() * 99))
        }, { quoted: message.data });

    } catch (error) {
        console.error('Error in TTS conversion:', error);
        return await message.reply('_Error converting text to speech._');
    }
});
