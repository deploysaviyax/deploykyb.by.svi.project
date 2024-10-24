const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const axios = require('axios');
const cine = require('../lib/cine');

const userAgentList = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    
];

let apikey = config.API_KEY;
const  bot = config.BOTNUMBER;


cmd({
    pattern: "request",
    alias: ["site-request"],
    desc: "Send a specified number of requests to a site to simulate visitor traffic.",
    category: "fun",
    react: "🎰",
    use: '.request <site> <number>',
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    const site = args[0];
    const numRequests = parseInt(args[1]);

    if (!site || isNaN(numRequests) || numRequests <= 0) {
        return reply('Please provide a valid site and number of requests (e.g., `.request example.com 100`).');
    }

    
    const siteUrl = site.startsWith('http://') || site.startsWith('https://') ? site : `https://${site}`;

   
    function getRandomUserAgent() {
        return userAgentList[Math.floor(Math.random() * userAgentList.length)];
    }

   
    async function sendRequest() {
        try {
            await axios.get(siteUrl, {
                headers: {
                    'User-Agent': getRandomUserAgent()
                }
            });
        } catch (error) {
            console.error(`Error sending request: ${error.message}`);
        }
    }

   
    async function sendRequests() {
        try {
            for (let i = 0; i < numRequests; i++) {
                await sendRequest();
                await new Promise(resolve => setTimeout(resolve, Math.random() * 2000)); 
            }
            reply(`*✅Sent ${numRequests} requests successfully.✅*`);
        } catch (error) {
            reply(`Error sending requests: ${error.message}`);
        }
    }

    await sendRequests();
});



cmd({
    pattern: "gdrive",
    alias: ["drive"],
    desc: "Download files from Google Drive.",
    category: "download",
    react: "📥",
    use: '.gdrive <Google Drive file URL>',
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

        const fileUrl = args.join(' ').trim();

        if (!fileUrl) {
            return reply('*Please provide a Google Drive file URL.*');
        }

        // Construct the API request URL
        const apiUrl = `https://api.prabath-md.tech/api/gdrivedl?url=${encodeURIComponent(fileUrl)}&apikey=${apikey}`;


        // Fetch the file data from the API
        const response = await axios.get(apiUrl);

        // Debug: Log the response data
        console.log('API Response:', response.data);

        // Check if the API response is successful and contains a download link
        if (response.data.status === 'success ✅' && response.data.data && response.data.data.download) {
            const { fileName, fileSize, mimeType, download } = response.data.data;

            // Debug: Log the download URL
            console.log('Download URL:', download);

            // Prepare file information message
            const fileInfo = `
───────────────────────
|📃 *File name:* ${fileName}
|💈 *File Size:* ${fileSize}
|🕹️ *File type:* ${mimeType}
───────────────────────
`;

            // Send file information
            await conn.sendMessage(from, { text: fileInfo }, { quoted: mek });

            // Download the file
            const fileResponse = await axios({
                url: download,
                method: 'GET',
                responseType: 'arraybuffer'
            });

            const fileBuffer = Buffer.from(fileResponse.data, 'binary');

            // Send the file
            await conn.sendMessage(from, { document: fileBuffer, mimetype: mimeType, fileName: fileName }, { quoted: mek });

            reply('*File uploaded successfully!✅*');
        } else {
            reply('*Failed to fetch the download link. Please check the provided URL.*');
        }
    } catch (err) {
        console.log(err);
        reply(`*Error: ${err.message}*`);
    }
});



cmd({
    pattern: "fb",
    alias: ["facebook"],
    desc: "Download FB videos",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {

 if (isGroup) {
            const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
            if (fsh && (fsh?.error || fsh?.data?.type == 'false')) return;
        } else if (!isGroup) {
            const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
            if (fshh && (fshh?.error || fshh?.data?.type == 'false')) return;
        }


        if (!q || !q.startsWith("https://")) {
            return reply("Please provide a valid Facebook video URL.");
        }

        // Send initial downloading message
        const initialTime = new Date().getTime();
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your video...*' });

        // Fetch video data from the API
        const response = await fetchJson(`https://api.prabath-md.tech/api/fdown?url=${encodeURIComponent(q)}&apikey=${apikey}`);


        if (!response.data) {
            return reply("Failed to fetch video data. Please check the URL or try again later.");
        }

        // Edit message to "Uploading"
        const uploadMsg = await conn.sendMessage(from, { text: `*📤 Uploading your video...*`, edit: key });

        // Send the HD video (if available)
        if (response.data.hd) {
            await conn.sendMessage(from, { video: { url: response.data.hd }, mimetype: "video/mp4", caption: `* HD QUALITY VIDEO\n\n ${mg.botname}` }, { quoted: mek });
        } else {
            reply("HD video is not available.");
        }

        // Send the SD video (if available)
        if (response.data.sd) {
            await conn.sendMessage(from, { video: { url: response.data.sd }, mimetype: "video/mp4", caption: `* SD QUALITY VIDEO\n\n ${mg.botname}` }, { quoted: mek });
        } else {
            reply("SD video is not available.");
        }

        // Edit the uploading message to "Done"
        const finalTime = new Date().getTime();
        await sleep(1000);
        await conn.sendMessage(from, { text: "*✅ Media uploaded successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});



cmd({
    pattern: "mfire",
    alias: ["mediafire"],
    desc: "Download files from MediaFire",
    react: "📁",
    category: "download",
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

        if (!q || !q.startsWith("https://")) {
            return reply("Please provide a valid MediaFire URL.");
        }

        // Send initial downloading message
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your file...*' });

        // Fetch file data from the API
       const response = await fetchJson(`https://api.prabath-md.tech/api/mediafiredl?url=${encodeURIComponent(q)}&apikey=${apikey}`);


        if (response.status !== "success ✅" || !response.data || !response.data.link_1) {
            return reply("Failed to fetch file data. Please check the URL or try again later.");
        }

        // Extract file details
        const { link_1: downloadLink, name: fileName } = response.data;

        // Edit message to "Uploading"
        await conn.sendMessage(from, { text: `*📤 Uploading your file...*`, edit: key });

        // Download the file
        const fileBuffer = await axios.get(downloadLink, { responseType: 'arraybuffer' }).then(res => Buffer.from(res.data, 'binary'));

        // Send the file
        await conn.sendMessage(from, { document: fileBuffer, mimetype: "application/octet-stream", fileName: fileName, caption: `${mg.botname}` }, { quoted: mek });

        // Edit the uploading message to "Done"
        await conn.sendMessage(from, { text: "*✅ Media uploaded successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});



cmd({
    pattern: "apk",
    alias: ["apkdownload"],
    desc: "Download APKs",
    category: "download",
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

        if (!q) {
            return reply("Please provide the name of the APK to download.");
        }

        // Send initial message indicating that the search is in progress
        const { key } = await conn.sendMessage(from, { text: '🔍 Searching for the APK...' });

        // Fetch APK data from the updated API
       const response = await fetchJson(`https://prabath-md-api.up.railway.app/api/apkdl?q=${encodeURIComponent(q)}&apikey=${apikey}`);


        if (!response || response.status !== "success ✅" || !response.data) {
            return reply("Failed to fetch APK data. Please check the name or try again later.");
        }

        // Extract APK details
        const apkData = response.data;
        const { name, package: app_id, lastup, size, icon, dllink } = apkData;

        // Construct the APK information message
        const apkInfo = `
┌────────────────────────────
├ 📚 *Name* : ${name}
├ 📦 *Package ID* : ${app_id}
├ ⬆️ *Last update* : ${lastup}
├ 📥 *Size* : ${size} MB 
└────────────────────────────`;

        // Edit the search message to show APK info with image
        await conn.sendMessage(from, {
            image: { url: icon },
            caption: apkInfo
        }, { quoted: mek });

        // Send the APK file
        await conn.sendMessage(from, {
            document: { url: dllink },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${name}.apk`,
            caption:`${mg.botname}`
        }, { quoted: mek });

        // Edit the initial search message to "✅ Done"
        await conn.sendMessage(from, { text: "*✅ Apk uploaded successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});



cmd({
    pattern: "tt",
    alias: ["tiktok"],
    desc: "Download TikTok videos with and without watermarks.",
    category: "download",
    react: "📥",
    use: '.tt <TikTok video URL>',
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


        if (!q || !q.startsWith("https://")) {
            return reply("Please provide a valid TikTok video URL.");
        }

        // Send initial downloading message
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your video...*' });

        // Fetch video data from the API
        const apiUrl = `https://api.prabath-md.tech/api/tiktokdl?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        if (response.data.status !== "success ✅" || !response.data.data) {
            return reply("Failed to fetch video data. Please check the URL or try again later.");
        }

        const { title, no_wm, wm, cover, no_wm_size, wm_size } = response.data.data;

        // Prepare video information messages
        const videoInfoNoWm = `
────────────────────────────
📱 *Title:* ${title}
💧 *Without Watermark*
📏 *Size:* ${no_wm_size} bytes
────────────────────────────
        `;
        const videoInfoWm = `
────────────────────────────
📱 *Title:* ${title}
💧 *With Watermark*
📏 *Size:* ${wm_size || 'Not available'} bytes
────────────────────────────
        `;

        // Edit message to "Uploading"
        const uploadMsg = await conn.sendMessage(from, { text: '*📤 Uploading your video...*', edit: key });

        // Send video without watermark
        if (no_wm) {
            await conn.sendMessage(from, { video: { url: no_wm }, mimetype: "video/mp4", caption: videoInfoNoWm }, { quoted: mek });
        } else {
            reply("Video without watermark is not available.");
        }

        // Send video with watermark
        if (wm) {
            await conn.sendMessage(from, { video: { url: wm }, mimetype: "video/mp4", caption: videoInfoWm }, { quoted: mek });
        } else {
            reply("Video with watermark is not available.");
        }

        // Edit the uploading message to "Done"
        await sleep(1000);
        await conn.sendMessage(from, { text: "*✅ Media uploaded successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
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

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }


        if (!q) {
            return reply("Please provide a question for GPT. Example: .gpt What is your name?");
        }
        
        // Send "typing" presence to indicate the bot is thinking
        await conn.sendPresenceUpdate('composing', from);

        // Simulate a delay to make it look like the bot is thinking
        const thinkingTime = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000; // Random delay between 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        // Construct the API URL
        const apiUrl = `https://prabath-md-api.up.railway.app/api/gptv4?q=${encodeURIComponent(q)}&apikey=${apikey}`;

        // Make the API request
        const response = await axios.get(apiUrl);

        // Check if the response is successful
        if (response.data.status !== "success ✅") {
            return reply("Failed to fetch a response from GPT. Please try again later.");
        }

        // Extract the GPT response
        const gptResponse = response.data.data;

        // Send the GPT response as a message
        await conn.sendMessage(from, { text: gptResponse });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        // Send "paused" presence to stop typing indication
        await conn.sendPresenceUpdate('paused', from);
    }
});




cmd({
    pattern: "lamda",
    alias: ["lambda"],
    desc: "Ask LaMDA AI any question.",
    category: "AI",
    react: "🤖",
    use: '.lamda <your question>',
    filename: __filename
}, async(conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react}) => {
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        // Ensure the user provided a question
        if (!q) {
            return reply("Please provide a question for LaMDA AI. Example: .lamda What is your model?");
        }

        // Indicate the bot is typing
        await conn.sendPresenceUpdate('composing', from);

        // Simulate a "thinking" delay
        const thinkingTime = Math.floor(Math.random() * 1000) + 1000; // Random delay between 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        // Construct the API URL with the user's question
        const apiUrl = `https://api.vihangayt.com/ai/lamda?q=${encodeURIComponent(q)}`;

        // Make the API request
        const response = await axios.get(apiUrl);

        // Check if the response is successful
        if (response.data.status !== true) {
            return reply("Failed to fetch a response from LaMDA AI. Please try again later.");
        }

        // Extract the LaMDA response
        const lamdaResponse = response.data.data;

        // Send the LaMDA response as a message
        await conn.sendMessage(from, { text: lamdaResponse });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        // Stop typing indication
        await conn.sendPresenceUpdate('paused', from);
    }
});



cmd({
    pattern: "song2",
    react: "🎼",
    alias: ["dlsong2"],
    desc: "Download songs using an alternative API",
    category: "download",
    use: '.song2 <YouTube URL>',
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react}) => {
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }



        if (!q) return reply("Please provide a YouTube URL.");

        // Send initial downloading message
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your song...*'}, { quoted: mek });

        // Encode the URL
        const url = encodeURI(q);
        const apiUrl = `https://prabath-md-api.up.railway.app/api/ytmp3?url=${url}&apikey=${apikey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== "success ✅") return reply("Failed to fetch song details. Please try again.");

        const { title, file_size, download } = data.data;

        // Prepare song information messages
        const songInfo = `
┌───────────────────
├ *✨Title:* ${title}
├ *📏Size:* ${file_size}
├ *🔗Download:* ${download}
└───────────────────
${mg.botname}
        `;

        // Send song information
        await conn.sendMessage(from, { text: songInfo }, { quoted: mek });

        // Edit message to "Uploading"
        const uploadMsg = await conn.sendMessage(from, { text: '*📤 Uploading your song...*', edit: key });

        // Send audio
        await conn.sendMessage(from, { audio: { url: download }, mimetype: "audio/mpeg" }, { quoted: mek });

        // Send document
        await conn.sendMessage(from, { document: { url: download }, mimetype: "audio/mpeg", fileName: `${title}.mp3`, caption: `${mg.botname}` }, { quoted: mek });

        // Edit the uploading message to "Done"
        await sleep(1000);
        await conn.sendMessage(from, { text: "*✅ Media uploaded successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});



cmd({
    pattern: "esana",
    alias: ["esanews"],
    desc: "Get the latest Esana news.",
    category: "News",
    react: "📰",
    use: '.esana',
    filename: __filename
}, async(conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react}) => {
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        // Indicate the bot is typing
        await conn.sendPresenceUpdate('composing', from);

        // Simulate a "thinking" delay
        const thinkingTime = Math.floor(Math.random() * 1000) + 1000; // Random delay between 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        // Construct the API URL
        const apiUrl = `https://prabath-md-api.up.railway.app/api/esananews?apikey=${apikey}`;

        // Make the API request
        const response = await axios.get(apiUrl);

        // Check if the response is successful
        if (response.data.status !== "success ✅") {
            return reply("Failed to fetch the latest Esana news. Please try again later.");
        }

        // Extract the news data
        const news = response.data.data;

        // Prepare the news message
        const newsMessage = `📰 *${news.title}*\n\n${news.desc}\n\n📅 Date: ${news.date}\n\n🔗 [Read More](${news.url})\n\n${news.full_desc}\n\n${mg.botname}`;

        // Send the news message with the image
        await conn.sendMessage(from, { image: { url: news.image }, caption: newsMessage });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        // Stop typing indication
        await conn.sendPresenceUpdate('paused', from);
    }
});


cmd({
    pattern: "lankadeepa",
    alias: ["lanka"],
    desc: "Get the latest news from Lankadeepa.",
    category: "News",
    react: "📰",
    use: '.lankadeepa',
    filename: __filename
}, async(conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react}) => {
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }
        
        // Indicate the bot is typing
        await conn.sendPresenceUpdate('composing', from);

        // Simulate a "thinking" delay
        const thinkingTime = Math.floor(Math.random() * 1000) + 1000; // Random delay between 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        // Construct the API URL
        const apiUrl = `https://dark-yasiya-api-new.vercel.app/news/lankadeepa`;

        // Make the API request
        const response = await axios.get(apiUrl, { timeout: 10000 });  // 10 second timeout

        // Check if the response is successful
        if (!response.data.status) {
            return reply("Failed to fetch the latest Lankadeepa news. Please try again later.");
        }

        // Extract the news data
        const news = response.data.result;

        // Prepare the news message
        const newsMessage = `📰 *${news.title}*\n\n📅 Date: ${news.date}\n\n🔗 [Read More](${news.url})\n\n${news.desc}\n\n${mg.botname}`;

        // Send the news message with the image
        await conn.sendMessage(from, { image: { url: news.image }, caption: newsMessage });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        // Stop typing indication
        await conn.sendPresenceUpdate('paused', from);
    }
});



cmd({
    pattern: "sporty",
    alias: ["sportsnews"],
    desc: "Get the latest sports news.",
    category: "News",
    react: "🏅",
    use: '.sporty',
    filename: __filename
}, async(conn, mek, m, {from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react}) => {
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }


        // Indicate the bot is typing
        await conn.sendPresenceUpdate('composing', from);

        // Simulate a "thinking" delay
        const thinkingTime = Math.floor(Math.random() * 1000) + 1000; // Random delay between 1-2 seconds
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        // Construct the API URL
        const apiUrl = `https://prabath-md-api.up.railway.app/api/sportynews?apikey=${apikey}`;

        // Make the API request
        const response = await axios.get(apiUrl);

        // Check if the response is successful
        if (response.data.status !== "success ✅") {
            return reply("Failed to fetch the latest sports news. Please try again later.");
        }

        // Extract the news data
        const news = response.data.data;

        // Prepare the news message
        const newsMessage = `🏅 *${news.title}*\n\n${news.description}\n\n📅 Date: ${news.date}\n\n👤 Author: ${news.author}\n\n🔗 [Read More](${news.link})\n\n📰 Tags: ${news.tags}\n\n${mg.botname}`;

        // Send the sports news message with the image
        await conn.sendMessage(from, { image: { url: news.image }, caption: newsMessage });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        // Stop typing indication
        await conn.sendPresenceUpdate('paused', from);
    }
});

cmd({
    pattern: "derana",
    alias: ["derananews"],
    desc: "Get the latest Derana news.",
    category: "News",
    react: "📰",
    use: '.derana',
    filename: __filename
}, async(conn, mek, m, {
    from, quoted, isGroup, sender, reply
}) => {
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        // Indicate bot is typing
        await conn.sendPresenceUpdate('composing', from);

        // Simulate a random "thinking" delay (1-2 seconds)
        const thinkingTime = Math.floor(Math.random() * 1000) + 1000;
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        // API request to fetch Derana news
        const apiUrl = `https://prabath-md-api.up.railway.app/api/derananews?apikey=${apikey}`;
        const response = await axios.get(apiUrl);

        if (response.data.status !== "success ✅") {
            return reply("Failed to fetch Derana news. Please try again later.");
        }

        // Extract and format the news data
        const news = response.data.data;
        const newsMessage = `
📰 *${news.title}*\n\n
${news.desc}\n\n
🔗 [Read Full Article] (${news.url})\n\n
${mg.botname}`;

        // Send the news with the image
        await conn.sendMessage(from, { image: { url: news.image }, caption: newsMessage });

    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        // Stop typing indication
        await conn.sendPresenceUpdate('paused', from);
    }
});




cmd({
    pattern: "findapk",
    react: "🔍",
    alias: ["apksearch"],
    desc: "Search for APKs by name",
    category: "search",
    use: '.findapk <app name>',
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

        if (!q) return reply("Please provide an app name to search.");

        // Send initial searching message
        const { key } = await conn.sendMessage(from, { text: '*🔍 Searching for APK...*' }, { quoted: mek });

        // Encode the query
        const query = encodeURI(q);
        const apiUrl = `https://prabath-md-api.up.railway.app/api/apksearch?q=${query}&apikey=${apikey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== "success ✅") return reply("Failed to fetch APK details. Please try again.");

        const apkList = data.data.data;
        if (apkList.length === 0) return reply("No APKs found for your search query.");

        // Prepare APK information messages
        let apkInfo = "*Saviya-Md APK Search Results:*\n\n";
        apkList.forEach(apk => {
            apkInfo += `*📦 Name:* ${apk.name}\n*🔗 ID:* ${apk.id}\n\n`;
        });

        // Send APK information
        await conn.sendMessage(from, { text: apkInfo }, { quoted: mek });

        // Edit message to "Done"
        await sleep(1000);
        await conn.sendMessage(from, { text: "*✅ Search completed successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "findtt",
    react: "🎥",
    alias: ["tiktoksearch"],
    desc: "Search for TikTok videos by query",
    category: "search",
    use: '.findtt <search query>',
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

        if (!q) return reply("Please provide a search query.");

        // Send initial searching message
        const { key } = await conn.sendMessage(from, { text: '*🔍 Searching for TikTok videos...*' }, { quoted: mek });

        // Encode the query
        const query = encodeURI(q);
        const apiUrl = `https://prabath-md-api.up.railway.app/api/tiktoksearch?q=${query}&apikey=${apikey}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== "success ✅") return reply("Failed to fetch TikTok videos. Please try again.");

        const videoList = data.data;
        if (videoList.length === 0) return reply("No TikTok videos found for your search query.");

        // Prepare TikTok video information messages
        let videoInfo = "*Saviya-Md TikTok Search Results:*\n\n";
        videoList.forEach(video => {
            videoInfo += `*🎵 Title:* ${video.title}\n`;
            videoInfo += `*👤 Author:* ${video.author.nickname}\n`;
            videoInfo += `*🔗 Video URL:* ${video.play}\n`;
            videoInfo += `*🔊 Music URL:* ${video.music_info.play}\n`;
            videoInfo += `*📈 Play Count:* ${video.play_count}\n`;
            videoInfo += `*💬 Comments:* ${video.comment_count}\n\n`;
        });

        // Send video information
        await conn.sendMessage(from, { text: videoInfo }, { quoted: mek });

        // Edit message to "Done"
        await sleep(1000);
        await conn.sendMessage(from, { text: "*✅ Search completed successfully ✅*", edit: key });

    } catch (e) {
        console.log(e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "blaxbox",
    alias: ["bai"],
    desc: "Ask Blaxbox AI any question.",
    category: "AI",
    react: "🤖",
    use: '.blaxbox <your question>',
    filename: __filename
}, async (conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber,
    pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins,
    isAdmins, reply, react
}) => {
    try {
        // Check if command is used in a group and handle accordingly
        if (isGroup) {
            const groupCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`);
            if (groupCheck && (groupCheck?.error || groupCheck?.data?.type == 'false')) return;
        } else {
            const userCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`);
            if (userCheck && (userCheck?.error || userCheck?.data?.type == 'false')) return;
        }

        // Ensure a question is provided
        if (!q) {
            return reply("Please provide a question for Blaxbox AI. Example: .blaxbox What is your question?");
        }

        // Indicate bot is "typing" while fetching data
        await conn.sendPresenceUpdate('composing', from);

        // Simulate delay for a more human-like response time
        const thinkingTime = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        await new Promise(resolve => setTimeout(resolve, thinkingTime));

        // Make API call to Blaxbox AI
        const apiUrl = `https://prabath-ytdl-scrapper.koyeb.app/api/blaxbox?q=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        // Validate response from the API
        if (!response.data.status) {
            return reply("Failed to fetch a response from Blaxbox AI. Please try again later.");
        }

        // Extract AI response and limit to 5 image URLs and 5 other URLs
        const blaxboxResponse = response.data.data;
        const imageUrls = response.data.imageUrls.slice(0, 5);
        const otherUrls = response.data.otherUrls.slice(0, 5);

        // Format the response message
        let message = `*Blaxbox AI Response:*\n\n${blaxboxResponse}\n\n*Images:*\n`;
        imageUrls.forEach(url => {
            message += `${url}\n`;
        });

        // Add more information URLs if available
        if (otherUrls.length > 0) {
            message += `\n*More Info:*\n`;
            otherUrls.forEach(url => {
                message += `${url}\n`;
            });
        }

        // Send the compiled message
        await conn.sendMessage(from, { text: message });

    } catch (e) {
        // Log error and reply with the error message
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    } finally {
        // Stop "typing" indication
        await conn.sendPresenceUpdate('paused', from);
    }
});







cmd({
    pattern: "video2",
    react: "🎥",
    alias: ["dlvideo2"],
    desc: "Download videos from YouTube",
    category: "download",
    use: '.video2 <YouTube URL>',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        // Check if a URL is provided
        if (!q) return reply("Please provide a YouTube URL.");

        // Send initial downloading message
        const { key } = await conn.sendMessage(from, { text: '*📥 Fetching video details...*' }, { quoted: mek });

        // Encode the URL
        const url = encodeURIComponent(q);
        const apiUrl = `https://prabath-ytdl-scrapper.koyeb.app/api/yt5s?url=${url}`;

        // Fetch the video details from the API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check for successful response
        if (!data.status) {
            return reply("Failed to fetch video details. Please check the URL and try again.");
        }

        const { title, links } = data;

        // Prepare video quality options
        let videoOptions = "Available Qualities:\n";
        if (links.mp4) {
            links.mp4.forEach(video => {
                videoOptions += `- ${video.quality} (Size: ${video.size})\n`;
            });
        }

        // Send video information
        const videoInfo = `
┌───────────────────
├ *🎥 Title:* ${title}
├ *💬 Select Quality:* 
${videoOptions}
└───────────────────
Please reply with the desired quality (e.g., 720p).
${mg.botname}
        `;
        await conn.sendMessage(from, { text: videoInfo }, { quoted: mek });

        // Wait for user response for quality selection
        const filter = m => m.from === from && m.body.match(/(1080p|720p|360p|240p|144p)/);

        // Create a listener for the next message from the user
        const messageListener = async (msg) => {
            if (filter(msg)) {
                const selectedQuality = msg.body.trim();
                const selectedVideo = links.mp4.find(video => video.quality === selectedQuality);

                if (!selectedVideo) {
                    return reply("Invalid quality selected. Please try again.");
                }

                // Edit message to indicate uploading
                await conn.sendMessage(from, { text: '*📤 Uploading your video...*', edit: key });

                // Send video
                await conn.sendMessage(from, { video: { url: `https://prabath-ytdl-scrapper.koyeb.app/api/yt5s?url=${url}&quality=${selectedQuality}` }, mimetype: "video/mp4" }, { quoted: mek });

                // Confirm completion
                await conn.sendMessage(from, { text: "*✅ Video uploaded successfully ✅*", edit: key });

                // Remove listener after processing
                conn.removeMessageListener(messageListener);
            }
        };

        // Add the message listener to capture user response
        conn.on("message", messageListener);

        // Set a timeout to remove the listener if no response is received
        setTimeout(() => {
            conn.removeMessageListener(messageListener);
            reply("No quality selected within the time limit. Please try again.");
        }, 60000); // 60 seconds timeout

    } catch (e) {
        console.error(e); // Use console.error for errors
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
    pattern: "xvdl",
    react: "🎥",
    alias: ["dlexvid"],
    desc: "Download Xvideos videos using the video name or URL",
    category: "download",
    use: '.xvdl <Xvideos Name or URL>',
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please provide a video name or a valid Xvideos URL.");

        const isUrl = q.startsWith("http://") || q.startsWith("https://");
        let apiUrl;

        if (isUrl) {
            const url = encodeURI(q);
            apiUrl = `https://dark-yasiya-api-new.vercel.app/download/xvideo?url=${url}`;
        } else {
            // Searching for the video name
            const searchUrl = `https://dark-yasiya-api-new.vercel.app/search/xvideo?text=${encodeURI(q)}`;
            console.log("Searching for:", searchUrl); // Log the search query for debugging

            const searchResponse = await fetch(searchUrl);
            if (!searchResponse.ok) {
                return reply(`Search API returned an error: ${searchResponse.statusText}`);
            }

            const searchData = await searchResponse.json().catch(err => {
                console.error("Error parsing search response:", err);
                return null;
            });

            console.log("Search API response:", searchData); // Log the response

            if (!searchData || !searchData.result || searchData.result.length === 0) {
                return reply("No results found for that name.");
            }

            // Select the first result for downloading
            const firstResult = searchData.result[0];
            apiUrl = `https://dark-yasiya-api-new.vercel.app/download/xvideo?url=${firstResult.link}`;
        }

        // Send initial downloading message
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your video...*' }, { quoted: mek });

        const response = await fetch(apiUrl);
        if (!response.ok) {
            // Log response for debugging
            const errorMessage = await response.text();
            console.error("Download API response:", errorMessage);
            return reply(`Download API returned an error: ${response.statusText}`);
        }

        const data = await response.json().catch(err => {
            console.error("Error parsing download response:", err);
            return null;
        });

        if (!data || !data.status || !data.result) {
            return reply("Failed to fetch video details. Please try again.");
        }

        // Extract video details
        const { title, views, image, like, dislike, size, dl_link } = data.result;

        // Send upload message
        await conn.sendMessage(from, { text: '*📤 Uploading your video...*', edit: key });

        // Send video information
        const videoInfo = `\
┌──────────────────────\
├ *✨ Title:* ${title}\
├ *👁️ Views:* ${views}\
├ *👍 Likes:* ${like}\
├ *👎 Dislikes:* ${dislike}\
├ *📏 Size:* ${size}\
├ *🔗 Download Link:* ${dl_link}\
└──────────────────────\
${mg.botname}`;

        await conn.sendMessage(from, { text: videoInfo, image: { url: image } }, { quoted: mek });

        // Send the video
        await conn.sendMessage(from, { video: { url: dl_link }, mimetype: "video/mp4", caption: title }, { quoted: mek });

        // Edit the upload message to indicate success
        await conn.sendMessage(from, { text: "*✅ Video uploaded successfully ✅*", edit: key });

    } catch (e) {
        console.error("Unexpected error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});




cmd({
    pattern: "song3",
    react: "🎵",
    alias: ["dlsong3"],
    desc: "Download songs using Pink Venom API",
    category: "download",
    use: '.song3 <YouTube URL>',
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

        if (!q) return reply("Please provide a valid YouTube URL.");

        
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your song...*'}, { quoted: mek });

       
        const url = encodeURIComponent(q);
        const apiUrl = `https://api-pink-venom.vercel.app/api/ytdl?url=${url}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        
        if (!data || data.status !== "success") return reply("Failed to fetch song details. Please try again later.");

        const { title, size, download_url } = data;

 
        const songInfo = `
┌───────────────────
├ *🎶 Title:* ${title}
├ *📏 Size:* ${size}
├ *🔗 Download URL:* ${download_url}
└───────────────────
${config.botname}
        `;
        await conn.sendMessage(from, { text: songInfo }, { quoted: mek });

        
        await conn.sendMessage(from, { text: '*📤 Uploading your song...*' }, { quoted: mek, edit: key });

        
        await conn.sendMessage(from, { audio: { url: download_url }, mimetype: "audio/mpeg" }, { quoted: mek });

        
        await conn.sendMessage(from, { document: { url: download_url }, mimetype: "audio/mpeg", fileName: `${title}.mp3` }, { quoted: mek });

        
        await conn.sendMessage(from, { text: "*✅ Media uploaded successfully ✅*", edit: key });

    } catch (error) {
        console.error(error);
        reply(`An error occurred: ${error.message}`);
    }
});

