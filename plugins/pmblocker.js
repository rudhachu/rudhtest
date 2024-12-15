const { rudhra,pmBlock,pmb} = require('../lib/');
rudhra({
    pattern: "pmblocker ?(.*)",
    fromMe: true,
    desc: "personal message controller",
    type: "user",
}, async (message, match) => {
 await pmb(message, match)
});
rudhra(
  {
    on: 'message',
    fromMe: false,
  },
  async (message) => {
    await pmBlock(message);
  }
);