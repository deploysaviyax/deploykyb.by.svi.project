const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const axios = require('axios');
const cine = require('../lib/cine');

const  bot = config.BOTNUMBER;



cmd({
    pattern: "xvs",
    react: "🎥",
    alias: ["xvideosearch"],
    desc: "Search for Xvideos by query",
    category: "search",
    use: '.xvs <search query>',
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
        
        if (!q) return reply("Please provide a search query.");

        
        const key = await conn.sendMessage(from, { text: '*🔍 Searching for Xvideos...*' }, { quoted: mek });

        
        const query = encodeURIComponent(q); // Use encodeURIComponent for safe URL encoding
        const apiUrl = `https://dark-yasiya-api-new.vercel.app/search/xvideo?text=${query}`;

       
        const response = await fetch(apiUrl);

        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textResponse = await response.text();
            console.error("Non-JSON response:", textResponse);
            return reply("The server returned an unexpected response. Please try again later.");
        }

        
        const data = await response.json();

        
        console.log("API Response:", data);

        
        if (!data || !data.result || data.result.length === 0) return reply("No Xvideos found for your search query.");

        
        let videoInfo = "*Saviya-Md Xvideos Search Results:*\n\n";
        data.result.forEach(video => {
            videoInfo += `┌──────────────────────\n`;
            videoInfo += `├✨ *Title:* ${video.title || 'N/A'}\n`;
            videoInfo += `├⏳ *Duration:* ${video.duration || 'N/A'}\n`;
            videoInfo += `├🔗 *Video URL:* ${video.url || 'N/A'}\n`;
            videoInfo += `└──────────────────────\n\n`;
        });

       
        await conn.sendMessage(from, { text: videoInfo }, { quoted: mek });

        
        await sleep(1000); 
        await conn.sendMessage(from, { text: "*✅ Search completed successfully ✅*", edit: key });

    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "xvdl",
    react: "🎥",
    alias: ["xvid"],
    desc: "Download Xvideos videos using the video name or URL",
    category: "download",
    use: '.xvdl <Xvideos Name or URL>',
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


        if (!q) return reply("Please provide a video name or a valid Xvideos URL.");

        const isUrl = q.startsWith("http://") || q.startsWith("https://");
        let xv_info;

        if (isUrl) {
            
            const url = encodeURI(q);
            xv_info = await fetchJson(`https://dark-yasiya-api-new.vercel.app/download/xvideo?url=${url}`);
        } else {
           
            const xv_list = await fetchJson(`https://dark-yasiya-api-new.vercel.app/search/xvideo?q=${encodeURI(q)}`);
            if (!xv_list.result || xv_list.result.length < 1) {
                return reply("No results found!");
            }

            
            xv_info = await fetchJson(`https://dark-yasiya-api-new.vercel.app/download/xvideo?url=${xv_list.result[0].url}`);
        }

        
        if (!xv_info || !xv_info.result) {
            return reply("Failed to retrieve video information. Please try again.");
        }

        
        const msg = `
🔞 _SAVIYA XVIDEO DOWNLOADER_ 🔞
┌──────────────────────
├ *✨ Title:* ${xv_info.result.title}
├ *👁️ Views:* ${xv_info.result.views}
├ *👍 Likes:* ${xv_info.result.like}
├ *👎 Dislikes:* ${xv_info.result.dislike} 
├ *📏 Size:* ${xv_info.result.size}
└──────────────────────
${mg.botname}
`;

        
        const { key } = await conn.sendMessage(from, { text: "*📥 Downloading your video...*" }, { quoted: mek });

        
        await conn.sendMessage(from, { image: { url: xv_info.result.image || '' }, caption: msg }, { quoted: mek });

        
        await conn.sendMessage(from, { text: "*📤 Uploading your video...*", edit: key });

        
        await conn.sendMessage(from, { document: { url: xv_info.result.dl_link }, mimetype: "video/mp4", fileName: xv_info.result.title, caption: `${mg.botname}` }, { quoted: mek });

      
        await conn.sendMessage(from, { text: "*✅ Video uploaded successfully! ✅*", edit: key });

    } catch (error) {
        console.error("Error:", error);
        reply("An error occurred while processing your request. Please try again later.");
    }
});


cmd({
    pattern: "gemini",
    alias: ["gem"],
    desc: "Ask Google Gemini AI any question.",
    category: "AI",
    react: "👾",
    use: '.gemini <your question>',
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
            return reply("Please provide a question for Google Gemini AI. Example: .gemini What is the weather?");
        }

        
        await conn.sendPresenceUpdate('composing', from);

        
        const thinkingTime = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        
        const apiUrl = `https://dark-yasiya-api-new.vercel.app/ai/gemini?q=${encodeURIComponent(q)}`;

        
        const response = await axios.get(apiUrl);

        
        if (!response.data.status) {
            return reply("Failed to fetch a response from Google Gemini AI. Please try again later.");
        }

        
        const geminiResponse = response.data.result;

        
        await conn.sendMessage(from, { text: geminiResponse });

    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
       
        await conn.sendPresenceUpdate('paused', from);
    }
});


cmd({
    pattern: "pinterest",
    react: "📌",
    alias: ["piniimg", "pinsearch"],
    desc: "Search for Pinterest images by keyword",
    category: "search",
    use: '.pinterest <keyword>',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {
       
if (isGroup) {
            const groupCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`);
            if (groupCheck && (groupCheck?.error || groupCheck?.data?.type == 'false')) return;
        } else {
            const userCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`);
            if (userCheck && (userCheck?.error || userCheck?.data?.type == 'false')) return;
        }

        if (!q) return reply("*Please provide a keyword to search for Pinterest images.*");

        
        const { key } = await conn.sendMessage(from, { text: '*🔍 Searching for Pinterest images...*' }, { quoted: mek });

      
        const query = encodeURI(q);
        const apiUrl = `https://dark-yasiya-api-new.vercel.app/download/piniimg?text=${query}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        
        if (!data.result || data.result.length === 0) {
            return reply("*No Pinterest images found for your search query.*");
        }

        
        const pinterestImage = data.result[0];
        const imageUrl = pinterestImage.images_url;
        const pinLink = pinterestImage.pin || "No link available";
        const createdAt = pinterestImage.created_at || "Unknown";
        const caption = `*Pin:* ${pinLink}\n*Created at:* ${createdAt}\n\n${mg.botname}`;

       
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: caption
        }, { quoted: mek });

       
        await conn.sendMessage(from, { text: "*✅ Pinterest image search completed successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "wallpaper",
    react: "🖼️",
    alias: ["wallsearch"],
    desc: "Search for wallpapers by keyword",
    category: "search",
    use: '.wallpaper <keyword>',
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {

if (isGroup) {
            const groupCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`);
            if (groupCheck && (groupCheck?.error || groupCheck?.data?.type == 'false')) return;
        } else {
            const userCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`);
            if (userCheck && (userCheck?.error || userCheck?.data?.type == 'false')) return;
        }
        
        
        if (!q) return reply("*Please provide a keyword to search for wallpapers.*");

        
        const { key } = await conn.sendMessage(from, { text: '*🔍 Searching for wallpapers...*' }, { quoted: mek });

        
        const query = encodeURI(q);
        const apiUrl = `https://dark-yasiya-api-new.vercel.app/download/wallpaper?text=${query}&page=1`;

        
        const response = await fetch(apiUrl);
        const data = await response.json();

        
        if (!data.result || data.result.length === 0) return reply("*No wallpapers found for your search query.*");

        
        const wallpaper = data.result[0];
        const caption = `*Type:* ${wallpaper.type}\n*Source:* ${wallpaper.source}\n\n${mg.botname}`;
        const imageUrl = wallpaper.image[0];  


        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: caption
        }, { quoted: mek });

        
        await sleep(1000);
        await conn.sendMessage(from, { text: "*✅ Wallpaper search completed successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "mfire2",
    alias: ["mediafire2"],
    desc: "Download files from MediaFire using the DarkYasiya API",
    react: "📁",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {

if (isGroup) {
            const groupCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`);
            if (groupCheck && (groupCheck?.error || groupCheck?.data?.type == 'false')) return;
        } else {
            const userCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`);
            if (userCheck && (userCheck?.error || userCheck?.data?.type == 'false')) return;
        }
       
        if (!q || !q.startsWith("https://")) {
            return await reply("Please provide a valid MediaFire URL.");
        }

       
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your file...*' });

        
        const response = await fetchJson(`https://dark-yasiya-api-new.vercel.app/download/mfire?url=${encodeURIComponent(q)}`);
        
        
        if (!response.status || !response.result?.dl_link) {
            return await reply("Failed to fetch file data. Please check the URL or try again later.");
        }

        
        const { dl_link: downloadLink, fileName, fileType, size } = response.result;

        
        await conn.sendMessage(from, { text: `*📤 Uploading your file...*`, edit: key });

       
        const fileBuffer = await axios.get(downloadLink, { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data, 'binary'));

       
        await conn.sendMessage(from, {
            document: fileBuffer,
            mimetype: fileType,
            fileName: fileName,
            caption: `*File:* ${fileName}\n*Size:* ${size}\n\n${mg.botname}`
        }, { quoted: mek });

       
        await conn.sendMessage(from, { text: "*✅ Media uploaded successfully ✅*", edit: key });

    } catch (e) {
        console.error(e);
        await reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "ada",
    alias: ["adanews"],
    desc: "Get the latest Ada news.",
    category: "News",
    react: "📰",
    use: '.ada',
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
         
        await conn.sendPresenceUpdate('composing', from);
        await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000) + 1000));

        
        const apiUrl = "https://dark-yasiya-api-new.vercel.app/news/ada";
        const response = await axios.get(apiUrl);

        
        if (!response.data.status) {
            return reply("Failed to fetch the latest Ada news. Please try again later.");
        }

        
        const { title, image, date, time, url, desc } = response.data.result;

        
        const newsMessage = `📰 *${title}*\n\n${desc}\n\n*📅 Date:* ${date}\n*🕒 Time:* ${time}\n\n🔗 [Read More](${url})`;

        
        await conn.sendMessage(from, { image: { url: image }, caption: newsMessage });
        
    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        
        await conn.sendPresenceUpdate('paused', from);
    }
});


cmd({
    pattern: "apk",
    alias: ["apkdownload"],
    desc: "Download APKs",
    category: "download",
    react: "📦",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {

if (isGroup) {
            const groupCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`);
            if (groupCheck && (groupCheck?.error || groupCheck?.data?.type == 'false')) return;
        } else {
            const userCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`);
            if (userCheck && (userCheck?.error || userCheck?.data?.type == 'false')) return;
        }

        if (!q) return reply("Please provide the name of the APK to download.");

      
        const { key } = await conn.sendMessage(from, { text: '🔍 Searching for the APK...' });

        
        const response = await fetchJson(`https://www.dark-yasiya-api.site/download/apk?id=${encodeURIComponent(q)}`);
        if (!response || !response.status || !response.result) {
            return reply("Failed to fetch APK data. Please check the name or try again later.");
        }

        
        const { name, package: app_id, lastUpdate, size, image, dl_link } = response.result;

        
        const apkInfo = `
┌────────────────────────────
├ 📚 *Name* : ${name}
├ 📦 *Package ID* : ${app_id}
├ ⬆️ *Last update* : ${lastUpdate}
├ 📥 *Size* : ${size} 
└────────────────────────────`;

        
        await conn.sendMessage(from, {
            image: { url: image },
            caption: apkInfo
        }, { quoted: mek });

       
        await conn.sendMessage(from, {
            document: { url: dl_link },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${name}.apk`,
            caption: `${mg.botname}`
        }, { quoted: mek });

        
        await conn.sendMessage(from, { text: "*✅ Apk uploaded successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "fb",
    alias: ["facebook"],
    desc: "Download FB videos",
    category: "download",
    react: "🔖",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {
     
if (isGroup) {
            const groupCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`);
            if (groupCheck && (groupCheck?.error || groupCheck?.data?.type == 'false')) return;
        } else {
            const userCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`);
            if (userCheck && (userCheck?.error || userCheck?.data?.type == 'false')) return;
        }

        if (!q || !q.startsWith("https://")) {
            return reply("Please provide a valid Facebook video URL.");
        }

        
        const initialTime = new Date().getTime();
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your video...*' });

        
        const response = await fetchJson(`https://www.dark-yasiya-api.site/download/fbdl1?url=${encodeURIComponent(q)}`);

        if (!response.result) {
            return reply("Failed to fetch video data. Please check the URL or try again later.");
        }

        const videoData = response.result;

        
        const uploadMsg = await conn.sendMessage(from, { text: `*📤 Uploading your video...*`, edit: key });

        
        if (videoData.hd) {
            await conn.sendMessage(from, { video: { url: videoData.hd }, mimetype: "video/mp4", caption: `* HD QUALITY VIDEO\n\n ${mg.botname}` }, { quoted: mek });
        } else {
            reply("HD video is not available.");
        }

      
        if (videoData.sd) {
            await conn.sendMessage(from, { video: { url: videoData.sd }, mimetype: "video/mp4", caption: `* SD QUALITY VIDEO\n\n ${mg.botname}` }, { quoted: mek });
        } else {
            reply("SD video is not available.");
        }

       
        const finalTime = new Date().getTime();
        await sleep(1000);
        await conn.sendMessage(from, { text: "*✅ Media uploaded successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "xnxx",
    react: "🎥",
    alias: ["xn"],
    desc: "Download XNXX videos using the video name or URL with quality options",
    category: "download",
    use: '.xnxx <XNXX Name or URL> <quality (e.g., 360p, 480p, 720p)>',
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

        if (!q) return reply("Please provide a video name or a valid XNXX URL.");

        const isUrl = q.startsWith("http://") || q.startsWith("https://");
        const quality = args[args.length - 1].match(/\d+p$/) ? args.pop() : "360p";  
        const searchQuery = args.join(" ");
        
        let xnxx_info;

        if (isUrl) {
            
            const url = encodeURI(q);
            xnxx_info = await fetchJson(`https://nsfw-pink-venom.vercel.app/api/xnxx/download?url=${url}`);
        } else {
            
            const search_results = await fetchJson(`https://nsfw-pink-venom.vercel.app/api/xnxx/search?query=${encodeURI(searchQuery)}`);
            if (!search_results.result || search_results.result.length < 1) return reply("No results found!");

            
            const videoUrl = search_results.result[0].link;
            xnxx_info = await fetchJson(`https://nsfw-pink-venom.vercel.app/api/xnxx/download?url=${videoUrl}`);
        }

        if (!xnxx_info || !xnxx_info.result) return reply("Failed to retrieve video information. Please try again.");

        const videoData = xnxx_info.result;
        const availableQualities = {
            "360p": videoData.files.low,
            "480p": videoData.files.high,
            "720p": videoData.files.HLS  
        };
        
        const videoUrl = availableQualities[quality] || availableQualities["360p"];

        const msg = `
🔞 _SAVIYA XNXX DOWNLOADER_ 🔞
┌──────────────────────
├ *✨ Title:* ${videoData.title}
├ *⏲️ Duration:* ${videoData.duration} seconds
├ *👁️ Info:* ${videoData.info}
├ *📏 Quality:* ${quality.toUpperCase()} 
└──────────────────────
${mg.botname}
`;

        
        const { key } = await conn.sendMessage(from, { text: "*📥 Downloading your video...*" }, { quoted: mek });

        
        await conn.sendMessage(from, { image: { url: videoData.image }, caption: msg }, { quoted: mek });

        
        await conn.sendMessage(from, { text: "*📤 Uploading your video...*", edit: key });

        
        await conn.sendMessage(from, { document: { url: videoUrl }, mimetype: "video/mp4", fileName: `${videoData.title} (${quality}).mp4`, caption: `${mg.botname}` }, { quoted: mek });

       
        await conn.sendMessage(from, { text: "*✅ Video uploaded successfully! ✅*", edit: key });

    } catch (error) {
        console.error("Error:", error);
        reply("An error occurred while processing your request. Please try again later.");
    }
});


cmd({
    pattern: "xnxxs",
    react: "🔍",
    alias: ["xnxxsearch"],
    desc: "Search for XNXX videos by query",
    category: "search",
    use: '.xnxxs <search query>',
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

        if (!q) return reply("Please provide a search query.");

        
        const { key } = await conn.sendMessage(from, { text: '*🔍 Searching for XNXX videos...*' }, { quoted: mek });

        
        const query = encodeURIComponent(q);
        const apiUrl = `https://nsfw-pink-venom.vercel.app/api/xnxx/search?query=${query}`;
        const response = await fetch(apiUrl);

        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textResponse = await response.text();
            console.error("Non-JSON response:", textResponse);
            return reply("The server returned an unexpected response. Please try again later.");
        }

        
        const data = await response.json();

       
        if (!data?.result || data.result.length === 0) return reply("No XNXX videos found for your search query.");

        
        let videoInfo = "*Saviya-Md XNXX Search Results:*\n\n";
        data.result.forEach(video => {
            videoInfo += `┌──────────────────────\n`;
            videoInfo += `├✨ *Title:* ${video.title || 'N/A'}\n`;
            videoInfo += `├📊 *Info:* ${video.info || 'N/A'}\n`;
            videoInfo += `├🔗 *Link:* ${video.link || 'N/A'}\n`;
            videoInfo += `└──────────────────────\n\n`;
        });

        
        await conn.sendMessage(from, { text: videoInfo }, { quoted: mek });

        
        await conn.sendMessage(from, { text: "*✅ Search completed successfully ✅*", edit: key });

    } catch (e) {
        console.error("Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "gpt",
    alias: ["ai"],
    desc: "Ask GPT any question.",
    category: "AI",
    react: "🤖",
    use: '.gpt <your question>',
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

       
        if (!q) return reply("Please provide a question for GPT. Example: .gpt What is your name?");

       
        await conn.sendPresenceUpdate('composing', from);
        const thinkingTime = Math.floor(Math.random() * 1000) + 1000; // 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

       
        const apiUrl = `https://www.dark-yasiya-api.site/ai/chatgpt?q=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

       
        if (!response.data.status) {
            return reply("Failed to fetch a response from GPT. Please try again later.");
        }

       
        const gptResponse = response.data.result;
        await conn.sendMessage(from, { text: gptResponse }, { quoted });

    } catch (e) {
        console.error("GPT Command Error:", e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        await conn.sendPresenceUpdate('paused', from); 
    }
});
