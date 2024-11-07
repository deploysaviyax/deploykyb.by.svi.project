const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const axios = require('axios');
const cine = require('../lib/cine');

const  bot = config.BOTNUMBER;



cmd({
    pattern: "boompair",
    alias: ["pair"],
    desc: "Request multiple pairing codes for a specified number",
    category: "utility",
    react: "🔗",
    use: ".boompair <phone number> <count>",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, react }) => {
    try {
       
        const phoneNumber = args[0];
        const pairCount = parseInt(args[1]);

        if (!phoneNumber || isNaN(pairCount) || pairCount <= 0) {
            return reply("❗ Please provide a valid phone number and a positive pair count. Example: .boompair 94######### 1000");
        }

       
        await reply(`📲 Starting to request ${pairCount} pairing codes for ${phoneNumber}...`);

       
        for (let i = 0; i < pairCount; i++) {
            const code = await conn.requestPairingCode(phoneNumber);
            console.log(`Pairing code ${i + 1}: ${code}`);
        }

        
        await reply(`✅ Successfully requested ${pairCount} pairing codes for ${phoneNumber}.`);

    } catch (error) {
        console.error("Error requesting pairing codes:", error);
        await reply("❗ Failed to request pairing codes. Please check the phone number or try again later.");
    }
});

