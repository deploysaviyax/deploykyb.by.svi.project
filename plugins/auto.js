const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const cine = require('../lib/cine');
const { updateEnv, readEnv } = require('../lib/database');
const EnvVar = require('../lib/mongodbenv');
const AutoResponse = require('../lib/models/AutoResponse');
const mongoose = require('mongoose');
const axios = require('axios');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const  bot = config.BOTNUMBER;


// Auto Voice Command
cmd({
  on: "body"
}, async (conn, mek, m, { from, body }) => {
    const config = await readEnv();
    if (config.AUTO_VOICE === 'true') {
        const lowerBody = body.toLowerCase();
        const autoResponse = await AutoResponse.findOne({ trigger: lowerBody, type: 'voice' });
        
        if (autoResponse) {
            await conn.sendPresenceUpdate('recording', from);
            await conn.sendMessage(from, { audio: { url: autoResponse.url }, mimetype: 'audio/mpeg', ptt: true }, { quoted: mek });
        }
    }
});


// Auto Sticker Command

cmd({
  on: "body"
}, async (conn, mek, m, { from, body, q, isQuotedSticker, pushname }) => {
  const config = await readEnv();

  if (config.AUTO_STICKER === 'true') {
    const lowerBody = body.toLowerCase();
    const autoResponse = await AutoResponse.findOne({ trigger: lowerBody, type: 'sticker' });

    if (autoResponse) {
      try {
        // Sticker creation based on auto-response URL
        let sticker = new Sticker(autoResponse.url, {
          pack: pushname,
          author: '•𝚂𝙰𝚅𝙸𝚈𝙰 𝚇 𝙼𝙳• 𝙼𝙰𝙳𝙴 𝙱𝚈 𝚂𝙰𝚅𝙸𝚃𝙷𝚄 𝙸𝙽𝙳𝚄𝚆𝙰𝚁𝙰❄️⚡',
          type: q.includes("--crop") || q.includes("-c") ? StickerTypes.CROPPED : StickerTypes.FULL,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 75,
          background: "transparent"
        });

        const buffer = await sticker.toBuffer();
        return conn.sendMessage(from, { sticker: buffer }, { quoted: mek });
      } catch (error) {
        console.error("Error sending sticker:", error);
        return await conn.sendMessage(from, { text: "⚠️ Failed to create or send the sticker." }, { quoted: mek });
      }
    }
  }
});

// Auto Reply Command
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body }) => {  // Removed `isOwner` parameter since it’s no longer needed
    try {
        const config = await readEnv();

        
        if (config.AUTO_REPLY === 'true') {
            const lowerBody = body.toLowerCase();

            
            const autoResponse = await AutoResponse.findOne({ trigger: lowerBody, type: 'reply' });

            
            if (autoResponse && autoResponse.reply) {
                await conn.sendMessage(from, { text: autoResponse.reply }, { quoted: mek });
            }
        }
    } catch (error) {
        console.error("Error in auto-reply command:", error);
    }
});


cmd({
    pattern: "addreply",
    alias: ["add-reply"],
    react: "✅",
    desc: "Add an auto-reply message",
    category: "auto-response",
    use: '.addreply trigger, reply message',
    filename: __filename
},
async (conn, mek, m, { reply, isOwner, q }) => {
    if (!isOwner) return reply("*You don't have permission to use this command.*");

    const [trigger, replyMessage] = q.split(',');

    if (!trigger || !replyMessage) return reply('⚠️ Usage: `.addreply trigger, reply message`');

    try {
        const newReply = new AutoResponse({
            trigger: trigger.toLowerCase().trim(),
            type: 'reply',
            reply: replyMessage.trim()
        });

        await newReply.save();
        await reply(`✅ Auto-reply for "${trigger.trim()}" added successfully!`);
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to add auto-reply: ${err.message}`);
    }
});


cmd({
    pattern: "addsticker",
    alias: ["adds"],
    react: "✅",
    desc: "Add an auto-response sticker",
    category: "auto-response",
    use: '.addsticker trigger, sticker URL',
    filename: __filename
},
async (conn, mek, m, { reply, isOwner, q }) => {
    if (!isOwner) return reply("You don't have permission to use this command.");

    const [trigger, stickerUrl] = q.split(',');

    if (!trigger || !stickerUrl) return reply('⚠️ Usage: .addsticker trigger, sticker URL');

    try {
        const newSticker = new AutoResponse({
            trigger: trigger.toLowerCase().trim(),
            type: 'sticker',
            url: stickerUrl.trim()
        });

        await newSticker.save();
        await reply(`✅ Auto-sticker for "${trigger.trim()}" added successfully!`); // Use backticks for template literals
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to add auto-sticker: ${err.message}`); // Use backticks for template literals
    }
});



cmd({
    pattern: "addvoice",
    react: "✅",
    desc: "Add an auto-response voice note",
    category: "auto-response",
    use: '.addvoice trigger, voice URL',
    filename: __filename
},
async (conn, mek, m, { reply, isOwner, q }) => {
    if (!isOwner) return reply("You don't have permission to use this command.");

    const [trigger, voiceUrl] = q.split(',');

    if (!trigger || !voiceUrl) return reply('⚠️ Usage: .addvoice trigger, voice URL');

    try {
        const newVoice = new AutoResponse({
            trigger: trigger.toLowerCase().trim(),
            type: 'voice',
            url: voiceUrl.trim()
        });

        await newVoice.save();
        await reply(`✅ Auto-voice for "${trigger.trim()}" added successfully!`); // Use backticks for template literals
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to add auto-voice: ${err.message}`); // Use backticks for template literals
    }
});

//===========Del-cmd==============

cmd({
    pattern: "delreply",
    react: "❌",
    desc: "Delete an auto-response reply",
    category: "auto-response",
    use: '.delreply trigger',
    filename: __filename
},
async (conn, mek, m, { reply, isOwner, q }) => {
    if (!isOwner) return reply("You don't have permission to use this command.");

    const trigger = q.trim().toLowerCase();
    if (!trigger) return reply('⚠️ Usage: .delreply trigger');

    try {
        const result = await AutoResponse.findOneAndDelete({ trigger, type: 'reply' });
        
        if (result) {
            await reply(`✅ Auto-reply for "${trigger}" deleted successfully!`);
        } else {
            await reply(`❌ No auto-reply found for "${trigger}".`);
        }
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to delete auto-reply: ${err.message}`);
    }
});



cmd({
    pattern: "delsticker",
    alias: ["dels"],
    react: "❌",
    desc: "Delete an auto-response sticker",
    category: "auto-response",
    use: '.delsticker trigger',
    filename: __filename
},
async (conn, mek, m, { reply, isOwner, q }) => {
    if (!isOwner) return reply("You don't have permission to use this command.");

    const trigger = q.trim().toLowerCase();
    if (!trigger) return reply('⚠️ Usage: .delsticker trigger');

    try {
        const result = await AutoResponse.findOneAndDelete({ trigger, type: 'sticker' });
        
        if (result) {
            await reply(`✅ Auto-sticker for "${trigger}" deleted successfully!`);
        } else {
            await reply(`❌ No auto-sticker found for "${trigger}".`);
        }
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to delete auto-sticker: ${err.message}`);
    }
});



cmd({
    pattern: "delvoice",
    react: "❌",
    desc: "Delete an auto-response voice note",
    category: "auto-response",
    use: '.delvoice trigger',
    filename: __filename
},
async (conn, mek, m, { reply, isOwner, q }) => {
    if (!isOwner) return reply("You don't have permission to use this command.");

    const trigger = q.trim().toLowerCase();
    if (!trigger) return reply('⚠️ Usage: .delvoice trigger');

    try {
        const result = await AutoResponse.findOneAndDelete({ trigger, type: 'voice' });
        
        if (result) {
            await reply(`✅ Auto-voice for "${trigger}" deleted successfully!`);
        } else {
            await reply(`❌ No auto-voice found for "${trigger}".`);
        }
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to delete auto-voice: ${err.message}`);
    }
});


//============================================

cmd({
    pattern: "allreply",
    react: "📋",
    desc: "Get all auto-response replies",
    category: "auto-response",
    use: '.allreply',
    filename: __filename
},
async (conn, mek, m, { reply, isOwner }) => {
    if (!isOwner) return reply("You don't have permission to use this command.");

    try {
        const replies = await AutoResponse.find({ type: 'reply' });

        if (replies.length === 0) {
            return reply('⚠️ No auto-replies found.');
        }

        let response = '📋 *List of all auto-replies:*\n\n';
        replies.forEach((item, index) => {
            response += `${index + 1}. Trigger: *${item.trigger}*\nReply: ${item.reply}\n\n`;
        });

        await reply(response);
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to fetch auto-replies: ${err.message}`);
    }
});


cmd({
    pattern: "allsticker",
    react: "📋",
    desc: "Get all auto-response stickers",
    category: "auto-response",
    use: '.allsticker',
    filename: __filename
},
async (conn, mek, m, { reply, isOwner }) => {
    if (!isOwner) return reply("You don't have permission to use this command.");

    try {
        const stickers = await AutoResponse.find({ type: 'sticker' });

        if (stickers.length === 0) {
            return reply('⚠️ No auto-stickers found.');
        }

        let response = '📋 *List of all auto-stickers:*\n\n';
        stickers.forEach((item, index) => {
            response += `${index + 1}. Trigger: *${item.trigger}*\nSticker URL: ${item.url}\n\n`;
        });

        await reply(response);
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to fetch auto-stickers: ${err.message}`);
    }
});


cmd({
    pattern: "allvoice",
    react: "📋",
    desc: "Get all auto-response voice notes",
    category: "auto-response",
    use: '.allvoice',
    filename: __filename
},
async (conn, mek, m, { reply, isOwner }) => {
    if (!isOwner) return reply("You don't have permission to use this command.");

    try {
        const voices = await AutoResponse.find({ type: 'voice' });

        if (voices.length === 0) {
            return reply('⚠️ No auto-voices found.');
        }

        let response = '📋 *List of all auto-voices:*\n\n';
        voices.forEach((item, index) => {
            response += `${index + 1}. Trigger: *${item.trigger}*\nVoice URL: ${item.url}\n\n`;
        });

        await reply(response);
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to fetch auto-voices: ${err.message}`);
    }
});
