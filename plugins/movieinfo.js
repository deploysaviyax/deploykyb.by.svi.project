const axios = require('axios');
const { cmd } = require('../command');
const config = require('../config'); // Ensure your API key is in config
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const mg = require('../lib/mg')
const cine = require('../lib/cine');



const  bot = config.BOTNUMBER;

cmd({
    pattern: "movieinfo",
    desc: "Fetch detailed information about a movie.",
    category: "other",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const movieName = args.join(' ');
        if (!movieName) {
            return reply("*📽️ Please Enter the movie Name*");
        }

        const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${config.OMDB_API_KEY}`;
        const response = await axios.get(apiUrl);

        const data = response.data;
        if (data.Response === "False") {
            return reply("🚫 Movie not found.");
        }

        const movieInfo = `\n☘️ *𝗧ɪᴛʟᴇ : _${data.Title}_*

▫️📅 *𝗥ᴇʟᴇᴀꜱᴇ 𝗗ᴀᴛᴇ ➟  _${data.Released}_*
▫️🎭 *𝗚ᴇɴʀᴇꜱ ➟  _${data.Genre}_*
▫️👨🏻‍💼 *𝗗ɪʀᴇᴄᴛᴏʀ ➟ _${data.Director}_*
▫️🔠 *𝗟ᴀɴɢᴜᴀɢᴇ ➟ _${data.Language}_*
▫️🌎 *𝗖ᴏᴜɴᴛʀʏ ➟ _${data.Country}_*
▫️🥇 *𝗜ᴍᴅʙ 𝗩ᴏᴛᴇꜱ ➟ _${data.imdbVotes} Votes_*

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟*

*𝙹𝙾𝙸𝙽 𝚄𝚂 ➟* https://chat.whatsapp.com/HeOPSllXhD1IJ9n9K7xWxY

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟➟*`;

        // Define the image URL
        const imageUrl = data.Poster && data.Poster !== 'N/A' ? data.Poster : config.ALIVE_IMG;

        // Send the movie information along with the poster image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `${movieInfo}\n\n> *SAVIYA-X-MD*`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});
