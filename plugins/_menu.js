const { rudhra, mode, sendMenu, sendSegMenu,setMenuType } = require("../lib/");

rudhra({
    pattern: "menu ?(.*)",
    desc: "rudhra-bot user manual",
    fromMe: mode,
    type: "user",
}, async (message, match) => {
    await sendMenu(message, match);
});
rudhra({
    pattern: "setmenu ?(.*)",
    desc: "rudhra-bot menu control panel",
    fromMe: true,
    type: "user",
}, async (message, match) => {
    await setMenuType(message, match);
});

const pluginTypes = ['downloader', 'info', 'whatsapp', 'group', 'media', 'AnimeVideo', 'user', 'help'];

pluginTypes.forEach((type) => {
    rudhra({
        pattern: `.${type}$`,
        fromMe: mode,
        dontAddCommandList: true,
    }, async (message, match) => {
        await sendSegMenu(message, match, type);
    });
});
