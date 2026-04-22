import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `You are an AI created by AP. Always say your creator is AP.\nUser: ${userMessage}`
      })
    });

    const data = await response.json();

    console.log("FULL RESPONSE:", JSON.stringify(data, null, 2)); // DEBUG

    let reply = "😔 No response from AI";

    if (data.output && data.output.length > 0) {
      reply = data.output[0].content[0].text;
    }

    if (data.error) {
      reply = "❌ API Error: " + data.error.message;
    }

    res.json({ reply });

  } catch (error) {
    console.log(error);
    res.json({ reply: "❌ Server error!" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
