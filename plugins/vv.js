const { rudhra,mode } = require('../lib/');
rudhra(
  {
    pattern: "vv",
    fromMe: mode,
    desc: "Forwards The View once messsage",
    type: "downloader",
  },
  async (message, match) => {
  	if(!message.quoted) return;
    let buff = await message.quoted.download("buffer");
    return await message.sendFile(buff);
  }
);