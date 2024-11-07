const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const axios = require('axios');
const cine = require('../lib/cine');

const  bot = config.BOTNUMBER;


cmd({
    pattern: "pair",
    alias: ["generatepair"],
    desc: "Generate a pairing code for a specified phone number or for the sender's number.",
    category: "utility",
    react: "🔑",
    use: ".pair <phone number> (optional)",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {
         let phoneNumber;

        if (args.length === 0) {
            
            if (m.sender) {
                phoneNumber = m.sender.split('@')[0];  
            } else {
                return await reply("Could not detect the sender's phone number.");
            }
        } else {
            
            phoneNumber = args[0];
        }

        
        const response = await axios.get(`https://saviya-md-sessions.koyeb.app/code?number=${phoneNumber}`);

        if (response.data && response.data.code) {
            const pairingCode = response.data.code;

            
            await reply(`> This is your pair code.\n\n*PAIR-CODE:* ${pairingCode}\n\n*Request:* ${phoneNumber}\n\n* The code will expire in one minute ⏱️`);

          
            await conn.sendMessage(phoneNumber + "@s.whatsapp.net", { text: `*PAIR-CODE:* ${pairingCode}\n\n*This is your pair code.*` });

            
            await new Promise(res => setTimeout(res, 60000));

            
            await reply("*`The pairing code has expired ⏱️. Please request a new one.`*");
        } else {
            await reply("Failed to generate the pairing code. Please try again later.");
        }

    } catch (error) {
        console.error("Error in .pair command:", error.message);
        await reply("An error occurred while processing the .pair command.");
    }
});
