const { rudhra, mode,formatTime } = require('../lib/');
const config = require("../config");
 rudhra({
    pattern: "ping",
    fromMe: mode,
    desc: "Bot response in second.",
    type: "info",
}, async (message, match, client) => {
    let thumbnail = 'https://raw.githubusercontent.com/rudhra-prh/media/refs/heads/main/image/botra.png';
    let vcardMessage = {
        key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' },
        message: {
            contactMessage: {
                displayName: config.BOT_NAME,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN: RUDHRA-BOT\nitem1.TEL;waid=${message.sender.split('@')[0]}:${message.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
            },
        },
    };
    
    const start = new Date().getTime();
    
    // Send the initial "Pinging..." message
    let pingMsg = await client.sendMessage(message.jid, { text: 'Pinging...' }, { quoted: vcardMessage });

    const end = new Date().getTime();
    const ms = end - start;

    await client.relayMessage(
        message.jid,
        {
            protocolMessage: {
                key: pingMsg.key,
                type: 14,
                editedMessage: {
                    conversation: `Pong ${ms}ms`,
                },
            },
        },
        {}
    );
});

rudhra({
	pattern: "jid ?(.*)",
	fromMe: mode,
	desc: 'To get remoteJid',
	type: 'info'
}, async (message) => {
	await message.send(message.mention[0] ? message.mention[0] : message.quoted ? message.quoted.sender : message.chat)
});
rudhra({
	pattern: 'runtime$',
	fromMe: mode,
	desc: 'Get bots runtime',
	type: 'info'
}, async (message, match, client) => {
	await message.reply(formatTime(process.uptime()));
});
rudhra(
	{
		pattern: 'save ?(.*)',
		fromMe: mode,
		desc: 'forward replied msg to u',
		type: 'misc',
	},
	async (message, match) => {
		if (!message.reply_message)
			return await message.send('*Reply to a message*');
		await message.forwardMessage(message.sender, message.quoted.data);
	}
);
