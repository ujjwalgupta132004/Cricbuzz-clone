const footballApi = require('../services/footballApiService');
const { getOrSet } = require('../services/cacheServices');

exports.getLiveMatches = async (req, res) => {
    try {
        const matches = await getOrSet('football_live', footballApi.getLiveMatches, 30);

        const normalized = (matches || []).map(m => ({
            id: m.id,
            sport: 'football',
            name: `${m.home_team?.name} vs ${m.away_team?.name}`,
            status: m.status_more || m.status,
            isLive: m.status === 'inprogress',
            isFinished: m.status === 'finished',
            score: m.home_score && m.away_score ? `${m.home_score.display} - ${m.away_score.display}` : 'v',
            homeTeam: m.home_team,
            awayTeam: m.away_team,
            league: m.league?.name || 'Unknown',
            date: m.start_at,
            venue: 'TBD'
        }));

        const live = normalized.filter(m => m.isLive);
        const completed = normalized.filter(m => m.isFinished);
        const upcoming = normalized.filter(m => !m.isLive && !m.isFinished);

        res.json({
            sport: 'football',
            live,
            completed,
            upcoming
        });
    } catch (error) {
        res.status(500).json({ message: ' (in controller)Failed to fetch football matches' });
    }
};
