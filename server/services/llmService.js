const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_PROMPT = `You are SportsPulse AI, an expert sports analyst covering:
🏏 Cricket - rules, stats, IPL/World Cup, player records, DLS method
⚽ Football - tactics, leagues (EPL, La Liga, UCL), transfers, formations
🎾 Tennis - Grand Slams, ATP/WTA rankings, player styles, surfaces

Rules:
1. Answer questions across all 3 sports accurately
2. If unsure, say "I'm not certain" and avoid inventing statistics
3. When given real match data, analyze it rather than guessing
4. Keep answers concise but informative
5. For predictions, always mention they are AI-generated opinions
6. If the user asks for a chart, output exactly one JSON block between \`\`\`json_chart and \`\`\`
7. Only output chart JSON when the user explicitly asks for a chart.`;

const FALLBACK_MODELS = [
    process.env.GEMINI_MODEL,
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
].filter(Boolean);

const getClient = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('Missing GEMINI_API_KEY');
    }

    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const isMissingModelError = (error) => {
    const message = error?.message?.toLowerCase?.() || '';
    return message.includes('not found') || message.includes('unsupported') || message.includes('models/');
};

const withModelFallback = async (executor) => {
    const client = getClient();
    let lastError;

    for (const modelName of FALLBACK_MODELS) {
        try {
            const model = client.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_PROMPT,
            });

            return await executor(model, modelName);
        } catch (error) {
            lastError = error;
            if (!isMissingModelError(error)) {
                throw error;
            }
        }
    }

    throw lastError || new Error('No working Gemini model configured');
};

const getLocalFallbackAnswer = (question, matchData = null) => {
    const q = (question || '').toLowerCase();

    if (q.includes('dls')) {
        return 'The DLS method adjusts targets in rain-affected cricket matches by estimating remaining scoring resources based on overs and wickets left.';
    }

    if (q.includes('drs')) {
        return 'DRS is the Decision Review System. Teams can challenge umpire decisions using ball tracking, UltraEdge, and other broadcast technology.';
    }

    if (q.includes('messi') && q.includes('ronaldo')) {
        return 'Messi offers more playmaking and chance creation, while Ronaldo has historically delivered greater penalty-box volume and aerial finishing. The better fit depends on whether you value orchestration or direct scoring output.';
    }

    if (matchData) {
        return `I could not reach the live Gemini model, so here is a local fallback summary: this match should be judged by current score pressure, recent momentum, and the balance between attack and control in the latest game state. Add a valid Gemini key to unlock deeper live analysis.`;
    }

    return 'The AI assistant is running in local fallback mode right now. Add a valid Gemini API key to enable richer live answers, but I can still help with rules, comparisons, and general sports concepts.';
};

const askQuestion = async (question, chatHistory = [], matchData = null) => {
    let enhancedQuestion = question;
    if (matchData) {
        enhancedQuestion = `Here is live match context:\n${JSON.stringify(matchData, null, 2)}\n\nUser question: ${question}\n\nUse this data directly when answering.`;
    }

    const parsedHistory = (chatHistory || [])
        .map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }))
        .filter((msg) => msg.parts[0].text);

    if (parsedHistory[0]?.role === 'model') {
        parsedHistory.shift();
    }

    try {
        return await withModelFallback(async (model) => {
            const chat = model.startChat({ history: parsedHistory });
            const result = await chat.sendMessage(enhancedQuestion);
            return result.response.text();
        });
    } catch (error) {
        console.error('AI assistant fallback used:', error.message);
        return getLocalFallbackAnswer(question, matchData);
    }
};

module.exports = {
    askQuestion,
    withModelFallback,
};
