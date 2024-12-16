const { rudhra, mode, formatTime, numToJid } = require('../lib/');
const { ANTI_DELETE, SUDO } = require("../config");

rudhra({
  on: "delete",
  fromMe: false,
  desc: 'anti delete',
  type: 'whatsapp'
}, async (message) => {
  if (ANTI_DELETE) {
    // Load the deleted message from the store
    let msg = await message.client.store.loadMessage(message.messageId);
    
    // Extract the sender's name (if available)
    let { pushName } = msg.message;
    let name = pushName.trim().replace(/\s+/g, ' ') || "unable to find the name";
    
    // Get the SUDO user ID (fallback to the bot's user ID)
    let sudo = numToJid(SUDO.split(',')[0]) || message.client.user.id;
    
    // Forward the deleted message to the SUDO user
    await message.rudhforwardMessage(sudo, msg.message, {
      contextInfo: {
        isFrowarded: false,
        externalAdReply: {
          title: "deleted message",
          body: `from: ${name}`,
          mediaType: 1,
          thumbnailUrl: "https://i.imgur.com/NezTSpv.png",
          mediaUrl: "https://www.youtube.com/princerudh",
          sourceUrl: "https://www.youtube.com/princerudh"
        }
      },
      quoted: msg.message
    });
  }
});
