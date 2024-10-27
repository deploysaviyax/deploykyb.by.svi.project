const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const axios = require('axios');
const cine = require('../lib/cine');

const  bot = config.BOTNUMBER;



cmd({
    pattern: "meta",
    alias: ["metaai"],
    desc: "Ask Meta AI any question.",
    category: "AI",
    react: "🧠",
    use: '.meta <your question>',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
       
        if (!q) {
            return reply("Please provide a question for Meta AI. Example: .meta What is your name?");
        }

       
        await conn.sendPresenceUpdate('composing', from);

        
        const thinkingTime = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000; 
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        
        const apiUrl = `https://api.nexoracle.com/ai/meta-llama2?apikey=free_key@maher_apis&prompt=${encodeURIComponent(q)}`;

        
        const response = await axios.get(apiUrl);

       
        if (response.data.status !== 200) {
            return reply("Failed to fetch a response from Meta AI. Please try again later.");
        }

       
        const metaResponse = response.data.result;

        
        await conn.sendMessage(from, { text: metaResponse });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        
        await conn.sendPresenceUpdate('paused', from);
    }
});

