const { PREFIX, mode, commands } = require("./events");
const version = require("../package.json").version;
const { getJson } = require("./utils");
const config = require("../config");
const { hostname } = require("os");
const { getMenu,setMenu } = require("./database/menu");

async function sendMenu(message, match) {
    if (match) {
        for (let i of commands) {
            if (i.pattern instanceof RegExp && i.pattern.test(`${PREFIX}` + match)) {
                const cmdName = i.pattern.toString().split(/\W+/)[1];
                message.reply(`\`\`\`🤖Command: ${PREFIX}${cmdName.trim()}\nDescription: ${i.desc}\`\`\``);
            }
        }
    } else {
        const link = config.MENU_URL;
        const hrs = new Date().getHours({ timeZone: 'Asia/Kolkata' });
        const type = mode ? "Private" : "Public";
        var msg = await getMenu();
        
        let [date, time] = new Date()
        .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        .split(",");
        let wish = '';
        if (hrs < 12) wish = '⛅𝗚𝗼𝗼𝗱 𝗠𝗼𝗿𝗻𝗶𝗻𝗴 ';
        else if (hrs >= 12 && hrs <= 16) wish = '🌞𝗚𝗼𝗼𝗱 𝗔𝗳𝘁𝗲𝗿𝗻𝗼𝗼𝗻';
        else if (hrs >= 16 && hrs <= 20) wish = '🔆𝗚𝗼𝗼𝗱 𝗘𝘃𝗲𝗻𝗶𝗻𝗴';
        else if (hrs >= 20 && hrs <= 24) wish = '🌙𝗚𝗼𝗼𝗱 𝗡𝗶𝗴𝗵𝘁';
        if(msg.value === "button"){
        const url = await message.ParseButtonMedia(link);
        let buttonArray = [
                { type: "reply", params: { display_text: "DOWNLOADER", id: `${PREFIX}.downloader` } },
                { type: "reply", params: { display_text: "INFO", id: `${PREFIX}.info` } },
                { type: "reply", params: { display_text: "MEDIA", id: `${PREFIX}.media` } },
                { type: "reply", params: { display_text: "⦙☰  ALL MENU", id: `${PREFIX}help` } },
                { type: "reply", params: { display_text: "USER", id: `${PREFIX}.user` } },
            ];

        const taxt = `╭───────────────────
│       Hey 👋  ${message.pushName}
│            ${wish.replace(/[\r\n]+/gm, "")}
│〄  *Bot Name* : ${config.BOT_NAME} 
│〄  *Version*  : ${version}
│〄  *Server* : ${hostname().split("-")[0]}
│〄  *Time*  : ${time}
│〄  *Date*  : ${date}
│〄  *Mode*  : ${type}
│〄  *Prefix*  : ${PREFIX}
│〄  *Commands*  :  ${commands.length}
│          
│         █║▌║▌║║▌║ █
│          ʀ   ᴜ   ᴅ   ʜ   ʀ   ᴀ
│      
╰────────────────────`;


        buttonArray.sort((a, b) => a.params.display_text.localeCompare(b.params.display_text));

        let data = {
                jid: message.jid,
                button: buttonArray,
                header: {
                    title: taxt,
                    subtitle: taxt,
                    hasMediaAttachment: true,
                },
                footer: {
                    text: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀᴜᴅʜʀᴀ`,
                },
                body: {
                    text: "",
                },
            };

        if (link.endsWith(".mp4")) {
            data.header.videoMessage = url;
        } else {
            data.header.imageMessage = url;
        }

        return await message.sendMessage(message.jid, data, {}, "interactive");
    }else if( msg.value === "text" ){

    const readMore = String.fromCharCode(8206).repeat(4001);
    let [date, time] = new Date()
        .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        .split(",");
        let menu = `┌───────────────────···•
│╭───────────────···▸
┴│      Hey 👋  ${message.pushName}
⬡│         ${wish.replace(/[\r\n]+/gm, "")}
⬡│▸   *Bot Name* : ${config.BOT_NAME} 
⬡│▸   *Version*  : ${version}
⬡│▸   *Server* : ${hostname().split("-")[0]}
⬡│▸   *Time* : ${time}
⬡│▸   *Date*  : ${date}
⬡│▸   *Mode*  : ${mode ? 'Private' : 'Public'}
⬡│▸   *Prefix*  : ${PREFIX}
⬡│▸   *Commands*  :  ${
                    commands.filter((command) => command.pattern).length
                  }
⬡│            
⬡│           █║▌║▌║║▌║ █
┬│            ʀ   ᴜ   ᴅ   ʜ   ʀ   ᴀ
│╰────────────────···▸
╰───────────────────···•\n ${readMore}`;

        let cmnd = [];
        let cmd;
        let category = [];
        commands.forEach((command, num) => {
          if (command.pattern instanceof RegExp) {
            cmd = String(command.pattern).split(/\W+/)[1];
          }

          if (!command.dontAddCommandList && command.pattern) {
            let type = command.type ? command.type.toLowerCase() : "misc";

            cmnd.push({ cmd, type });

            if (!category.includes(type)) category.push(type);
          }
        });
        cmnd.sort();
        category.sort().forEach((cmmd) => {
          menu += `\n┌───〈 *${cmmd.toUpperCase()}* 〉───◆`;
          menu += `\n│╭─────────────···▸`;
          menu += `\n┴│▸`;
          let comad = cmnd.filter(({ type }) => type == cmmd);
          comad.forEach(({ cmd }) => {
          menu += `\n⬡│▸  ${cmd.trim()}`; 
          });
          menu += `\n┬│▸`;
          menu += `\n│╰────────────···▸▸`;
          menu += `\n└───────────────···▸`;
        });
        menu += `\n\n${config.BOT_NAME}`;
        let mediaUrl = config.MENU_URL;
        return await message.sendFromUrl(mediaUrl, { fileLength: "5555544444", gifPlayback: true, caption: menu }, { quoted: message });
        	
    }
    }
}

async function sendSegMenu(message, match, type) {
    let msg = ' *Here Are The Available Commands* \n\n';
    let no = 1;

    commands.map((command) => {
        if (command.type === type && !command.dontAddCommandList && command.pattern) {
            const commandName = command.pattern.toString().match(/(\W*)([A-Za-z0-9_ğüşiö ç]*)/)[2].trim();
            msg += `╭─────────┈•\n`;
            msg += `│  *${no++}. ${commandName}*\n`;
            msg += `├──•\n`;
            msg += `│ ${command.desc}\n`;
            msg += `╰─────────────┈◉\n\n`;
        }
    });

    await message.reply(msg.trim());
}
async function setMenuType(message, match) {
	const link = config.MENU_URL;
    const url = await message.ParseButtonMedia(link);
    const menuType = await getMenu();
    const menutyp = menuType.value
    const menuvalue = menutyp === 'text' ? 'v1' : 'v2';

    if (!match) {
        const buttonArray = [
            { type: "reply", params: { display_text: "V1", id: `${PREFIX}setmenu v1` } },
            { type: "reply", params: { display_text: "V2", id: `${PREFIX}setmenu v2` } },
        ];

        const footerText = `MENU TYPE: ${menuvalue}`;
        const data = {
            jid: message.jid,
            button: buttonArray,
            header: { title: "*Rudhra Menu Control panel*", subtitle: "Rudhra Menu Control panel", hasMediaAttachment: true },
            footer: { text: footerText },
            body: { text: "" },
        };

        if (link.endsWith(".mp4")) {
            data.header.videoMessage = url;
        } else {
            data.header.imageMessage = url;
        }

        return await message.sendMessage(message.jid, data, {}, "interactive");
    }

       if (match === 'v1') {
        await setMenu({ value: "text" });
        return await message.send('Menu type changed to v1');
    } else if (match === 'v2') {
        await setMenu({ value: "button" });
        return await message.send('Menu type changed to v2');
    } 
}


module.exports = { sendMenu, sendSegMenu,setMenuType };
