const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
const Chat = require("../models/chat");

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Call OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: `You are a Pakistani legal assistant. 
Only answer law and crime related questions specific to Pakistan. 
Always cite Pakistani Constitution articles, PPC sections, or case law. 
If asked about foreign law, politely refuse.`,
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiAnswer = response.data.choices[0].message.content;

    // Save chat to DB
    const chat = new Chat({
      _id: new mongoose.Types.ObjectId(),
      userPrompt: prompt,
      aiResponse: aiAnswer,
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

// ✅ GET route to fetch all previous chats
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }); // latest first
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

module.exports = router;
