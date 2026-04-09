const cricketApi = require('../services/cricketApiService');
const { getOrSet } = require('../services/cacheServices');
const { mockCricketMatches } = require('../services/mockData');

exports.getLiveMatches = async (req, res) => {
    try {
        let matches;
        try {
            matches = await getOrSet('cricket_liveMatches', cricketApi.getCurrentMatches, 30);
        } catch (apiError) {
            console.warn('Cricket API unavailable, using mock data:', apiError.message);
            matches = mockCricketMatches;
        }

        const live = matches.filter(m => m.matchStarted && !m.matchEnded);
        const completed = matches.filter(m => m.matchEnded);
        const upcoming = matches.filter(m => !m.matchStarted);

        res.json({
            sport: 'cricket',
            live,
            completed,
            upcoming,
            total: matches.length,
            isMock: matches === mockCricketMatches
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch cricket matches',
            error: error.message
        });
    }
};

exports.getMatchDetails = async (req, res) => {
    try {
        let match;
        try {
            match = await getOrSet(
                `cricket_match_${req.params.id}`,
                () => cricketApi.getMatchInfo(req.params.id),
                60
            );
        } catch (apiError) {
            try {
                const currentMatches = await getOrSet('cricket_liveMatches', cricketApi.getCurrentMatches, 30);
                match = currentMatches.find((m) => String(m.id) === String(req.params.id));
            } catch (fallbackError) {
                match = null;
            }

            if (!match) {
                match = mockCricketMatches.find(m => m.id === req.params.id) || mockCricketMatches[0];
            }
        }
        res.json(match);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch match details' });
    }
};
