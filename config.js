const { Sequelize } = require("sequelize");
const fs = require("fs");
require('dotenv').config();

if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env', override: true });

// Function to convert text to boolean
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

// Function to convert string to boolean
const toBool = (x) => (x && x.toLowerCase() === 'true') || false;
global.apiUrl = 'https://api.maskser.me/'
global.eypzApi = 'https://api.kps.c0m.in/'

// Define the Sequelize instance based on DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL === undefined ? './database.db' : process.env.DATABASE_URL;
DEBUG = process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG);
// Export configuration variables
module.exports = {
  BRANCH: "main",
  ADMIN_ACCESS: toBool(process.env.ADMIN_ACCESS) || false,
  ANTILINK_ACTION: process.env.ANTI_LINK || "kick",
  ANTILINK: toBool(process.env.ANTI_LINK) || true,
  AUTHOR: process.env.AUTHOR || "Ƥ ʀ ɪ ɴ ᴄ ᴇ  Ʀ ᴜ ᴅ ʜ",
  AUDIO_DATA: process.env.AUDIO_DATA || "Ʀ ᴜ ᴅ ʜ ʀ λ;Ƥ ʀ ɪ ɴ ᴄ ᴇ  Ʀ ᴜ ᴅ ʜ;https://raw.githubusercontent.com/rudhra-prh/media/main/image/rudhra2.jpg",
  BOT_NAME: process.env.BOT_NAME || "Ʀᴜᴅʜʀᴀ ʙᴏᴛ",
  CAPTION: process.env.CAPTION || "ʀᴜᴅʜʀᴀ ʙᴏᴛ",
  DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || false,
  DISABLE_PM: toBool(process.env.DISABLE_PM) || false,
  ERROR_MSG: toBool(process.env.ERROR_MSG) || true,
  HANDLERS: (process.env.PREFIX || '^[.,!]').trim(),
  LANG: process.env.LANGUAGE === undefined ? 'EN' : process.env.LANGUAGE.toUpperCase(),
  LOG_MSG: toBool(process.env.LOG_MSG) || true,
  MODE: (process.env.MODE || 'private').toLowerCase(),
  MENU_BUTTON: process.env.MENU_BUTTON || true,
  MENU_URL: process.env.MENU_URL || "https://raw.githubusercontent.com/rudhra-prh/media/main/image/rudhra3.jpeg",
  OWNER_NAME: process.env.OWNER_NAME || "ʀᴜᴅʜʀᴀɴ",
  PROCESSNAME: process.env.PROCESSNAME || "Ʀ ᴜ ᴅ ʜ ʀ λ",
  READ_CMD: toBool(process.env.READ_CMD),
  READ_MSG: toBool(process.env.READ_MSG),
  SESSION_ID: process.env.SESSION_ID || "null",
  STICKER_PACKNAME: process.env.STICKER_PACKNAME || "ʀᴜᴅʜʀᴀ-ʙᴏᴛ,",
  AUTHOR: process.env.AUTHOR || "Ƥ ʀ ɪ ɴ ᴄ ᴇ  Ʀ ᴜ ᴅ ʜ",
  STICKER_DATA: process.env.STICKER_DATA || "Ʀ ᴜ ᴅ ʜ ʀ λ;Ƥ ʀ ɪ ɴ ᴄ ᴇ  Ʀ ᴜ ᴅ ʜ",
  SUDO: process.env.SUDO || '919895809960',
  WARN_COUNT:process.env.WARN_COUNT || 4,
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  HEROKU: toBool(process.env.HEROKU) || false,
  KOYEB_API_KEY: process.env.KOYEB_API_KEY || "koyeb_api_key",
  KOYEB_APP_NAME: process.env.KOYEB_APP_NAME || '',
  KOYEB: toBool(process.env.KOYEB) || false,
  TERMUX: toBool(process.env.TERMUX) || false,
  DATABASE_URL: DATABASE_URL,
  DATABASE:
       DATABASE_URL === './database.db' ? new Sequelize({dialect: 'sqlite', storage: DATABASE_URL, logging: false,}) : new Sequelize(DATABASE_URL, {dialect: 'postgres', ssl: true, protocol: 'postgres', dialectOptions: {native: true, ssl: { require: true, rejectUnauthorized: false },}, logging: false,}),
  DEBUG: DEBUG
};
