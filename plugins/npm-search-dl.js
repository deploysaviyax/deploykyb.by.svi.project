const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const cine = require('../lib/cine');
const mega = require('megajs');
const fs = require('fs');
const path = require('path');
const axios = require('axios');



const  bot = config.BOTNUMBER;

cmd({
    pattern: "mega",
    alias: ["megadl", "megafile"],
    desc: "Download a file from MEGA.nz",
    category: "download",
    react: "📥",
    use: '.mega <mega.nz file URL>',
    filename: __filename
}, async(conn, mek, m, {from, q, reply}) => {
    try {
        
        if (!q || !q.startsWith('https://mega.nz/')) {
            return reply("Please provide a valid MEGA.nz file URL. Example: .mega https://mega.nz/your-file-link");
        }

       
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your MEGA file...*'}, { quoted: mek });

        
        const file = mega.File.fromURL(q);

        
        const fileName = 'mega_download_' + Date.now();  
        const outputPath = path.join(__dirname, fileName);
        const fileStream = fs.createWriteStream(outputPath);

       
        file.download().pipe(fileStream);

        
        fileStream.on('finish', async () => {
            
            const uploadMsg = await conn.sendMessage(from, { text: '*📤 Uploading your MEGA file...*', edit: key });

           
            await conn.sendMessage(from, {
                document: { url: outputPath },
                fileName: fileName,
                mimetype: 'application/octet-stream',
                caption:`${mg.botname}`
            },  { quoted: mek });
           

            
            await new Promise(resolve => setTimeout(resolve, 1000));

            
            await conn.sendMessage(from, { text: "*✅ File uploaded successfully ✅*", edit: key });

            
            fs.unlinkSync(outputPath);
        });

    } catch (e) {
        console.error("Error in MEGA download command:", e);  
        reply(`An error occurred: ${e.message}`);
    } finally {
       
        await conn.sendPresenceUpdate('paused', from);
    }
});


