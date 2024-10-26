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
}, async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {
        
 if (isGroup) {
            const groupCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`);
            if (groupCheck && (groupCheck?.error || groupCheck?.data?.type == 'false')) return;
        } else {
            const userCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`);
            if (userCheck && (userCheck?.error || userCheck?.data?.type == 'false')) return;
        }    
        
        if (!q) {
            return await reply("Please provide a question for Meta LLaMA 2 AI. Example: .meta What is AI?");
        }

        
        await conn.sendPresenceUpdate('composing', from);

        
        const apiUrl = `https://api.nexoracle.com/ai/meta-llama2?apikey=free_key@maher_apis&prompt=${encodeURIComponent(q)}`;

        
        const response = await axios.get(apiUrl);

       
        if (response.data.status === 200 && response.data.result) {
            await conn.sendMessage(from, { text: response.data.result });
        } else {
            await reply("Failed to fetch a response from Meta LLaMA 2 AI. Please try again later.");
        }

    } catch (e) {
        console.error(e);
        await reply(`An error occurred: ${e.message}`);
    } finally {
        
        await conn.sendPresenceUpdate('paused', from);
    }
});
