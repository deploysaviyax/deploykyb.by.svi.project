const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const cine = require('../lib/cine');
const { updateEnv, readEnv } = require('../lib/database');
const EnvVar = require('../lib/mongodbenv');
const SavedMessage = require('../lib/models/SavedMessage');
const mongoose = require('mongoose');

const  bot = config.BOTNUMBER;
cmd({
    pattern: "update",
    alias: ["updateenv","up"],
    desc: "Check and update environment variables",
    category: "owner",
    filename: __filename,
},
async (conn, mek, m, { from, q, reply, isOwner }) => {
    if (!isOwner) return;

    if (!q) {
        return reply("🙇‍♂️ *𝑃𝑙𝑒𝑎𝑠𝑒 𝑝𝑟𝑜𝑣𝑖𝑑𝑒 𝑡ℎ𝑒 𝑒𝑛𝑣𝑖𝑟𝑜𝑛𝑚𝑒𝑛𝑡 𝑣𝑎𝑟𝑖𝑎𝑏𝑙𝑒 𝑎𝑛𝑑 𝑖𝑡𝑠 𝑛𝑒𝑤 𝑣𝑎𝑙𝑢𝑒.* \n\nExample: `.update AUTO_READ_STATUS: true`");
    }

    // Find the position of the first colon or comma
    const colonIndex = q.indexOf(':');
    const commaIndex = q.indexOf(',');

    // Ensure we have a valid delimiter index
    const delimiterIndex = colonIndex !== -1 ? colonIndex : commaIndex;
    if (delimiterIndex === -1) {
        return reply("🫠 *Invalid format. Please use the format:* `.update KEY:VALUE`");
    }

    // Extract key and value
    const key = q.substring(0, delimiterIndex).trim();
    const value = q.substring(delimiterIndex + 1).trim();
    
    // Extract mode if provided
    const parts = value.split(/\s+/).filter(part => part.trim());
    const newValue = value; // Use the full value as provided by the user
    const mode = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
    
    const validModes = ['public', 'private', 'groups', 'inbox'];
    const finalMode = validModes.includes(mode) ? mode : '';

    if (!key || !newValue) {
        return reply("🫠 *Invalid format. Please use the format:* `.update KEY:VALUE`");
    }

    // Specific checks for MODE, ALIVE_IMG, and AUTO_READ_STATUS
    if (key === 'ANTI_DELETE' && !['true', 'false'].includes(newValue)) {
        return reply("😓 *Invalid value for ANTI_DELETE. Please use `true` or `false`.*");
    }

 if (key === 'ALWAYS_ONLINE' && !['true', 'false'].includes(newValue)) {
        return reply("😓 *Invalid value for ALWAYS_ONLINE. Please use `true` or `false`.*");
    }

    if (key === 'LOGO' && !newValue.startsWith('https://')) {
        return reply("😓 *Invalid URL format. PLEASE GIVE ME IMAGE URL*");
    }

  if (key === 'DEVAPIKEY' && !['SACHIBOT'].includes(newValue)) {
        return reply("🧑🏻‍🔧 *You can't change `DEVAPIKEY`.*");
    }

if (key === 'DEVNUMBER' && !['94725881990'].includes(newValue)) {
        return reply("🧑🏻‍🔧 *You can't change `DEVNUMBER`.*");
    }

if (key === 'DEVBOT' && !['94725881990'].includes(newValue)) {
        return reply("🧑🏻‍🔧 *You can't change `DEVBOT`.*");
    }

    if (key === 'AUTO_READ_STATUS' && !['true', 'false'].includes(newValue)) {
        return reply("😓 *Invalid value for AUTO_READ_STATUS. Please use `true` or `false`.*");
    }

    try {
        // Check if the environment variable exists
        const envVar = await EnvVar.findOne({ key: key });

        if (!envVar) {
            // If the variable does not exist, fetch and list all existing env vars
            const allEnvVars = await EnvVar.find({});
            const envList = allEnvVars.map(env => `${env.key}: ${env.value}`).join('\n');
            return reply(`❌ *The environment variable ${key} does not exist.*\n\n*Here are the existing environment variables:*\n\n${envList}`);
        }

        // Update the environment variable
        await updateEnv(key, newValue, finalMode);
        reply(`✅ *Environment variable updated.*\n\n🗃️ *${key}* ➠ ${newValue} ${finalMode ? `\n*Mode:* ${finalMode}` : ''}`);
        
    } catch (err) {
        console.error('Error updating environment variable:' + err.message);
        reply("🙇‍♂️ *Failed to update the environment variable. Please try again.*" + err);
    }
});


cmd({
    pattern: "settings",
    alias: ["setting","env"],
    react: "⚙️",
    desc: "Get current environment variables and send an image",
    category: "info",
    use: '.settings',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
 if (!isOwner) return reply("*You don't have permission to use this command.*");

    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        // Fetch all existing environment variables
        const allEnvVars = await EnvVar.find({});
        
        // Format the list of environment variables with line emojis
        const envList = allEnvVars.map(env => `│  🗝️ ${env.key}: ${env.value}`).join('\n');
        
        // Define the image URL
        const imageUrl = "https://aspire.jo/wp-content/uploads/2024/02/risk.png";

        // Prepare the message with a more beautiful layout
        const message = `✨ *Current Environment Variables* ✨\n\n` +
                        `────────────────────────────────\n` +
                        `${envList}\n` +
                        `────────────────────────────────\n\n` +
                        `🌟 *_Use the .update command to update settings._*\n` +
                        `${mg.botname}`;

        // Send the image with environment variables as caption
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: message
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "save",
    alias: ["savemsg", "bookmark"],
    desc: "Save a message to the database",
    category: "general",
    filename: __filename,
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
 if (!isOwner) return reply("*You don't have permission to use this command.*");

    if (!q) {
        return reply("🙇‍♂️ *Please provide a message to save.*");
    }

    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        // Save the message in MongoDB
        const savedMessage = new SavedMessage({
            user: mek.sender,
            chatId: from,
            message: q,
        });
        await savedMessage.save();

        reply(`✅ *Message saved successfully!*`);
    } catch (err) {
        console.error('Error saving message to the database:' + err.message);
        reply("🙇‍♂️ *Failed to save the message.*");
    }
});


cmd({
    pattern: "saved",
    alias: ["viewmsg", "mybookmarks"],
    desc: "View your saved messages",
    category: "general",
    filename: __filename,
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
 if (!isOwner) return reply("*You don't have permission to use this command.*");

    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }


        // Fetch the saved messages from MongoDB
        const savedMessages = await SavedMessage.find({ chatId: from });

        if (savedMessages.length === 0) {
            return reply("❌ *No saved messages found.*");
        }

        const messageList = savedMessages.map((msg, index) => `${index + 1}. ${msg.message}`).join('\n');
        reply(`🗂️ *Here are your saved messages:*\n\n${messageList}`);
    } catch (err) {
        console.error('Error fetching saved messages from the database:' + err.message);
        reply("🙇‍♂️ *Failed to retrieve saved messages. Please try again.*");
    }
});



cmd({
    pattern: "deletesaved", // Main command trigger
    alias: ["removesaved", "delsave"], // Additional aliases
    desc: "Delete a saved message from the database",
    category: "general", // Command category
    filename: __filename, // Auto-reference to the file for tracking
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
 if (!isOwner) return reply("*You don't have permission to use this command.*");
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        const messageToDelete = q.trim(); // Get the part of the message to delete
        const userId = mek.sender; // The user who sent the command

        if (!messageToDelete) {
            return await reply('*❌ Please provide the message or part of the message you want to delete.*');
        }

        // Find and delete the saved message based on user ID and the message content
        const result = await SavedMessage.findOneAndDelete({ user: userId, message: { $regex: new RegExp(messageToDelete, 'i') } });

        if (result) {
            await reply('*✅ Your saved message has been deleted successfully.*');
        } else {
            await reply('*❌ No matching saved message found for deletion.*');
        }
    } catch (error) {
        console.error('Error deleting saved message:', error);
        await reply('*❌ An error occurred while trying to delete the message. Please try again.*');
    }
});


cmd({
    pattern: "delallsave", 
    alias: ["delallsaved", "clearallsaved"], 
    desc: "Delete all saved messages of a user from the database",
    category: "general", 
    filename: __filename, 
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
 if (!isOwner) return reply("*You don't have permission to use this command.*");
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }

        const userId = mek.sender; 

       
        const result = await SavedMessage.deleteMany({ user: userId });

        if (result.deletedCount > 0) {
            await reply(`*✅ All saved messages (${result.deletedCount}) have been deleted successfully.*`);
        } else {
            await reply('*❌ No saved messages found to delete.*');
        }
    } catch (error) {
        console.error('Error deleting all saved messages:', error);
        await reply('*❌ An error occurred while trying to delete all saved messages. Please try again.*');
    }
});


cmd({
    pattern: "getallsave", 
    alias: ["allsaved", "savedmessages"], 
    desc: "Get all saved messages with chat ID",
    category: "general", 
    filename: __filename, 
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isSaviya, groupAdmins, isBotAdmins, isAdmins, reply,react}) => {
 if (!isOwner) return reply("*You don't have permission to use this command.*");
    try {

if(isGroup){
        const fsh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${from}`); 
        if(fsh &&  (fsh?.error || fsh?.data?.type == 'false')) return;
         
        
    }else if(!isGroup){
        const fshh = await fetchJson(`${config.DOWNLOADSAPI}${bot}/${sender}`); 
        if(fshh &&  (fshh?.error || fshh?.data?.type == 'false')) return;
      }


        const userId = mek.sender; 

        // Find all messages saved by this user
        const savedMessages = await SavedMessage.find({ user: userId });

        if (savedMessages.length > 0) {
            let response = '_*📌 Here are all your saved messages:*_\n\n';

            // Loop through each message and append to response
            savedMessages.forEach((msg, index) => {
                response += `${index + 1}. *🔖Chat ID:* ${msg.chatId}\n\n*💬Message:* ${msg.message}\n\n*📆Saved On:* ${msg.timestamp}\n\n`;
            });

            await reply(response.trim());
        } else {
            await reply('*❌ No saved messages found.*');
        }
    } catch (error) {
        console.error('Error retrieving saved messages:', error);
        await reply('*❌ An error occurred while trying to retrieve saved messages. Please try again.*');
    }
});
