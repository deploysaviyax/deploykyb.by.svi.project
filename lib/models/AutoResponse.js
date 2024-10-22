const mongoose = require('mongoose');

const autoResponseSchema = new mongoose.Schema({
  trigger: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String, // 'reply', 'sticker', or 'voice'
    required: true
  },
  reply: String,  // Reply text, only for 'reply'
  url: String     // URL for sticker or voice, required for 'sticker' and 'voice'
});

module.exports = mongoose.model('AutoResponse', autoResponseSchema);
