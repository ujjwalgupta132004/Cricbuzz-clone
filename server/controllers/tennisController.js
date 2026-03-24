const tennisApi = require('../services/tennisApiService');
const { getOrSet } = require('../services/cacheService');

exports.getLiveMatches = async (req, res) => {
    try {
        const matches = await getOrSet('tennis_live', tennisApi.getLiveMatches, 30);

        const normalized = matches.map(m => ({
            id: m.event_id,
            sport: 'tennis',
            name: `${m.home_team} vs ${m.away_team}`,
            status: m.status,
            isLive: m.status === 'Live',
            isFinished: m.status === 'Finished',
            score: m.score,
            round: m.round,
            tournament: m.tournament?.name || 'Unknown',
            date: m.date
        }));

        const live = normalized.filter(m => m.isLive);
        const completed = normalized.filter(m => m.isFinished);
        const upcoming = normalized.filter(m => !m.isLive && !m.isFinished);

        res.json({
            sport: 'tennis',
            live,
            completed,
            upcoming
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tennis matches' });
    }
};