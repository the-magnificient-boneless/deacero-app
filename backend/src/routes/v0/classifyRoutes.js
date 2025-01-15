const express = require("express");
const { classifyQuestion } = require("../../lib/llm"); // Assuming your AI code is in 'your-ai-module.js'

const router = express.Router();

router.post("/classify", async (req, res) => {
  try {
    const { text } = req.body; // Access the 'text' property from the request body

    if (!text) {
      return res.status(400).json({ error: "Missing text in request body" });
    }

    const result = await classifyQuestion(text);
    res.json(result);
  } catch (error) {
    console.error("Error in /classify:", error);
    res.status(500).json({ error: "Failed to classify text" });
  }
});

module.exports = router;
