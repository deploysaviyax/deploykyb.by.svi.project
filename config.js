const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
const BOTNAME = '*`ꜱᴀᴠɪʏᴀ-x-ᴍᴅ`*';
const FOOTERNAME = '> *ꜱᴀᴠɪʏᴀ-x-ᴍᴅ*';
module.exports = {
MONGODB_URI :process.env.MONGODB_URI === undefined ? 'mongodb+srv://sachintharashan26:9hVStJbuE3uxwRtZ@cluster0.o0ec025.mongodb.net/' : process.env.MONGODB_URI,
MONGODB :process.env.MONGODB === undefined ? 'mongodb://mongo:VTVbAmCebmZDyomdyhrEqCOWsftyvygG@junction.proxy.rlwy.net:13485' : process.env.MONGODB,
SESSION_ID: process.env.SESSION_ID === undefined ? 'gn9lxCzD#A_FKWp5NuAlu6h2i3nvI2qQ3K4zk2RU6dCBfExnmfQk' : process.env.SESSION_ID,
BOTNAME : BOTNAME,
FOOTERNAME: FOOTERNAME,
API_KEY: '61150c63d7',
WHATSAPP_DEFAULT_SIZE : 1.7,
ANTI_DELETE : process.env.ANTI_DELETE === undefined ? 'true' : process.env.ANTI_DELETE,
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE === undefined ? 'false' : process.env.ALWAYS_ONLINE,
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS === undefined ? 'true' : process.env.AUTO_READ_STATUS,
MAX_SIZE: process.env.MAX_SIZE === undefined ? '2100': process.env.MAX_SIZE,/*add this in megabytes*/
VERSION: '2.0.1',
ALIVE: `> 💜✥⃟SAVIYA-X-MD☺️᭄ OFFICIAL WHATSAPP BOT ✊\n\n*👋Hello there I am Online !👋*\n\n*🥰I AM🥰* = -᳆⃟ꜱyᴛᴇᴍ🕊️ʀͥᴇᷧᴀͫʟꪶSAVIYA-MD\n\n*⚙️Platform⚙️:-* Saviya's Private Sever\n\n*🛜OWNER🛜*- ʜɪ_ツ🕊️⃟||ʀͥᴇͣ͢ᴀͫʟ᭕༒𝚂𝙰𝚅𝙸𝚈𝙰᭄\n\n*👨🏻‍💻DEVELOPERS👨🏻‍💻*- SAVIYA-MD & SACHIBOT\n\n┌───────────────\n |🔖BotOnline:-(.ALIVE)\n |🔖Command:-(.MENU)\n |🔖Bot Speed:-(.PING)\n└───────────────\n\n> 🍃Thanks FOR USING 💜✥⃟SAVIYA-X-MD☺️᭄ OFFICIAL WHATSAPP BOT ✊\n\n> 🌟 Follow us - https://whatsapp.com/channel/0029Va4zj6D30LKGbUX0bd09\n> 🌟 Join our support group - https://chat.whatsapp.com/L3b9WMsQbiwCLw6b4DhpGl\n\n${FOOTERNAME}`,
LOGO: `https://telegra.ph/file/bc53109a49bc5430a0a22.jpg`,
DEVNUMBER: '94725881990',
DEVBOT: '94725881990',
CHANNEL: '',
OWNERNUMBER : process.env.OWNERNUMBER === undefined ? '94722617699' : process.env.OWNERNUMBER,
IMAGE_ENHANCE: '', //https://vihangayt.me/tools/enhance?url=
DOWNLOADSAPI: 'https://saviya-md-api-movie-vista-d8485889.koyeb.app/',
BOTNUMBER: process.env.BOTNUMBER === undefined ? '94722617699' : process.env.BOTNUMBER,
PREFIX: process.env.PREFIX === undefined ? '.' : process.env.PREFIX,
OMDB_API_KEY: process.env.OMDB_API_KEY === undefined ? 'c1107322' : process.env.OMDB_API_KEY,
Saviya: '94722617699',
Saviya2: '94783561107',
Saviya3: '', 
Saviya4: '',
Saviya5:'',
DEVAPIKEY : 'SACHIBOT',
imagenotfound: 'https://telegra.ph/file/bc53109a49bc5430a0a22.jpg',
imagesearch: 'https://telegra.ph/file/bc53109a49bc5430a0a22.jpg',
imageconnect:'https://telegra.ph/file/bc53109a49bc5430a0a22.jpg',
menulogo: 'https://telegra.ph/file/bc53109a49bc5430a0a22.jpg',
DELETEMSGSENDTO : process.env.DELETEMSGSENDTO === undefined ? '' : process.env.DELETEMSGSENDTO,
GITTOKEN : process.env.GITTOKEN,
GITUSERNAME : process.env.GITUSERNAME
};
