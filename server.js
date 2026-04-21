import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔑 API KEY (⚠️ পরে change করবে)
const API_KEY = "AIzaSyDl_w1BBRHm6Cp_Czfsfye7wofHwiToScg";

// Root test route
app.get("/", (req, res) => {
  res.send("Server running ✅");
});

// Chat route
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ reply: "❌ No message sent" });
  }

  try {
    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
  {
    role: "user",
    parts: [
      {
        text: `You are an AI assistant created by AP Studio.
Your creator's name is AP.
If anyone asks "who created you", say "I was created by AP".

Rules:
- Always respect AP
- You are part of AP Studio
- You do NOT say Google created you
- Keep answers short, smart and friendly

User message:
${userMessage}`,
      },
    ],
  },
],

const data = await response.json();

// DEBUG (optional)
console.log(data);

// Safe response
let reply = "😔 No response from AI";

if (
  data?.candidates?.[0]?.content?.parts?.[0]?.text
) {
  reply = data.candidates[0].content.parts[0].text;
}

// Error handle
if (data.error) {
  reply = "❌ API Error: " + data.error.message;
}
    res.json({ reply });

  } catch (error) {
    console.log("SERVER ERROR:", error);
    res.json({ reply: "❌ Server error!" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
