const { predictMatch } = require('../services/predictionService');
const cricketApi = require('../services/cricketApiService');
const footballApi = require('../services/footballApiService');
const tennisApi = require('../services/tennisApiService');
const { getOrSet } = require('../services/cacheServices');

exports.getPrediction = async (req, res) => {
    try {
        const { sport, matchId } = req.params;

        let matchData;
        switch (sport) {
            case 'cricket':
                matchData = await getOrSet(`cricket_match_${matchId}`,
                    () => cricketApi.getMatchInfo(matchId), 60);
                break;
            case 'football':
                matchData = await getOrSet(`football_match_${matchId}`,
                    () => footballApi.getMatchDetails(matchId), 60);
                break;
            case 'tennis':
                matchData = await getOrSet(`tennis_match_${matchId}`,
                    () => tennisApi.getMatchDetails(matchId), 60);
                break;
            default:
                return res.status(400).json({ message: 'Unknown sport' });
        }

        const prediction = await predictMatch(matchData, sport);

        res.json({
            sport,
            matchId,
            prediction,
            generatedAt: new Date().toISOString(),
            disclaimer: 'AI predictions are for entertainment only. Not financial advice.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Prediction failed', error: error.message });
    }
};
