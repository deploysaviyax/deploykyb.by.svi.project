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
    alias: ["llama"],
    desc: "Ask Meta LLaMA 2 AI any question.",
    category: "AI",
    react: "🤖",
    use: '.meta <your question>',
    filename: __filename
}, async (conn, mek, m, { from, q, isGroup, sender, reply }) => {
    try {
        
        // Ensure question is provided
        if (!q) {
            return await reply("Please provide a question for Meta LLaMA 2 AI. Example: .meta What is AI?");
        }

        // Send typing indicator
        await conn.sendPresenceUpdate('composing', from);

        // Define API endpoint and key
        const apiKey = 'free_key@maher_apis';
        const apiUrl = `https://api.nexoracle.com/ai/meta-llama2?apikey=${apiKey}&prompt=${encodeURIComponent(q)}`;

        // Fetch response from the API
        const response = await axios.get(apiUrl);

        // Check if the response is successful
        if (response.status === 200 && response.data.result) {
            await conn.sendMessage(from, { text: response.data.result });
        } else {
            // Handle forbidden or failed requests
            if (response.status === 403) {
                await reply("Authorization error: Invalid or expired API key. Please verify the API key.");
            } else {
                await reply("Failed to fetch a response from Meta LLaMA 2 AI. Please try again later.");
            }
        }

    } catch (e) {
        console.error(e);
        await reply(`An error occurred: ${e.message}`);
    } finally {
        // End typing indicator
        await conn.sendPresenceUpdate('paused', from);
    }
});
