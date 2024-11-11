const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const cine = require('../lib/cine');


const  bot = config.BOTNUMBER;

cmd({
    pattern: "alive",
    react: "👋",
    alias: ["online", "test", "bot"],
    desc: "Check if the bot is online with an audio and image response.",
    category: "general",
    use: '.alive',
    filename: __filename
},
async (conn, mek, m, { from, quoted, isGroup, sender, reply }) => {
    try {
        const config = await readEnv();
        
        if (config.AUTO_VOICE === 'true') {
            const audioUrl = "https://github.com/Saviyakolla/Voice_Database/raw/refs/heads/main/saviya%20main%20voice.MP3";
            await conn.sendPresenceUpdate('recording', from);
            await conn.sendMessage(from, { 
                audio: { url: audioUrl }, 
                mimetype: 'audio/mpeg', 
                ptt: true 
            }, { quoted: mek });
        }
     
        await conn.sendMessage(from, { 
            image: { url: config.LOGO }, 
            caption: config.ALIVE 
        }, { quoted: mek });

    } catch (e) {
        reply('*Error !!*');
        console.error(e);
    }
});

cmd({
    pattern: "restart",
    react: "♻️",
    desc: "restart bot",
    category: "owner",
    use: '.restart',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
try{
    if (!isOwner) return;
    await conn.sendMessage(m.chat , { text : mg.restartmg } , { quoted: mek } );
    process.exit(143)
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
    pattern: "system",
    react: "🧬",
    alias: ["status"],
    desc: "Check bot system status.",
    category: "general",
    use: '.system',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
try{
    if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
 }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }
    var start = new Date().getTime();
var end = new Date ().getTime();
const ping = (end - start)

if (os.hostname().length == 12) {
  hostname = mg.replithostname
} else {
  if (os.hostname().length == 36) {
    hostname = mg.herokuhostname
} else {
    if (os.hostname().length == 8) {
      hostname = mg.koyebhostname
} else {
      hostname = os.hostname()
}}}

const ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB`
const rtime = await runtime(process.uptime())

const txt = `───────────────────────────────
│   🌟 _SAVIYA-X-MD_ 🌟        
───────────────────────────────
│  *🖥️ Platform:* ${hostname}  
│  *⏳ Uptime:* ${rtime}      
│  *💾 RAM Usage:* ${ram}        
│  *🌐 Mode:* ${mg.mode}    
│  *👑 Owners:* SACHIBOT & SAVIYA-MD  
───────────────────────────────`
await conn.sendMessage(m.chat, { text:txt }, { quoted: mek })
} catch (e) {
reply('*Error !!*')
l(e)
}
})

cmd({
    pattern: "join",
    desc: "joins group by link",
    category: "owner",
    react:"🔗",
    use: '<group link.>',
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if (!isOwner) return;    
try{  
if (!q){ 
if(m.quoted && m.quoted.msg) {
q = m.quoted.msg
}else{
const mass = await conn.sendMessage(m.chat, { text: mg.wagrouplinknotfound }, { quoted: mek });
return await conn.sendMessage(m.chat, { react: { text: "⁉️", key: mass.key } });

}
}
    if (!q.split(" ")[0] && !q.split(" ")[0].includes("whatsapp.com"))
       reply(mg.invalidwagrouplink);
    let result = q.split(" ")[0].split("https://chat.whatsapp.com/")[1];
    await conn.groupAcceptInvite(result)
        .then((res) => reply(mg.groupjoinsuccess))
        .catch((err) => reply(mg.groupjoinerror));
} catch(e) {
console.log(e);
reply('Error!!')
} 
})       
cmd({
pattern: "ping",
react: "📡",
alias: ["speed"],
desc: "Check bot\'s ping",
category: "general",
use: '.ping',
filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {

try{
    if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
}else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }
var inital = new Date().getTime();

const { key } = await conn.sendMessage(m.chat, {text: mg.testingping});

var final = new Date().getTime();
await sleep(1000)

const pg = await conn.sendMessage(m.chat, {text: '*Ping:' + (final - inital) + ' ms*', edit: key});
return await conn.sendMessage(m.chat, { react: { text: '✔️', key: pg.key } });
} catch(e) {
console.log(e);
reply('Error!!')     
} 
})

cmd({
pattern: "del",
react: "❌",
desc: "delete message",
category: "group",
use: '.del',
filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if (!isOwner ||  !isAdmins) return;
try{
if (!m.quoted) return reply(mg.notextfordel);
const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        }
        await conn.sendMessage(m.chat, { delete: key })
} catch(e) {
console.log(e);
reply('Error!!')
} 
})
cmd({
    pattern: "left", 
    react: "🚷",        
    alias: ["leave"],
    desc: "(null).",
    category: "group",
    filename: __filename,
    use: '<.>',
},

async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if (!isOwner) return;
if (!m.isGroup) {
reply(mg.onlygroup)   
}
try {                
const gleave = m.chat
await conn.groupLeave(gleave)         
} catch(e) {
console.log(e);
reply('Error!!')
} 
}
)

cmd({
    pattern: "promote",
    react: "⚖️",
    desc: "Promotes the replied/quoted user to admin role",
    category: "group",
    filename: __filename,
    use: '<quote|reply|number>',
},
async (conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    if (!isOwner || !isAdmins) return reply(mg.onlyadmin);
    try {
        if (!m.isGroup) return reply(mg.onlygroup);
        if (!isBotAdmins) return reply(mg.needbotadmins);

        let users = m.mentionedJid && m.mentionedJid.length > 0 && m.mentionedJid[0] ? m.mentionedJid[0] : quoted ? quoted.sender : q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

        if (!users) return reply(mg.nouserforpromote);
        await conn.groupParticipantsUpdate(m.chat, [users], "promote");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
})

cmd({
    pattern: "addsudo",
    react: "🧑🏻‍🔧",
    desc: "Activate a bot for the user",
    category: "devoloper",
    filename: __filename,
    use: '.addsudo',
},
      async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
      try{
          if(!isGroup){ 
            if(config.DOWNLOADSAPI !== ''){
                if(!m?.quoted?.sender) return;
                const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
                if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
                const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}?groupjid=${m.quoted.sender}&type=true`); 
                reply(mg.sudoadded)
            }else{
            reply(mg.devoffsetting)}
        }
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
    pattern: "activate",
    react: "🛜",
    desc: "Activate a bot for the group",
    category: "owner",
    filename: __filename,
    use: '.activate',
},
      async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
      try{
          if(isGroup &&( isOwner || isSaviya)){ 
            if(config.DOWNLOADSAPI !== ''){
                const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
                if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
                const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}?groupjid=${from}&type=true`); 
                reply(mg.activatbotingroup)
            }else{
            reply(mg.devoffsetting)}
        }
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
    pattern: "resetdl",
    react: "🔄",
    desc: "reset available downloads",
    category: "owner",
    filename: __filename,
    use: '.resetdl',
},
      async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
      try{
          if( isOwner || isSaviya){ 
            if(config.DOWNLOADSAPI !== ''){
               
                const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
                if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
                const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/downloads/reset`); 
            await reply(mg.databasereset)
            process.exit(143)
            }else{
            reply(mg.devoffsetting)}
        } 
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
    pattern: "apply",
    react: "🔑",
    desc: "apply a date limit for user in group",
    category: "owner",
    filename: __filename,
    use: '.apply',
},
      async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
      try{
          if(isGroup &&( isOwner || isSaviya)){ 
            if(config.DOWNLOADSAPI !== ''){
               
                if(!m?.quoted?.sender)  return;
                const fsghh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
                if(fsghh &&  (fsghh?.error || fsghh?.data?.type == 'false')) return;
                const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
                if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
                const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/groups/?groupjid=${m.quoted.sender}&sender=${m.quoted.sender}&datelimit=${q}`); 
            await reply(mg.datelimit)
            await conn.sendMessage(m.chat, {
                text:"@"+m.quoted.sender.split("@")[0]+ " can use this bot until "+fsh.data[0].date,
                mentions: m.quoted.sender,
            }, {
                quoted: mek,
            });
            }else{
            await reply(mg.devoffsetting)}
        } else  if(!isGroup &&( isOwner || isSaviya)){ 
            if(config.DOWNLOADSAPI !== ''){
               
                if(!m?.quoted?.sender)  return;
                const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
                if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
                const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/groups/?groupjid=${m.quoted.sender}&sender=${m.quoted.sender}&datelimit=${q}`); 
            await reply(mg.datelimit)
            await conn.sendMessage(m.chat, {
                text:"@"+m.quoted.sender.split("@")[0]+ " can use this bot until "+fsh.data[0].date,
                mentions: m.quoted.sender,
            }, {
                quoted: mek,
            });
            }else{
            await reply(mg.devoffsetting)}
        }
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
    pattern: "delsudo",
    react: "🛑",
    desc: "Deactivate a bot for the user",
    category: "devoloper",
    filename: __filename,
    use: '.delsudo',
},
      async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
      try{
          if(!isGroup){ 
            if(config.DOWNLOADSAPI !== ''){
                if(!m?.quoted?.sender) return;
                const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
                if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
                const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}?groupjid=${m.quoted.sender}&type=false`); 
                reply(mg.sudoremoved)
            }else{
            reply(mg.devoffsetting)}
        }
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
    pattern: "deactivate",
    react: "🔀",
    desc: "Dectivate a bot for the group",
    category: "owner",
    filename: __filename,
    use: '.deactivate',
},
      async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
      try{
        if(isGroup &&( isOwner || isSaviya)){ 
          if(config.DOWNLOADSAPI !== ''){
              const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
              if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
                const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}?groupjid=${from}&type=false`); 
                reply(mg.deactivatbotingroup)
            }else{
            reply(mg.devoffsetting)}
        }
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
    pattern: "demote",
    react: "⛔",
    desc: "Demotes the replied/quoted user from admin role",
    category: "group",
    filename: __filename,
    use: '<quote|reply|number>',
},
async (conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    if (!isOwner || !isAdmins) return reply(mg.onlyadmin);
    try {
        if (!m.isGroup) return reply(mg.onlygroup);
        if (!isBotAdmins) return reply(mg.needbotadmins);

        let users = m.mentionedJid && m.mentionedJid.length > 0 && m.mentionedJid[0]? m.mentionedJid[0] : quoted ? quoted.sender : q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

        if (!users) return reply(mg.nouserfordemote);
        await conn.groupParticipantsUpdate(m.chat, [users], "demote");
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
})
cmd({
pattern: "kick",
react: "🚫",
desc: "Kicks replied/quoted user from group.",
category: "group",
filename: __filename,
use: '<quote|reply|number>',
},           
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if(!isOwner ||  !isAdmins)return;
try {
    if (!m.isGroup) return reply(mg.onlygroup);
    if (!isBotAdmins) return reply(mg.needbotadmins);


const user = m.quoted.sender;
if (!user) return reply(mg.nouserforkick);
await conn.groupParticipantsUpdate(m.chat, [user], "remove");
reply(mg.userremoved);
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
    pattern: "hidetag",
    react: "📢",
    alias: ["htag"],
    desc: "Tags everyperson of group without mentioning their numbers",
    category: "group",
    filename: __filename,
    use: '<text>',
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if(!isOwner  ||  !isAdmins)return;
try { 
if (!m.isGroup) return reply(mg.onlygroup);

if (!isBotAdmins) return reply(mg.needbotadmins);
    conn.sendMessage(m.chat, {
        text: q ? text : "",
        mentions: participants.map((a) => a.id),
    }, {
        quoted: mek 
    });
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({
    pattern: "add",
    react: "🔆",
    desc: "Add that person in group",
    fromMe: true,
    category: "group",
    filename: __filename,
    use: '<number>',
},
 async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if(!isOwner  ||  !isAdmins)return;
try {

if (!m.isGroup) return reply(mg.onlygroup);
if (!isBotAdmins) return reply(mg.needbotadmins);
    if (!q) return reply(mg.nouserforadd);

    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    await conn.groupParticipantsUpdate(m.chat, [users], "add");
} catch (e) {
reply('*Error !!*')
l(e)
}
})
cmd({

    pattern: "mute",	
    alias: ["lock"],
    react: "🔒",
    desc: "mute group.",
    category: "group",
    filename: __filename,
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
if (!isOwner || !isAdmins) return;


if (!m.isGroup) return reply(mg.onlygroup);
if (!isBotAdmins) return reply(mg.needbotadmins);     
            await conn.groupSettingUpdate(m.chat, "announcement")
           const mass = await conn.sendMessage(m.chat, { text: '*Group chat muted* 🔒' }, { quoted: mek });
            return await conn.sendMessage(m.chat, { react: { text: '🔒', key: mass.key } });
} catch(e) {
console.log(e);
reply('*Error !!*')    
} 
})

//........................................
cmd({

    pattern: "unmute",	
    alias: ["unlock"],
    react: "🔊",
    desc: "mute group.",
    category: "group",
    filename: __filename,
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    if (!isOwner || !isAdmins) return;  


    if (!m.isGroup) return reply(mg.onlygroup);
    if (!isBotAdmins) return reply(mg.needbotadmins);     
  
            await conn.groupSettingUpdate(m.chat, "not_announcement")
           const mass = await conn.sendMessage(m.chat, { text: '*Group chat unmuted* 🔊' }, { quoted: mek });
            return await conn.sendMessage(m.chat, { react: { text: '🔊', key: mass.key } });
} catch(e) {
console.log(e);
reply('*Error !!*')     
} 
})


cmd({
    pattern: "menu",
    react: "🏷️",
    alias: ["panel", "list", "commands"],
    desc: "Get bot's command list.",
    category: "general",
    use: '.menu',
    filename: __filename
}, async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply }) => {

    try {
        if (isGroup) {
            const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`);
            if (fsh && (fsh?.error || fsh?.data?.type == 'false')) return;
        } else if (!isGroup) {
            const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`);
            if (fshh && (fshh?.error || fshh?.data?.type == 'false')) return;
        }

        
        const ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(require('os').totalmem() / 1024 / 1024).toFixed(2)}MB`;
        const rtime = await runtime(process.uptime());

        let categories = {};
        for (let cmd of commands) {
            if (!cmd.dontAddCommandList && cmd.pattern) { 
                if (!(cmd.category in categories)) {
                    categories[cmd.category] = {};
                }
                if (!(cmd.pattern in categories[cmd.category])) {
                    categories[cmd.category][cmd.pattern] = [];
                }
                categories[cmd.category][cmd.pattern].push(...(cmd.alias || []));
            }
        }

        let menu = `╭─「 *ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ* 」\n`;
        menu += `│◈ *𝚁𝙰𝙼 𝚄𝚂𝙰𝙶𝙴* - ${ram}\n`;
        menu += `│◈ *𝚁𝚄𝙽𝚃𝙸𝙼𝙴* - ${rtime}\n`;
        menu += `╰──────────●●►\n`;
        
        for (let category in categories) {
            menu += `╭───────────●●►\n`;
            menu += `│🔌 ${category.toUpperCase()} COMMANDS\n`;
            menu += `│   ───────\n`;
            for (let pattern in categories[category]) {
                menu += `│► ${config.PREFIX}${pattern}\n`;
                for (let alias of categories[category][pattern]) {
                    menu += `│► ${config.PREFIX}${alias}\n`;
                }
            }
            menu += `╰───────────●●►\n`;
        }

        menu += `
${mg.footer}\n`;

        await conn.sendMessage(from, { image: { url: mg.menulogo }, caption: menu }, { quoted: mek });
    } catch (e) {
        reply('*Error !!*');
        l(e);
    }
});




cmd({
    pattern: "send",
    alias: ["forward"],
    desc: "send msgs",
    category: "owner",
    use: '.send < Jid address >',
    filename: __filename
},

async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
try{ 
if (!isOwner) {
  return await reply(mg.onlyowner)
}  else {
  if(config.DOWNLOADSAPI !== ''){
    if(isGroup){
      const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
      if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
       
}else if(!isGroup){
      const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
      if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
    }
}else{
  return await reply(mg.devoffsetting)}
}  
if (!q || !m.quoted) {
return await reply(`❌ *Please give me a jid and quote a message you want*\n\n*Use the ${envData.PREFIX}jid command to get the Jid*`)
}  



	

if(m.quoted && m.quoted.type === "stickerMessage"){
let image = await m.quoted.download()
            let sticker = new Sticker(image, {
                pack: "⦁ SAVIYA-MD ⦁",
                author: "⦁ SAVIYA-X-MD ⦁",
                type: StickerTypes.FULL, //q.includes("--default" || '-d') ? StickerTypes.DEFAULT : q.includes("--crop" || '-cr') ? StickerTypes.CROPPED : q.includes("--circle" || '-ci') ? StickerTypes.CIRCLE : q.includes("--round" || '-r') ? StickerTypes.ROUNDED : StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: "12345",
                quality: 75,
                background: "transparent",
            });
            const buffer = await sticker.toBuffer();

const jid = q || from
  
  conn.sendMessage(jid, { sticker: buffer });
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")  

}else if(m.quoted && m.quoted.type === "imageMessage"){
if(m.quoted.imageMessage && m.quoted.imageMessage.caption){
const cap = m.quoted.imageMessage.caption
let image = await m.quoted.download()
const jid = q || from

   conn.sendMessage(jid, { image: image, caption: cap });
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
	
}else{
let image = await m.quoted.download()
const jid = q || from
  conn.sendMessage(jid, { image: image });
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")  
}	
	
}else if(m.quoted && m.quoted.type === "videoMessage"){
let fileLengthInBytes = m.quoted.videoMessage.fileLength
const fileLengthInMB = fileLengthInBytes / (1024 * 1024);
if(fileLengthInMB >= 50 ){
reply("*❌ Video files larger than 50 MB cannot be send.*")
}else{
let video = await m.quoted.download()
const jid = q || from

if(m.quoted.videoMessage.caption){
 
 conn.sendMessage(jid, { video: video, mimetype: 'video/mp4',caption: m.quoted.videoMessage.caption});
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
 
 }else{

  const jid = q || from
 conn.sendMessage(jid, { video: video, mimetype: 'video/mp4'});
  let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
}

}	

}else if(m.quoted && m.quoted.type === "documentMessage" || m.quoted.type === "documentWithCaptionMessage"){	

const jid = q || from
if(m && m.quoted && m.quoted.documentMessage){
let fileLengthInBytes = m.quoted.documentMessage.fileLength	
const fileLengthInMB = fileLengthInBytes / (1024 * 1024);

if(fileLengthInMB >= 50 ){
reply("*❌ Document files larger than 50 MB cannot be send.*")
}else{
	
let mmt = m.quoted.documentMessage.mimetype 	
let fname = m.quoted.documentMessage.fileName
let audio = await m.quoted.download() 
 conn.sendMessage(jid, { document: audio, mimetype: mmt, fileName: fname });
 let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️") 
}
 }else if(m.quoted.type === "documentWithCaptionMessage"){
let fileLengthInBytes = m.quoted.documentWithCaptionMessage.message.documentMessage.fileLength
const fileLengthInMB = fileLengthInBytes / (1024 * 1024);
if(fileLengthInMB >= 50 ){
reply("*❌ Document files larger than 50 MB cannot be send.*")
}else{
let audio = await m.quoted.download()
let Dmmt =m.quoted.documentWithCaptionMessage.message.documentMessage.mimetype

let Dfname = m.quoted.documentWithCaptionMessage.message.documentMessage.fileName

  const jid = q || from
let cp = m.quoted.documentWithCaptionMessage.message.documentMessage.caption

 conn.sendMessage(jid, { document: audio, mimetype: Dmmt,caption: cp, fileName: Dfname });
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")

}

}
			
}else if(m.quoted && m.quoted.type === "audioMessage"){	
let fileLengthInBytes = m.quoted.audioMessage.fileLength
const fileLengthInMB = fileLengthInBytes / (1024 * 1024);
if(fileLengthInMB >= 50 ){
reply("*❌ Audio files larger than 50 MB cannot be send.*")
}else{
let audio = await m.quoted.download()
const jid = q || from
if(m.quoted.audioMessage.ptt === true){
 
 conn.sendMessage(jid, { audio: audio, mimetype: 'audio/mpeg', ptt: true, fileName: `${m.id}.mp3` });
 let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️") 
 
 }else{
  const jid = q || from
 conn.sendMessage(jid, { audio: audio, mimetype: 'audio/mpeg', fileName: `${m.id}.mp3` });
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
}

}	
}else if(m.quoted && m.quoted.type === "viewOnceMessageV2Extension"){		
let met = m
const jet = {
    key: {
        remoteJid: mek.key.remoteJid,
        fromMe: false,
        id: met.key.id,
    },
    messageTimestamp: met.messageTimestamp,
    pushName: met.pushName,
    broadcast: met.broadcast,
    status: 2,
    message: {
        audioMessage: {
            url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.url,
            mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mimetype,
            fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fileSha256,
            fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fleLength,
            seconds: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.seconds,
	    ptt: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.ptt,
            mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mediaKey,
            fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fileEncSha256,
            directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.directPath, 
            mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mediaKeyTimestamp, 
	    waveform: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.waveform,
        },
    },
    id: met.id,
    chat: met.chat,
    fromMe: met.fromMe,
    isGroup: met.isGroup,
    sender: met.sender,
    type: 'audioMessage',
    msg: {
        url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.url,
            mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mimetype,
            fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fileSha256,
            fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fleLength,
            seconds: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.seconds,
	    ptt: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.ptt,
            mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mediaKey,
            fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.fileEncSha256,
            directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.directPath, 
            mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.mediaKeyTimestamp, 
	    waveform: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2Extension.message.audioMessage.waveform,
    },
    
};

const mlvv = sms(conn, jet);
var nameJpg = getRandom('');
let buff = await mlvv.download(nameJpg);
let fileType = require('file-type');
let type = fileType.fromBuffer(buff);
await fs.promises.writeFile("./" + type.ext, buff);
await sleep(1000)
let caps = jet.message.audioMessage.caption || "⦁ ᴘʀᴀʙᴀᴛʜ-ᴍᴅ ⦁"


const jid = q || from
  conn.sendMessage(jid, { audio:  { url: "./" + type.ext }, mimetype: 'audio/mpeg', ptt: true, viewOnce:true, fileName: `${m.id}.mp3` });
  
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")

}else if(m.quoted && m.quoted.viewOnceMessageV2 && m.quoted.viewOnceMessageV2.message.videoMessage){
let met = m

const jet = {
            key: {
              remoteJid: mek.key.remoteJid,
              fromMe: false,
              id: met.key.id,
            },
            messageTimestamp: met.messageTimestamp,
            pushName: met.pushName,
            broadcast: met.broadcast,
            status: 2,
            message: {
              videoMessage: {
                url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.url,
                mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mimetype,
                caption: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.caption,
                fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fileSha256,
                fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fleLength,
                seconds: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.seconds,
                mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mediaKey,
                height: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.height,
                width: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.width,
                fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fileEncSha256,
                directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.directPath,
                mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mediaKeyTimestamp,
                jpegThumbnail: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.jpegThumbnail,
              },
            },
            id: met.id,
            chat: met.chat,
            fromMe: met.fromMe,
            isGroup: met.isGroup,
            sender: met.sender,
            type: 'videoMessage',
            msg: {
              url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.url,
                mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mimetype,
                caption: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.caption,
                fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fileSha256,
                fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fleLength,
                seconds: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.seconds,
                mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mediaKey,
                height: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.height,
                width: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.width,
                fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.fileEncSha256,
                directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.directPath,
                mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.mediaKeyTimestamp,
                jpegThumbnail: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.jpegThumbnail,
            },
            body: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.videoMessage.caption,
          };

        const mlvv = sms(conn, jet);
        var nameJpg = getRandom('');
        let buff = await mlvv.download(nameJpg);
        let fileType = require('file-type');
        let type = fileType.fromBuffer(buff);
        await fs.promises.writeFile("./" + type.ext, buff);
	await sleep(1000)
	let caps = jet.message.videoMessage.caption || "⦁ ᴘʀᴀʙᴀᴛʜ-ᴍᴅ ⦁"
         
	const jid = q || from
  conn.sendMessage(jid, { video: { url: "./" + type.ext }, caption: caps, viewOnce:true });	
  let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
}else if(m.quoted && m.quoted.viewOnceMessageV2 && m.quoted.viewOnceMessageV2.message.imageMessage){
let met = m
const jet = {
    key: {
        remoteJid: mek.key.remoteJid,
        fromMe: false,
        id: met.key.id,
    },
    messageTimestamp: met.messageTimestamp,
    pushName: met.pushName,
    broadcast: met.broadcast,
    status: 2,
    message: {
        imageMessage: {
            url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.url,
            mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mimetype,
            caption: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.caption,
            fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fileSha256,
            fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fleLength,
            height: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.height,
            width: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.width,
            mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mediaKey,
            fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fileEncSha256,
            directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.directPath,
            mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mediaKeyTimestamp,
            jpegThumbnail: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.jpegThumbnail,
        },
    },
    id: met.id,
    chat: met.chat,
    fromMe: met.fromMe,
    isGroup: met.isGroup,
    sender: met.sender,
    type: 'imageMessage',
    msg: {
        url: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.url,
        mimetype: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mimetype,
        caption: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.caption,
        fileSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fileSha256,
        fileLength: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fleLength,
        height: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.height,
        width: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.width,
        mediaKey: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mediaKey,
        fileEncSha256: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.fileEncSha256,
        directPath: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.directPath,
        mediaKeyTimestamp: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.mediaKeyTimestamp,
        jpegThumbnail: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.jpegThumbnail,
    },
    body: mek.message.extendedTextMessage.contextInfo.quotedMessage.viewOnceMessageV2.message.imageMessage.caption,
};

const mlvv = sms(conn, jet);
var nameJpg = getRandom('');
let buff = await mlvv.download(nameJpg);
let fileType = require('file-type');
let type = fileType.fromBuffer(buff);
await fs.promises.writeFile("./" + type.ext, buff);
await sleep(1000)
let caps = jet.message.imageMessage.caption || "⦁ ᴘʀᴀʙᴀᴛʜ-ᴍᴅ ⦁"
 const jid = q || from

  conn.sendMessage(jid, { image: { url: "./" + type.ext }, caption: caps,viewOnce:true });
 let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️") 
}else if(q || m.quoted && m.quoted.type === "conversation"){

const jid = q || from
conn.sendMessage(jid,{text: m.quoted.msg})
let ss = '`'
reply(`*This ${ss}${m.quoted.type}${ss} has been successfully sent to the jid address ${ss}${q}${ss}.*  ✅`)
m.react("✔️")
}else{
const mass= await conn.sendMessage(from, { text: `❌ *Please Give me message!*\n\n${envData.PREFIX}send <Jid>`}, { quoted: mek });
return await conn.sendMessage(from, { react: { text: '❓', key: mass.key } });
    
}

 } catch(e) {
console.log(e);
return reply('error!!')
 }
});
