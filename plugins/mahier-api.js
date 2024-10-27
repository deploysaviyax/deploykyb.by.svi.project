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
        // Check if the command is used with a quoted message
        const textToConvert = quoted && quoted.type === 'conversation' ? quoted.text : m.text.replace(/^\.\w+\s*/, '');

        if (!textToConvert) return reply("*Please provide text to generate a QR code, or quote a message.*");

        // Send a loading message and save the key for editing later
        const { key } = await conn.sendMessage(from, { text: '*🔍 Generating QR code...*' }, { quoted: mek });

        // Encode the text for the API
        const apiUrl = `https://api.nexoracle.com/misc/generate-qr?apikey=free_key@maher_apis&text=${encodeURIComponent(textToConvert)}`;

        // Fetch the QR code image from the API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check for errors in the API response
        if (data.error) {
            await conn.sendMessage(from, { text: `*Error generating QR code:* ${data.error}`, edit: key });
            return;
        }

        // Assuming the QR code URL is returned in data.qrCodeUrl
        const qrCodeUrl = data.qrCodeUrl; // Adjust based on actual response structure

        // Logo URL to be sent along with the QR code
       

        // Send the QR code image and logo
        await conn.sendMessage(from, {
            image: { url: qrCodeUrl },
            caption: `*QR Code for:* ${textToConvert}\n\n![Logo](${logoUrl})`
        }, { quoted: mek });

        // Edit the previous loading message to indicate completion
        await conn.sendMessage(from, { text: "*✅ QR code generated successfully! ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});

