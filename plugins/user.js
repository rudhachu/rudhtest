const { rudhra,mode, isAdmin ,parsedJid} = require("../lib");
rudhra(
  {
    pattern: 'block ?(.*)',
    fromMe: true,
    desc: "Block a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.block(jid);
      return await message.sendMessage(
        `_@${jid.split("@")[0]} Blocked_`,
        {
          mentions: [jid],
        }
      );
    } else {
      await message.block(message.jid);
      return await message.reply("_User blocked_");
    }
  }
);

rudhra(
  {
    pattern: "unblock",
    fromMe: true,
    desc: "Unblock a person",
    type: "user",
  },
  async (message, match) => {
    if (message.isGroup) {
      let jid = message.mention[0] || message.reply_message.jid;
      if (!jid) return await message.reply("_Reply to a person or mention_");
      await message.unblock(jid);
      return await message.sendMessage(
        message.jid,
        `_@${jid.split("@")[0]} unblocked_`,
        {
          mentions: [jid],
        }
      );
    } else {
      await message.unblock(message.jid);
      return await message.reply("_User unblocked_");
    }
  }
);
rudhra({pattern: '🤗 ?(.*)', fromMe: true,dontAddCommandList: true, desc: 'Forward replied msg to you ðŸ¤—', type: 'user'}, async (message, match, client) => {return});
rudhra({on: 'text', fromMe: true, dontAddCommandList: true, desc: 'Forward replied msg to you ðŸ¤—', type: 'user'}, async (message, match, client) => {
if (message.message.startsWith("🤗")) { try { 
let msg = message.message.replace("🤗", "");
if (message.reply_message) { await message.forwardMessage(message.sender, message.quoted.data);
      }
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  }
});
rudhra({ on: 'text', fromMe: true, dontAddCommandList: true }, async (message, match, client) => { 
if (message.message.startsWith("•")) { try { 
let msg = message.message.replace("•", "");
if (message.reply_message) { await message.forwardMessage(message.sender, message.quoted.data);
      }
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  }
});
rudhra({ on: 'text', fromMe: true, dontAddCommandList: true }, async (message, match, client) => { 
if (message.message.startsWith("°")) { try { 
let msg = message.message.replace("°", "");
if (message.reply_message) { await message.forwardMessage(message.sender, message.quoted.data);
      }
    } catch (error) {
      console.error('Error forwarding message:', error);
    }
  }
});
rudhra(
  {
    pattern: "forward ?(.*)",
    fromMe: true,
    desc: "Forwards the replied Message",
    type: "user",
  },
  async (message, match) => {
    if (!message.quoted) return message.reply('Reply to something');
    
    let jids = parsedJid(match);
    for (let i of jids) {
      const rudh = {
        text: message.quoted ? message.quoted.message : "Replied message",
        contextInfo: {
          isForwarded: false
        }
      };
      
      await message.forwardMessage(i, message.reply_message.data, rudh);
    }
  }
);
