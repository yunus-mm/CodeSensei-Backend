import express from 'express';
import axios from 'axios';

const router = express.Router();

// Chat endpoint
router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: messages
            },
            {
                headers: {
                    // Always use API key from environment variable
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;
