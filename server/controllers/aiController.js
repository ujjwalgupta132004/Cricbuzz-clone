const { askQuestion } = require('../services/llmService');

exports.chat = async (req, res) => {
    try {
        const { question, history, matchData } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ message: 'Question is required' });
        }

        const answer = await askQuestion(question, history || [], matchData || null);
        res.json({ answer });
    } catch (error) {
        console.error('AI Chat error:', error.message);
        res.status(500).json({ message: 'AI service error', error: error.message });
    }
};
