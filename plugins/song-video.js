const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const fg = require('api-dylux')
const yts = require('yt-search')
const cine = require('../lib/cine');


const  bot = config.BOTNUMBER;


cmd({
    pattern: "song3",
    react: "🎼",
    alias: ["dlsong3"],
    desc: "download songs",
    category: "download",
    use: '.song',
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react}) => {
    try {
        if (isGroup) {
            const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
            if (fsh && (fsh?.error || fsh?.data?.type == 'false')) return;
        } else if (!isGroup) {
            const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
            if (fshh && (fshh?.error || fshh?.data?.type == 'false')) return;
        }

        if (!q) return reply("Please give me a URL or song name");
        
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;
  
        let desc = `
🎡 *SAVIYA-X-MD-SONG-DOWNLOADER* 🎡

┌───────────────────
├ *✨title:* ${data.title}
├ *⏱️time:* ${data.timestamp}
├ *⚖️ago:* ${data.ago}
├ *📍views:* ${data.views}
├ *🖇️url:* ${data.url}
└───────────────────
${mg.footer}`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Downloads
        let down = await fg.yta(url);
        let downloadUrl = down.dl_url;

        // Send audio
        await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "audio/mpeg",fileName:data.title + ".mp3",caption:"ᴘᴏᴡᴇʀᴅ ʙʏ ꜱᴀᴠɪʏᴀ-x-ᴍᴅ"}, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});



cmd({
    pattern: "video2",
    react: "🎼",
    alias: ["dlvideo2"],
    desc: "download videos",
    category: "download",
    use: '.video',
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react}) => {
    try {
        if (isGroup) {
            const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
            if (fsh && (fsh?.error || fsh?.data?.type == 'false')) return;
        } else if (!isGroup) {
            const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
            if (fshh && (fshh?.error || fshh?.data?.type == 'false')) return;
        }

        if (!q) return reply("Please give me a URL or video name");
        
        const search = await yts(q);
        const data = search.videos[0];
        const url = data.url;
  
        let desc = `
🔅 *SAVIYA-X-MD-VIDEO-DOWNLOADER* 🔅

┌───────────────────
├ *✨title:* ${data.title}
├ *⏱️time:* ${data.timestamp}
├ *⚖️ago:* ${data.ago}
├ *📍views:* ${data.views}
├ *🖇️url:* ${data.url}
└───────────────────
${mg.footer}`;

        await conn.sendMessage(from, { image: { url: data.thumbnail }, caption: desc }, { quoted: mek });

        // Downloads
        let down = await fg.ytv(url);
        let downloadUrl = down.dl_url;

        // Send video
        await conn.sendMessage(from, { video: { url: downloadUrl }, mimetype: "video/mp4" }, { quoted: mek });
        await conn.sendMessage(from, { document: { url: downloadUrl }, mimetype: "video/mp4",fileName:data.title + ".mp4",caption:"ᴘᴏᴡᴇʀᴅ ʙʏ ꜱᴀᴠɪʏᴀ-x-ᴍᴅ"}, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


