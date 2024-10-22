const config = require('../config')
var os = require('os')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const cine = require('../lib/cine');
const mega = require('megajs');
const fs = require('fs');
const path = require('path');


const  bot = config.BOTNUMBER;

cmd({
    pattern: "mega",
    alias: ["megadl", "megafile"],
    desc: "Download a file from MEGA.nz",
    category: "Downloade",
    react: "📥",
    use: '.mega <mega.nz file URL>',
    filename: __filename
}, async(conn, mek, m, {from, q, reply}) => {
    try {
        // Ensure the user provides a MEGA URL
        if (!q || !q.startsWith('https://mega.nz/')) {
            return reply("Please provide a valid MEGA.nz file URL. Example: .mega https://mega.nz/your-file-link");
        }

        // Send initial downloading message
        const { key } = await conn.sendMessage(from, { text: '*📥 Downloading your MEGA file...*'}, { quoted: mek });

        // Parse the MEGA file URL
        const file = mega.File.fromURL(q);

        // Create a writable stream for saving the file
        const fileName = 'mega_download_' + Date.now();  // Unique name for the file
        const outputPath = path.join(__dirname, fileName);
        const fileStream = fs.createWriteStream(outputPath);

        // Start downloading the file
        file.download().pipe(fileStream);

        // Listen for the 'finish' event to know when the file is downloaded
        fileStream.on('finish', async () => {
            // Edit message to "Uploading"
            const uploadMsg = await conn.sendMessage(from, { text: '*📤 Uploading your MEGA file...*', edit: key });

            // Send the file in chat
            await conn.sendMessage(from, {
                document: { url: outputPath },
                fileName: fileName,
                mimetype: 'application/octet-stream',
                caption:`${mg.botname}`
            },  { quoted: mek });
           

            // Wait for 1 second before updating the message
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Edit the uploading message to "Done"
            await conn.sendMessage(from, { text: "*✅ File uploaded successfully ✅*", edit: key });

            // Delete the file after sending it
            fs.unlinkSync(outputPath);
        });

    } catch (e) {
        console.error("Error in MEGA download command:", e);  // Log the error for debugging
        reply(`An error occurred: ${e.message}`);
    } finally {
        // Stop typing indication
        await conn.sendPresenceUpdate('paused', from);
    }
});



