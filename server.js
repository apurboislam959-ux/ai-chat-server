import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔑 API KEY (⚠️ পরে change করবে)
const API_KEY = "AIzaSyBTaLvzgblAUjzHJGTGRLdtP3YlBJn3VP4";

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
      `https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // 🔍 DEBUG
    console.log("Gemini API Response:", JSON.stringify(data, null, 2));

    let reply = "😔 No response from AI";

    // ✅ Safe response extract
    if (
      data &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      reply = data.candidates[0].content.parts[0].text;
    }

    // ❌ যদি error আসে
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
