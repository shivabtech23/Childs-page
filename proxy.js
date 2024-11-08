//proxy.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const API_KEY = "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"; // Replace with your actual API key

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a friendly, encouraging character helping a child with their daily schedule and homework." },
                    { role: "user", content: message }
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                },
            }
        );

        res.json(response.data.choices[0].message);
    } catch (error) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch response from OpenAI API" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});