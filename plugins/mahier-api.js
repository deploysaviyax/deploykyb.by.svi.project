const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const axios = require('axios');
const cine = require('../lib/cine');

const  bot = config.BOTNUMBER;


cmd({
    pattern: "pair",
    alias: ["generatepair"],
    desc: "Generate a pairing code for a specified phone number or for the sender's number.",
    category: "utility",
    react: "🔑",
    use: ".pair <phone number> (optional)",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isSaviya, groupAdmins, isBotAdmins, isAdmins, reply, react }) => {
    try {
         let phoneNumber;

        if (args.length === 0) {
            
            if (m.sender) {
                phoneNumber = m.sender.split('@')[0];  
            } else {
                return await reply("Could not detect the sender's phone number.");
            }
        } else {
            
            phoneNumber = args[0];
        }

        
        const response = await axios.get(`https://saviya-md-sessions.koyeb.app/code?number=${phoneNumber}`);

        if (response.data && response.data.code) {
            const pairingCode = response.data.code;

            
            await reply(`> This is your pair code.\n\n*PAIR-CODE:* ${pairingCode}\n\n*Request:* ${phoneNumber}\n\n* The code will expire in one minute ⏱️`);

          
            await conn.sendMessage(phoneNumber + "@s.whatsapp.net", { text: `*PAIR-CODE:* ${pairingCode}\n\n*This is your pair code.*` });

            
            await new Promise(res => setTimeout(res, 60000));

            
            await reply("*`The pairing code has expired ⏱️. Please request a new one.`*");
        } else {
            await reply("Failed to generate the pairing code. Please try again later.");
        }

    } catch (error) {
        console.error("Error in .pair command:", error.message);
        await reply("An error occurred while processing the .pair command.");
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

if (isGroup) {
            const groupCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`);
            if (groupCheck && (groupCheck?.error || groupCheck?.data?.type == 'false')) return;
        } else {
            const userCheck = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`);
            if (userCheck && (userCheck?.error || userCheck?.data?.type == 'false')) return;
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

        const { key } = await conn.sendMessage(
            from,
            { text: `*Requesting ${pairCount} pairing codes for ${phoneNumber}...*` },
            { quoted: mek }
        );

       
        for (let i = 0; i < pairCount; i++) {
            try {
                const response = await axios.get(`https://saviya-md-sessions.koyeb.app/code?number=${phoneNumber}`);

                console.log(`Response from API for attempt ${i + 1}:`, response.data);

                const messageText = response.data && response.data.code
                    ? `*Pairing code ${i + 1}/${pairCount} for ${phoneNumber}: ${response.data.code}*`
                    : `*Pairing code: ${i + 1}/${pairCount}*\nFailed to retrieve.`;

                await conn.sendMessage(
                    from,
                    { text: messageText, edit: key }
                );

                
                await new Promise(res => setTimeout(res, 1000));

            } catch (error) {
                console.error(`Error on pairing request ${i + 1}:`, error.message);
                await conn.sendMessage(
                    from,
                    { text: `*Pairing code: ${i + 1}/${pairCount}*\nError: ${error.message}`, edit: key }
                );
            }
        }

        
        await conn.sendMessage(
            from,
            { text: `*Finished requesting ${pairCount} pairing codes for ${phoneNumber}.*`, edit: key }
        );

    } catch (error) {
        console.error("Error in .boompair command:", error.message);
        await reply("An error occurred while processing the boompair command.");
    }
});




cmd({
    pattern: "history",
    desc: "Download and upload a school project file",
    category: "project",
    react: "📄",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
       
        const fileUrl = "https://drive.google.com/uc?export=download&id=1nLGaqsJi_5GZvDTpgOJZ-vjM0p_3XOCR";
        const fileName = "School_Project_History.pdf";

       
        const { key } = await conn.sendMessage(from, { text: "*📥 Downloading your file, please wait...*" }, { quoted: mek });

        
        const res = await fetch(fileUrl, { method: "HEAD" });
        const fileSize = res.headers.get("content-length");
        const sizeInMB = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) : "Unknown";

        
        const fileInfo = `
📄 *File Name*: ${fileName}
📦 *File Size*: ${sizeInMB} MB

${mg.botname}
`;

        await conn.sendMessage(from, { text: "*📤 Uploading your file...*", edit: key });


        await conn.sendMessage(from, { text: fileInfo }, { quoted: mek });

        
        await conn.sendMessage(from, {
            document: { url: fileUrl },
            mimetype: "application/pdf",
            fileName: fileName,
            caption: `*File:* ${fileName}\n*Size:* ${sizeInMB}\n\n${mg.botname}`
        }, { quoted: mek });

        
        await conn.sendMessage(from, { text: "*✅ File uploaded successfully ✅*", edit: key });
    } catch (e) {
        console.error("Error in .history command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

