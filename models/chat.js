const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userPrompt: { type: String, required: true },      // user question
  aiResponse: { type: String, required: true },      // AI answer
  createdAt: { type: Date, default: Date.now }       // timestamp
});

module.exports = mongoose.model("Chat", chatSchema);
