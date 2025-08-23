const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
const Chat = require("../models/chat");

router.post("/", async (req, res) => {
  try {
    const { prompt, conversationHistory, threadId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Prepare messages for OpenAI API, including conversation history
    const messages = [
      {
        role: "system",
        content: `You are a Pakistani legal assistant. 
Only answer law and crime related questions specific to Pakistan. 
Always cite Pakistani Constitution articles, PPC sections, or case law. 
If asked about foreign law, politely refuse.`,
      },
      // Include conversation history (array of { role, content })
      ...(conversationHistory || []),
      // Add the current user prompt
      { role: "user", content: prompt },
    ];

    // Call OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o", // Updated to a valid model (gpt-4.1 is not a valid model; use gpt-4o or gpt-3.5-turbo)
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiAnswer = response.data.choices[0].message.content;

    // Save chat to DB with threadId
    const chat = new Chat({
      _id: new mongoose.Types.ObjectId(),
      userPrompt: prompt,
      aiResponse: aiAnswer,
      threadId: threadId || new mongoose.Types.ObjectId().toString(), // Use provided threadId or generate a new one
      createdAt: new Date(),
    });

    await chat.save();

    res.json({
      answer: aiAnswer,
      savedChat: chat,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

// GET route to fetch all previous chats, grouped by threadId
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }); // Latest first
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

module.exports = router;