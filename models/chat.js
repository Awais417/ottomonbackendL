const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userPrompt: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  threadId: {
    type: String,
    required: true, // Ensure every message belongs to a thread
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);