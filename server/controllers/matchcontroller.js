const cricketApi=require('../services/cricketApiService');
const {getOrSet}=require('../services/cacheServices');

exports.getLiveMatches = async (req, res) => {
    try {
        const matches = await getOrSet(
            'cricket_liveMatches',
            cricketApi.getCurrentMatches,
            30);
        const live = matches.filter(m=>m.matchStarted && !m.matchEnded);
        const completed = matches.filter(m=>m.matchEnded);
        const upcoming = matches.filter(m=>!m.matchStarted);

        res.json({
            sport: 'cricket',
            live,
            completed,
            upcoming,
            total: matches.length
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch cricket matches',
            error:error.message
        });
    }
};
exports.getMatchDetails = async (req, res) => {
    try {
        const match = await getOrSet(
            `cricket_match_${req.params.id}`,
            () => cricketApi.getMatchInfo(req.params.id),
            60                                            
        );
        res.json(match);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch match details'
        });
    }
};
