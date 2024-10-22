const mongoose = require('mongoose');
const config = require('../config');
const EnvVar = require('./mongodbenv');

const defaultEnvVariables = [
   
   
    { key: 'PREFIX', value: '.' },
    { key: 'AUTO_READ_STATUS', value: 'false' },
    { key: 'DEVNUMBER', value: '94725881990' },
    { key: 'DEVBOT', value: '94725881990' },
    { key: 'DEVAPIKEY', value: 'SACHIBOT' },
    { key: 'BOTNUMBER', value: '94722617699' },
    { key: 'OWNERNUMBER‎', value: '94722617699' },
    { key: 'ALWAYS_ONLINE‎', value: 'false' },
    { key: 'ANTI_DELETE‎', value: 'true' },
    { key: 'AUTO_REPLY‎', value: 'true' },
    { key: 'AUTO_STICKER', value: 'true' },
    { key: 'AUTO_VOICE', value: 'true' },
    { key: 'LOGO‎', value: 'https://telegra.ph/file/bc53109a49bc5430a0a22.jpg' },
];

// MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB);
        console.log('🛜 MongoDB Connected ✅');

        // Check and create default environment variables
        for (const envVar of defaultEnvVariables) {
            const existingVar = await EnvVar.findOne({ key: envVar.key });

            if (!existingVar) {
                // Create new environment variable with default value
                await EnvVar.create(envVar);
                console.log(`➕ Created default env var: ${envVar.key}`);
            }
        }

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
