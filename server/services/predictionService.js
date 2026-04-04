const { withModelFallback } = require('./llmService');

const toNumber = (value, fallback = 50) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

const buildFallbackPrediction = (matchData, sport) => {
    const cricketTeams = matchData?.teamInfo?.map((team) => team.shortname || team.name) || matchData?.teams || [];
    const footballTeams = [matchData?.homeTeam?.name, matchData?.awayTeam?.name].filter(Boolean);
    const tennisPlayers = matchData?.name?.split(' vs ') || [];
    const names = cricketTeams.length ? cricketTeams : footballTeams.length ? footballTeams : tennisPlayers;

    const team1Name = names[0] || 'Entity 1';
    const team2Name = names[1] || 'Entity 2';

    return {
        team1: { name: team1Name, winProbability: 52 },
        team2: { name: team2Name, winProbability: 48 },
        keyFactors: [
            `Current ${sport} momentum based on available match data`,
            'Recent scoring efficiency and game state',
            'Pressure handling in key moments',
        ],
        prediction: `${team1Name} hold a narrow edge, but this remains a close contest. This response used the local fallback because the live AI model was unavailable.`,
        confidence: 'medium',
    };
};

const normalizePrediction = (parsed, matchData, sport) => {
    const fallback = buildFallbackPrediction(matchData, sport);

    return {
        team1: {
            name: parsed?.team1?.name || fallback.team1.name,
            winProbability: Math.max(0, Math.min(100, toNumber(parsed?.team1?.winProbability, fallback.team1.winProbability))),
        },
        team2: {
            name: parsed?.team2?.name || fallback.team2.name,
            winProbability: Math.max(0, Math.min(100, toNumber(parsed?.team2?.winProbability, fallback.team2.winProbability))),
        },
        keyFactors: Array.isArray(parsed?.keyFactors) && parsed.keyFactors.length
            ? parsed.keyFactors.slice(0, 5)
            : fallback.keyFactors,
        prediction: parsed?.prediction || fallback.prediction,
        confidence: ['high', 'medium', 'low'].includes(parsed?.confidence) ? parsed.confidence : fallback.confidence,
    };
};

const predictMatch = async (matchData, sport) => {
    const prompt = `You are an expert ${sport} analyst.

Based only on this match data:
${JSON.stringify(matchData, null, 2)}

Return strict JSON:
{
  "team1": { "name": "Team A", "winProbability": 55 },
  "team2": { "name": "Team B", "winProbability": 45 },
  "keyFactors": ["factor 1", "factor 2", "factor 3"],
  "prediction": "Short reasoning",
  "confidence": "high"
}

Rules:
- Output JSON only
- Win probabilities should total 100
- Confidence must be high, medium, or low`;

    try {
        const text = await withModelFallback(async (model) => {
            const result = await model.generateContent(prompt);
            return result.response.text();
        });

        const cleanJson = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return normalizePrediction(parsed, matchData, sport);
    } catch (error) {
        console.error('Prediction fallback used:', error.message);
        return buildFallbackPrediction(matchData, sport);
    }
};

module.exports = { predictMatch };
