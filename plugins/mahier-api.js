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
        // Initialize the text to convert
        let textToConvert;

        // Check if there's a quoted message
        if (quoted && quoted.type === 'conversation') {
            textToConvert = quoted.text; // Get text from the quoted message
        } else {
            textToConvert = m.text.replace(/^\.\w+\s*/, ''); // Get text from the command message
        }

        // Validate the extracted text
        if (!textToConvert) {
            return reply("*Please provide text to generate a QR code, or quote a message.*");
        }

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

        // Send the QR code image
        await conn.sendMessage(from, {
            image: { url: qrCodeUrl },
            caption: `*QR Code for:* ${textToConvert}`
        }, { quoted: mek });

        // Edit the previous loading message to indicate completion
        await conn.sendMessage(from, { text: "*✅ QR code generated successfully! ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});
