const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are SportsPulse AI, an expert sports analyst covering:
🏏 Cricket - rules, stats, IPL/World Cup, player records, DLS method
⚽ Football - tactics, leagues (EPL, La Liga, UCL), transfers, formations
🎾 Tennis - Grand Slams, ATP/WTA rankings, player styles, surfaces

Rules:
1. Answer questions across all 3 sports accurately
2. If unsure, say "I'm not certain" — never make up statistics
3. When given real match data, analyze it rather than guessing
4. Keep answers concise but informative
5. You can compare players across eras and sports
6. For predictions, always add a disclaimer that these are AI-generated opinions`;

const askQuestion = async (question, chatHistory = [], matchData = null) => {
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_PROMPT,
    });

    let enhancedQuestion = question;
    if (matchData) {
        enhancedQuestion = `Here is REAL live match data for context:\n${JSON.stringify(matchData, null, 2)}\n\nUser's question: ${question}\n\nUse the data above for accuracy.`;
    }

    const history = chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(enhancedQuestion);
    return result.response.text();
};

module.exports = { askQuestion };
