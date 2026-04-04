const { predictMatch } = require('../services/predictionService');
const cricketApi = require('../services/cricketApiService');
const footballApi = require('../services/footballApiService');
const tennisApi = require('../services/tennisApiService');
const { getOrSet } = require('../services/cacheServices');
const { mockCricketMatches, mockFootballMatches, mockTennisMatches } = require('../services/mockData');

exports.getPrediction = async (req, res) => {
    try {
        const { sport, matchId } = req.params;

        let matchData;

        // Try real API first, fall back to mock data
        switch (sport) {
            case 'cricket':
                try {
                    matchData = await getOrSet(`cricket_match_${matchId}`,
                        () => cricketApi.getMatchInfo(matchId), 60);
                } catch {
                    matchData = mockCricketMatches.find(m => m.id === matchId) || mockCricketMatches[0];
                }
                break;
            case 'football':
                try {
                    matchData = await getOrSet(`football_match_${matchId}`,
                        () => footballApi.getMatchDetails(matchId), 60);
                } catch {
                    matchData = mockFootballMatches.find(m => m.id === matchId) || mockFootballMatches[0];
                }
                break;
            case 'tennis':
                try {
                    matchData = await getOrSet(`tennis_match_${matchId}`,
                        () => tennisApi.getMatchDetails(matchId), 60);
                } catch {
                    matchData = mockTennisMatches.find(m => m.id === matchId) || mockTennisMatches[0];
                }
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
        console.error('Prediction error:', error.message);
        res.status(500).json({ message: 'Prediction failed', error: error.message });
    }
};
