const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const axios = require('axios');
const cine = require('../lib/cine');
const fs = require('fs');
const pino = require('pino');
const { makeWASocket, useSingleFileAuthState, delay, Browsers, makeCacheableSignalKeyStore } = require('@adiwajshing/baileys');
const path = require('path');


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
async (conn, mek, m, { from, args, reply }) => {
    try {
        const phoneNumber = args[0];
        const pairCount = parseInt(args[1]);

        
        if (!phoneNumber || isNaN(pairCount) || pairCount <= 0) {
            return reply("❗ Please provide a valid phone number and a positive pair count. Example: .boompair 94712345678 100");
        }

        const sessionId = `temp/session_${Date.now()}`;
        const { state, saveCreds } = await useMultiFileAuthState(sessionId);

       
        async function requestPairingCode(sock, num) {
            num = num.replace(/[^0-9]/g, '');
            return await sock.requestPairingCode(num);
        }

        
        let sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }).child({ level: "fatal" }),
            browser: Browsers.macOS("Safari")
        });

       
        await reply(`📲 Requesting ${pairCount} pairing codes for ${phoneNumber}...`);
        for (let i = 0; i < pairCount; i++) {
            try {
                const code = await requestPairingCode(sock, phoneNumber);
                console.log(`Pairing code ${i + 1}: ${code}`);
            } catch (error) {
                console.error(`Error on pairing request ${i + 1}:`, error);
                await reply(`❗ Failed on request ${i + 1}. Stopping further requests.`);
                break;
            }
            await delay(1500);  
        }

        
        sock.ev.on('creds.update', saveCreds);
        await reply(`✅ Requested ${pairCount} pairing codes for ${phoneNumber}.`);

        
        await fs.promises.rm(sessionId, { recursive: true, force: true });
        
    } catch (error) {
        console.error("Error in .boompair command:", error);
        await reply("❗ An error occurred while processing the pairing requests. Please try again.");
    }
});
