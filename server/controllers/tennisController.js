const tennisApi = require('../services/tennisApiService');
const { getOrSet } = require('../services/cacheServices');

exports.getLiveMatches = async (req, res) => {
    try {
        const matches = await getOrSet('tennis_live', tennisApi.getLiveMatches, 30);

        const normalized = (matches || []).map(m => ({
            id: m.id,
            sport: 'tennis',
            name: `${m.home_team?.name} vs ${m.away_team?.name}`,
            status: m.status_more || m.status,
            isLive: m.status === 'inprogress',
            isFinished: m.status === 'finished',
            score: m.home_score && m.away_score ? `${m.home_score.display} - ${m.away_score.display}` : 'v',
            round: m.round_info?.round || m.round_number || '',
            tournament: m.league?.name || 'Unknown',
            date: m.start_at
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