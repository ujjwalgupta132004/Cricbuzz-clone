// server/services/predictionService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const predictMatch = async (matchData, sport) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert ${sport} analyst. Based on the following REAL match data, provide:
1. Win probability (% for each team/player)
2. Key factors that will decide the match
3. Your prediction with reasoning

IMPORTANT: Base your analysis ONLY on the data provided below. Do not make up statistics.

Match Data:
${JSON.stringify(matchData, null, 2)}

Respond in this JSON format:
{
  "team1": { "name": "...", "winProbability": 65 },
  "team2": { "name": "...", "winProbability": 35 },
  "keyFactors": ["factor1", "factor2", "factor3"],
  "prediction": "Team X will likely win because...",
  "confidence": "high/medium/low"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
        return JSON.parse(cleanJson);
    } catch {
        return { prediction: text, confidence: 'low' };
    }
};

module.exports = { predictMatch };
