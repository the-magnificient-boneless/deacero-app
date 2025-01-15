const express = require("express");
const { answerQuestion } = require("../../lib/llmAsk"); // Assuming your AI code is in 'your-ai-module.js'

const router = express.Router();

router.post("/puntobot/ask", async (req, res) => {
  try {
    const { text } = req.body; // Access the 'text' property from the request body

    if (!text) {
      return res.status(400).json({ error: "Missing text in request body" });
    }

    const result = await answerQuestion(text);
    res.json(result);
  } catch (error) {
    console.error("Error in /puntobot/ask:", error);
    res.status(500).json({ error: "Failed answering that question" });
  }
});

module.exports = router;
