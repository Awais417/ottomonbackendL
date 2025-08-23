// routes/law.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

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
Only answer law and crime related questions **specific to Pakistan**. 
If a user asks about non-legal topics or laws outside Pakistan, politely refuse.  
Always reference the **relevant Pakistani laws, Constitution articles, or case law** when giving answers. 
Use citations like: "According to Article 10-A of the Constitution of Pakistan..." or 
"Under Section 302 of the Pakistan Penal Code (PPC)...".`
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

    res.json({
      answer: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

module.exports = router;
