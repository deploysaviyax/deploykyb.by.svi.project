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
    alias: ["pairboom"],
    desc: "Request multiple pairing codes for a specified phone number.",
    category: "utility",
    react: "🔑",
    use: ".boompair <phone number> <pair count>",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        if (args.length < 2) {
            return await reply("Please specify a phone number and a pair count, e.g., .boompair +94768268328 10");
        }

        const phoneNumber = args[0];
        const pairCount = parseInt(args[1]);

        if (isNaN(pairCount) || pairCount <= 0) {
            return await reply("Please specify a valid pair count (e.g., .boompair +94768268328 10)");
        }

        await reply(`Requesting ${pairCount} pairing codes for ${phoneNumber}...`);

        for (let i = 0; i < pairCount; i++) {
            try {
                const response = await axios.post('https://saviya-md-sessions.koyeb.app/pair', {
                    number: phoneNumber
                });

                if (response.data && response.data.code) {
                    await reply(`Pairing code ${i + 1}/${pairCount} for ${phoneNumber}: ${response.data.code}`);
                } else {
                    await reply(`Failed to receive pairing code for attempt ${i + 1}`);
                }

               
                await new Promise(res => setTimeout(res, 1000));

            } catch (error) {
                console.error(`Error on pairing request ${i + 1}:`, error.message);
                await reply(`Error requesting pairing code for attempt ${i + 1}`);
            }
        }

        await reply(`Finished requesting ${pairCount} pairing codes for ${phoneNumber}.`);

    } catch (error) {
        console.error("Error in .boompair command:", error.message);
        await reply("An error occurred while processing the boompair command.");
    }
});


