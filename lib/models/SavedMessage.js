const mongoose = require('mongoose');

// Define the schema for saved messages
const SavedMessageSchema = new mongoose.Schema({
    user: String,  // The user who sent the message
    chatId: String, // The ID of the chat where the message was saved
    message: String, // The message content
    timestamp: { type: Date, default: Date.now }, // Time the message was saved
});

// Create the model from the schema
const SavedMessage = mongoose.model('SavedMessage', SavedMessageSchema);

// Export the model for use in other parts of the app
module.exports = SavedMessage;
