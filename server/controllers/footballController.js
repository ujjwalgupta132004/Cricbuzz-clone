const footballApi = require('../services/footballApiService');
const { getOrSet } = require('../services/cacheService');

exports.getLiveMatches = async (req, res) => {
    try {
        const matches = await getOrSet('football_live', footballApi.getLiveMatches, 30);

        const normalized = matches.map(m => ({
            id: m.fixture.id,
            sport: 'football',
            name: `${m.teams.home.name} vs ${m.teams.away.name}`,
            status: m.fixture.status.short === '1H' ? 'First Half'
                : m.fixture.status.short === '2H' ? 'Second Half'
                    : m.fixture.status.short === 'FT' ? 'Full Time'
                        : m.fixture.status.long,
            isLive: ['1H', '2H', 'HT', 'ET'].includes(m.fixture.status.short),
            isFinished: m.fixture.status.short === 'FT',
            score: `${m.goals.home} - ${m.goals.away}`,
            homeTeam: m.teams.home,
            awayTeam: m.teams.away,
            league: m.league.name,
            date: m.fixture.date,
            venue: m.fixture.venue?.name || 'TBD'
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
        res.status(500).json({ message: 'Failed to fetch football matches' });
    }
};
