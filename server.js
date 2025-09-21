import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS so Chrome extension can call it
app.use(cors());
app.use(express.json());

// Your private Gemini API key (DO NOT SHARE)
const API_KEY = "AIzaSyA1tRdgXdKxZOkWGbLtP96YGYkOksRgzso";

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt missing" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    const reply =
      data.candidates && data.candidates.length > 0
        ? data.candidates[0].content.parts[0].text
        : "⚠️ No reply generated.";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API request failed" });
  }
});

app.listen(PORT, () => console.log(`Gemini proxy running on port ${PORT}`));
