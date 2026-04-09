const footballApi = require('../services/footballApiService');
const { getOrSet } = require('../services/cacheServices');
const { mockFootballMatches } = require('../services/mockData');

const normalizeFootballMatch = (m) => {
    const isApiSports = m?.fixture !== undefined;

    if (isApiSports) {
        const statusShort = m.fixture.status.short;
        const isLive = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'SUSP', 'INT', 'LIVE'].includes(statusShort);
        const isFinished = ['FT', 'AET', 'PEN'].includes(statusShort);

        return {
            id: String(m.fixture.id),
            sport: 'football',
            name: `${m.teams.home.name} vs ${m.teams.away.name}`,
            status: m.fixture.status.long,
            statusShort,
            isLive,
            isFinished,
            score: (m.goals.home !== null && m.goals.away !== null) ? `${m.goals.home} - ${m.goals.away}` : 'v',
            homeTeam: m.teams.home,
            awayTeam: m.teams.away,
            league: m.league?.name || 'Unknown',
            date: m.fixture.date,
            venue: m.fixture.venue?.name || 'TBD',
            leagueRound: m.league?.round || '',
        };
    }

    return {
        id: String(m.id),
        sport: 'football',
        name: `${m.homeTeam?.name || m.home_team?.name} vs ${m.awayTeam?.name || m.away_team?.name}`,
        status: m.status,
        isLive: m.isLive || m.status === 'inprogress',
        isFinished: m.isFinished || m.status === 'finished',
        score: m.score || 'v',
        homeTeam: m.homeTeam || m.home_team,
        awayTeam: m.awayTeam || m.away_team,
        league: m.league || m.league?.name || 'Unknown',
        date: m.date || m.start_at,
        venue: m.venue || 'TBD'
    };
};

exports.getLiveMatches = async (req, res) => {
    try {
        let normalized;
        try {
            const matches = await getOrSet('football_live', footballApi.getLiveMatches, 30);
            normalized = (matches || []).map(normalizeFootballMatch);
        } catch (apiError) {
            console.warn('Football API unavailable, using mock data:', apiError.message);
            normalized = mockFootballMatches;
        }

        const live = normalized.filter(m => m.isLive);
        const completed = normalized.filter(m => m.isFinished);
        const upcoming = normalized.filter(m => !m.isLive && !m.isFinished);

        res.json({
            sport: 'football',
            live,
            completed,
            upcoming,
            isMock: normalized === mockFootballMatches
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch football matches' });
    }
};

exports.getMatchDetails = async (req, res) => {
    try {
        const fixtureId = req.params.id;

        let match;
        let statistics = [];
        let lineups = [];

        try {
            const details = await getOrSet(`football_match_${fixtureId}`, () => footballApi.getMatchDetails(fixtureId), 60);
            match = normalizeFootballMatch(details?.[0] || details);
        } catch (error) {
            match = mockFootballMatches.find((item) => String(item.id) === String(fixtureId)) || mockFootballMatches[0];
        }

        try {
            statistics = await getOrSet(`football_stats_${fixtureId}`, () => footballApi.getFixtureStatistics(fixtureId), 60);
        } catch (error) {
            statistics = [];
        }

        try {
            lineups = await getOrSet(`football_lineups_${fixtureId}`, () => footballApi.getLineups(fixtureId), 60);
        } catch (error) {
            lineups = [];
        }

        res.json({
            ...match,
            statistics,
            lineups,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch football match details', error: error.message });
    }
};
