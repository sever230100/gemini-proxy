import fetch from "node-fetch";

// Your private Gemini API key (keep this secret, do not commit to public repos)
const API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini API request failed" });
  }
}
