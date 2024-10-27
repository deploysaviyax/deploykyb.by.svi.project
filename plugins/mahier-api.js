const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const axios = require('axios');
const cine = require('../lib/cine');

const  bot = config.BOTNUMBER;



cmd({
    pattern: "toqr",
    react: "📱",
    alias: ["qr"],
    desc: "Generate a QR code from quoted text",
    category: "utility",
    use: '.toqr <text> or reply to a message',
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted }) => {
    try {
        
        const textToConvert = quoted && quoted.type === 'conversation' ? quoted.text : m.text;

        if (!textToConvert) return reply("*Please provide text to generate a QR code, or quote a message.*");

        
        const { key } = await conn.sendMessage(from, { text: '*🔍 Generating QR code...*' }, { quoted: mek });

        
        const apiUrl = `https://api.nexoracle.com/misc/generate-qr?apikey=free_key@maher_apis&text=${encodeURIComponent(textToConvert)}`;

        
        const response = await fetch(apiUrl);
        const data = await response.json();

        
        if (data.error) {
            await conn.sendMessage(from, { text: `*Error generating QR code:* ${data.error}`, edit: key });
            return;
        }

        
        const qrCodeUrl = data.qrCodeUrl; 

        
        

       
        await conn.sendMessage(from, {
            image: { url: qrCodeUrl },
            caption: `*QR Code for:* ${textToConvert}\n\n${mg.botname}`
        }, { quoted: mek });

       
        await conn.sendMessage(from, { text: "*✅ QR code generated successfully! ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});
