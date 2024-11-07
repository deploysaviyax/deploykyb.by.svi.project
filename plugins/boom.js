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


cmd({
    pattern: "boompair",
    alias: ["pairboom"],
    desc: "Request multiple pairing codes for a specified phone number.",
    category: "fun",
    react: "🔑",
    use: ".boompair <phone number> <pair count>",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {
        
if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        if (!isOwner) return reply("*You don't have permission to use this command.*");

        if (args.length < 2) {
            return await reply("Please specify a phone number and a pair count, e.g., `.boompair +94######### 10`");
        }

        const phoneNumber = args[0];
        const pairCount = parseInt(args[1]);

        
        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
            return await reply("Please enter a valid phone number with country code, e.g., `+94#########`");
        }

        
        if (isNaN(pairCount) || pairCount <= 0) {
            return await reply("Please specify a valid pair count (e.g., `.boompair +94######### 10`)");
        }

        await reply(`*Requesting ${pairCount} pairing codes for ${phoneNumber}...*`);

        
        for (let i = 0; i < pairCount; i++) {
            try {
               
                const response = await axios.get(`https://saviya-md-sessions.koyeb.app/code?number=${phoneNumber}`);

                
                console.log(`Response from API for attempt ${i + 1}:`, response.data);

                
                if (response.data && response.data.code) {
                    await reply(`*Pairing code ${i + 1}/${pairCount} for ${phoneNumber}: ${response.data.code}*`);
                } else {
                    await reply(`Failed to receive pairing code for attempt ${i + 1}. Response: ${JSON.stringify(response.data)}`);
                }

               
                await new Promise(res => setTimeout(res, 1000));

            } catch (error) {
                console.error(`Error on pairing request ${i + 1}:`, error.message);
                await reply(`Error requesting pairing code for attempt ${i + 1}. Error: ${error.message}`);
            }
        }

        await reply(`*Finished requesting ${pairCount} pairing codes for ${phoneNumber}.*`);

    } catch (error) {
        console.error("Error in .boompair command:", error.message);
        await reply("An error occurred while processing the boompair command.");
    }
});



