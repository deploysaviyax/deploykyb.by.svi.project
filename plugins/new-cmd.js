const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const cine = require('../lib/cine');
let { getDevice } = require('@whiskeysockets/baileys');
const translate = require('@vitalets/google-translate-api');


const  bot = config.BOTNUMBER;

cmd({
    pattern: "eval",
    react: "💻",
    desc: "Evaluate and execute JavaScript code on the server",
    category: "main",
    use: '',
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
    if (!isSaviya && !isOwner) return reply("*You don't have permission to use this command.*");

    try {
        
        const code = args.join(" ");

        const context = {
            conn,
            mek,
            from,
            sender,
            quoted,
            reply,
            m
        };

        
        const result = await (new Function('with (this) { return eval(arguments[0]); }')).call(context, code);
       
        if (typeof result === 'object') {
            reply(JSON.stringify(result, null, 2));
        } else {
            reply(result ? result.toString() : 'No result');
        }

    } catch (e) {
        
        reply(`Error: ${e.message}`);
        console.error(e);
    }
});


cmd({
    pattern: "id",
    react: "🔖",
    desc: "Returns the unique session/message ID for the user",
    category: "main",
    use: '',
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
    try {
        
if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        const msgId = quoted ? quoted.id : mek.key.id;

        reply(msgId);
    } catch (e) {
       
        reply("An error occurred while fetching the ID.");
        console.error(e);
    }
});


cmd({
    pattern: "invite",
    react: "🖇️",
    desc: "Generates an invite link for the group",
    category: "main",
    use: '',
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
    if (!isGroup) return reply("This command can only be used in groups.");
    if (!isOwner && !isSachintha && !isMe && !isAdmins) return reply("*You don't have permission to use this command.*");

    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        const inviteCode = await conn.groupInviteCode(from); // Get the invite code for the group
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`; // Construct the invite link
        reply(`*💡Here is the invite link for this group:* ${inviteLink}`);
    } catch (e) {
        reply("ඇඩ්මින් නැතුව Link ගන්න බැ මැණික");
        console.error(e);
    }
});


cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: '.yts lelena',
    react: "🔎",
    desc: "Search and get details from youtube.",
    category: "search",
    filename: __filename

},

async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isSaviya, isSachintha, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }


if (!q) return reply('*Please give me words to search*')
try {
let yts = require("yt-search")
var arama = await yts(q);
} catch(e) {
    l(e)
return await conn.sendMessage(from , { text: '*Error !!*' }, { quoted: mek } )
}
var mesaj = '';
arama.all.map((video) => {
mesaj += ' *🖲️' + video.title + '*\n🔗 ' + video.url + '\n\n'
});
await conn.sendMessage(from , { text:  mesaj }, { quoted: mek } )
} catch (e) {
    l(e)
  reply('*Error !!*')
}
});


cmd({
    pattern: "tagall",
    alias: ["mentionall"],
    use: '.tagall [message]',
    react: "📢",
    desc: "Tag all members in the group with a formatted message.",
    category: "group",
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
    try {
        if (!isGroup) return reply('*This command can only be used in groups.*');
        if (!isOwner) return reply("*You don't have permission to use this command.*");

        if (!q) return reply('*Please provide a message to tag all members with.*');

        let mentionString = '';
        const mentions = [];

        for (const participant of participants) {
            mentionString += `* @${participant.id.split('@')[0]}\n`;
            mentions.push(participant.id);
        }

        const formattedMessage = `
*🎙️ GROUP ANNOUNCEMENT 🎙️*

───────────────────────

${q}

───────────────────────

${mentionString}`;

        await conn.sendMessage(from, {
            text: formattedMessage,
            mentions: mentions
        }, { quoted: mek });

    } catch (e) {
        l(e);
        reply('*An error occurred while processing your request.*');
    }
});




cmd({
    pattern: "device",
    alias: ["getdevice"],
    desc: "Get the device type of a user (iOS, Android, or Web).",
    category: "info",
    react: "📱",
    use: ".device <reply to a message>",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Check if a message was quoted
        if (!quoted || !quoted.id) {
            return reply('*Please reply to a message to get the device info.*');
        }

        // Fetch device information of the quoted message
        const deviceInfo = await getDevice(quoted.id ? quoted.id : m.key.id);

        // Map device type to more specific details (iOS, Android, or Web)
        let deviceType;
        switch (deviceInfo) {
            case 'web':
                deviceType = 'WhatsApp Web';
                break;
            case 'android':
                deviceType = 'WhatsApp Android';
                break;
            case 'ios':
                deviceType = 'WhatsApp iOS';
                break;
            default:
                deviceType = 'Unknown Device';
                break;
        }

        // Send the result to the user
        await conn.sendMessage(from, { text: `*📱Device Type:* _${deviceType}_` }, { quoted: mek });

    } catch (e) {
        // Detailed error logging
        console.error('Error occurred while retrieving the device information:', e);
        reply('An error occurred while retrieving the device information.');
    }
});


cmd({
    pattern: "trt",
    alias: ["translate"],
    desc: "Translate text to a specified language.",
    category: "utility",
    react: "🌍",
    use: ".trt <language_code> <text>",
    filename: __filename,
}, async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        // Ensure there are enough arguments
        if (args.length < 2) {
            return reply('*Usage: .trt <language_code> <text>*');
        }

        // Extract the language code and text
        const langCode = args[0];
        const textToTranslate = args.slice(1).join(' '); // Combine the rest of the arguments as text

        // Perform translation
        const result = await translate(textToTranslate, { to: langCode });

        // Send the translated text to the user
        await conn.sendMessage(from, { text: `*🌍 Translated Text:* _${result.text}_` }, { quoted: mek });

    } catch (e) {
        // Detailed error logging
        console.error('Error occurred while translating the text:', e);
        reply('An error occurred while translating the text.');
    }
});
