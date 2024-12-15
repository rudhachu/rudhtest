 const { rudhra,mode} = require("../lib/");
const Jimp = require("jimp");

rudhra(
  {
    pattern: "fullpp$",
    fromMe: true,
    desc: "Set full screen profile picture",
    type: "user",
  },
  async (message, match, client) => {
    if (!message.reply_message.image)
      return await message.reply("_Reply to a photo_");
    let media = await message.quoted.download("buffer");
    await updateProfilePicture(message.user, media, message);
    return await message.reply("_Profile Picture Updated_");
  }
);
 rudhra(
  {
    pattern: "gpp$",
    fromMe: true,
     onlyGroup: true,
    desc: "Set full screen profile picture",
    type: "group",
  },
  async (message, match, client) => {
    if (!message.reply_message.image)
      return await message.reply("_Reply to a photo_");
    let media = await message.quoted.download("buffer");
    await updateProfilePicture(message.chat, media, message);
    return await message.reply("_Profile Picture Updated_");
  }
);

async function updateProfilePicture(jid, imag, message) {
  const { query } = message.client;
  const { img } = await generateProfilePicture(imag);
  await query({
    tag: "iq",
    attrs: {
      to: jid,
      type: "set",
      xmlns: "w:profile:picture",
    },
    content: [
      {
        tag: "picture",
        attrs: { type: "image" },
        content: img,
      },
    ],
  });
}

async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}