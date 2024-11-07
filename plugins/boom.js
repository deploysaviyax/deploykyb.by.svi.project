const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const cine = require('../lib/cine');



const  bot = config.BOTNUMBER;

cmd({
    pattern: "boom",
    react: "💥",
    alias: ["spam"],
    desc: "Send a specified number of spam messages.",
    category: "fun",
    use: '.boom <number>,<message>',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {
        if(config.DOWNLOADSAPI !== ''){
            if(isGroup){
                const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
                if(fsh && (fsh?.error || fsh?.data?.type == 'false')) return;
            } else {
                const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
                if(fshh && (fshh?.error || fshh?.data?.type == 'false')) return;
            }
        } else {
            return await reply(mg.devoffsetting);
        }
        
        const [numStr, ...messageParts] = args.join(' ').split(',');
        const message = messageParts.join(',').trim();
        const num = parseInt(numStr.trim());

        if (isNaN(num) || num <= 0) {
            return reply('Please provide a valid number greater than 0.');
        }
        if (!message) {
            return reply('Please provide a message to send.');
        }

        for (let i = 0; i < num; i++) {
            await conn.sendMessage(from, { text: message }, { quoted: mek });
        }

        reply(`*Sent ${num} messages.*`);
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});


cmd({
    pattern: "jboom",
    react: "💥",
    alias: ["jb"],
    desc: "Send a specified number of spam messages to a JID address.",
    category: "fun",
    use: '.jboom <number>,<message>,<jid>',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {
        if(config.DOWNLOADSAPI !== ''){
            if(isGroup){
                const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
                if(fsh && (fsh?.error || fsh?.data?.type == 'false')) return;
            } else {
                const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
                if(fshh && (fshh?.error || fshh?.data?.type == 'false')) return;
            }
        } else {
            return await reply(mg.devoffsetting);
        }
        
        const [numStr, ...messageParts] = args.join(' ').split(',');
        const message = messageParts.slice(0, -1).join(',').trim();
        const jid = messageParts[messageParts.length - 1].trim();
        const num = parseInt(numStr.trim());

        if (isNaN(num) || num <= 0) {
            return reply('Please provide a valid number greater than 0.');
        }
        if (!message) {
            return reply('Please provide a message to send.');
        }
        if (!jid) {
            return reply('Please provide a JID address.');
        }

        for (let i = 0; i < num; i++) {
            await conn.sendMessage(jid, { text: message });
        }

        reply(`*Sent ${num} messages to ${jid}.*`);
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});


