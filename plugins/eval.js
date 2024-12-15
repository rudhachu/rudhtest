const {
	rudhra,
	mode,
	getJson,
	getBuffer,
	PREFIX,
	toAudio,
	toPTT,
	toVideo,
	ffmpeg,
	isAdmin,
	parsedJid,
	isNumber,
	getRandom,
	qrcode,
	isIgUrl,
	imageToWebp,
	videoToWebp,
	writeExifImg,
	writeExifVid,
	writeExifWebp,
	parsedUrl,
	isUrl,
	jsonFormat,
	formatTime,
	getFile,
	sleep,
	serialize,
	Imgur,
	numToJid,
	sudoIds,
	postJson,
	Imgbb,
	getUrl,
	igdl,
	uploadToServer
} = require("../lib/");
const util = require('util');
const axios = require("axios");
const cheerio = require("cheerio");
const {     StoreDB,
    getstore,
    storeWriteToDB,
      saveMessage,
  loadMessage,
  saveChat,
  getName } = require("../lib/database/store");
const config = require ('../config')
rudhra({pattern: '> ?(.*)', fromMe: true,dontAddCommandList: true, desc: 'Run js code (evel)', type: 'misc'}, async (message, match, client) => {return});
rudhra({on: 'text', fromMe: true, dontAddCommandList: true,desc: 'Run js code (evel)', type: 'misc'}, async (message, match, client) => {
if(message.message.startsWith(">")){
const m = message;
try {
let evaled = await eval(`${message.message.replace(">","")}`) 
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled); 
await message.reply(evaled) 
} catch (err) {
await message.reply(util.format(err))
}}
})

rudhra({on:'text', fromMe: true,dontAddCommandList: true}, async (message, match, client) => {
if (message.message.startsWith("$")) {
var m = message
var conn = message.client
const util = require('util')
const json = (x) => JSON.stringify(x,null,2)
try { let return_val = await eval(`(async () => { ${message.message.replace("$","")} })()`)
if (return_val && typeof return_val !== 'string') return_val = util.inspect(return_val)
if (return_val) await message.send(return_val || "No return value")} catch (e) {
if (e) await message.send(util.format(e))}
}
})