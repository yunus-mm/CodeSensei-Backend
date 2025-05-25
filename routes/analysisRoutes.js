import express from 'express';
import Analysis from '../models/Analysis.js';

const router = express.Router();

// Analyze code complexity using OpenRouter API
router.post('/', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        // Prompt for AI
        const prompt = `Analyze the following code and provide its time and space complexity with a brief explanation.\n\nCode:\n\n${code}`;

        // Call OpenRouter API
        const axios = (await import('axios')).default;
        const systemPrompt = `
You are an expert code complexity analyzer. Respond in this strict JSON format:
{
  "timeComplexity": "<big O notation for time complexity, e.g., O(n log n)>",
  "spaceComplexity": "<big O notation for space complexity, e.g., O(n)>",
  "explanation": "<brief explanation of both time and space complexity>"
}
Never copy the time complexity as the space complexity unless they are truly identical. If they are identical, explain why in the explanation. Always provide a distinct, accurate analysis for both time and space complexity.`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    // Always use API key from environment variable
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Try to parse the AI's response as JSON
        let analysis = null;
        try {
            const text = response.data.choices[0].message.content;
            analysis = JSON.parse(text);
        } catch (err) {
            // Fallback: just send the raw text
            analysis = { explanation: response.data.choices[0].message.content };
        }

        res.json({
            message: 'Analysis completed successfully',
            analysis
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Analysis failed', details: error.message });
    }
});

// Get all analysis history (userId and auth removed)
router.get('/history', async (req, res) => {
    try {
        const analyses = await Analysis.find({})
            .sort({ analysisDate: -1 });
        res.json(analyses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analysis history' });
    }
});

export default router;
