import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔑 তোমার Gemini API Key এখানে বসাও
const API_KEY = "AIzaSyBTaLvzgblAUjzHJGTGRLdtP3YlBJn3VP4";

// Route
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "😔 No response from AI";

    res.json({ reply });
  } catch (error) {
    console.log(error);
    res.json({ reply: "❌ Server error!" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
