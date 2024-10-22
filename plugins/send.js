const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
function genMsgId() {
  const prefix = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomText = prefix;

  for (let i = prefix.length; i < 22; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomText += characters.charAt(randomIndex);
  }

  return randomText;
}

cmd({
    pattern: "send",
    desc: "Send a message to a specific JID",
    category: "main",
    use: '',
},
   async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isSachintha, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!args[0]) return reply("*Please provide the JID.*");
        if (args.length < 2) return reply("*Please provide the message to send.*");

        const targetJid = args[0]; 
        const message = args.slice(1).join(' '); 
        await conn.sendMessage(targetJid, { text: message });
        reply(`*Message successfully sent to ${targetJid}. ✅*`);
    } catch (e) {
        reply("An error occurred while sending the message.");
        console.error(e);
    }
});


cmd({
    pattern: "imgsend",
    desc: "Send an image with a caption to a specific JID",
    category: "main",
    use: "<JID> <Image URL> [Caption]",
}, 
     async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isSachintha, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!args[0]) return reply("*Please provide the JID.*");
        if (!args[1]) return reply("*Please provide the image URL.*");

        const targetJid = args[0]; 
        const imageUrl = args[1]; 
        const caption = args.slice(2).join(' ') || ""; 

        await conn.sendMessage(targetJid, { 
            image: { url: imageUrl },
            caption: caption
        });

        reply(`*Image successfully sent to ${targetJid}. ✅*`);
    } catch (e) {
        reply("An error occurred while sending the image.");
        console.error(e);
    }
});


cmd({
    pattern: "sendf",
    desc: "Send a file with a new filename and caption",
    category: "main",
    use: '<jid> <filename> <caption>',
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("*Please provide the JID.*");
        if (args.length < 3) return reply("*Please provide the filename and caption.*");

        const targetJid = args[0]; 
        const filename = args[1]; 
        const caption = args.slice(2).join(' '); 

        
        if (!mek.quoted || 
            (!mek.quoted.documentMessage && !mek.quoted.documentWithCaptionMessage)) {
            return await reply('Please reply to a document or a document with a caption to send it with a new filename and caption.');
        }

        const botNumber2 = conn.user.jid; 

        
        async function renameandsend(chat, caption, filename) {
            try {
                const documentMessage = mek.quoted.documentMessage || mek.quoted.documentWithCaptionMessage.message.documentMessage;

                
                const message = {
                    document: { url: documentMessage.url }, 
                    mimetype: documentMessage.mimetype, 
                    fileName: filename, 
                    caption: caption, 
                };

              
                await conn.sendMessage(chat, message);
                await reply(`*File sent to ${chat} with the new filename and caption.* ✅`);
            } catch (e) {
                await reply(`Error: ${e.message}`);
            }
        }

        
        await renameandsend(targetJid, caption, filename);

    } catch (e) {
        await reply(`Command failed: ${e.message}`);
    }
});
