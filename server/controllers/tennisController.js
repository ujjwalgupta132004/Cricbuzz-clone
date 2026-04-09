const tennisApi = require('../services/tennisApiService');
const { getOrSet } = require('../services/cacheServices');
const { mockTennisMatches } = require('../services/mockData');

const normalizeTennisMatch = (m) => ({
    id: String(m.id || m.eventId || m.customId),
    sport: 'tennis',
    name: `${m.homeTeam?.name || m.home_team?.name || 'Player 1'} vs ${m.awayTeam?.name || m.away_team?.name || 'Player 2'}`,
    status: m.statusDescription || m.status_more || m.status?.description || m.status?.type || m.status,
    isLive: ['inprogress', 'live', '1', 1].includes(m.status?.type || m.status),
    isFinished: ['finished', 'ended', '3', 3].includes(m.status?.type || m.status),
    score: m.homeScore?.current != null && m.awayScore?.current != null
        ? `${m.homeScore.current} - ${m.awayScore.current}`
        : m.home_score && m.away_score
            ? `${m.home_score.display} - ${m.away_score.display}`
            : 'v',
    round: m.roundInfo?.round || m.round_info?.round || m.round || m.round_number || '',
    tournament: m.tournament?.name || m.league?.name || 'Unknown',
    date: m.startTimestamp ? new Date(m.startTimestamp * 1000).toISOString() : (m.start_at || m.startTime || null),
});

exports.getLiveMatches = async (req, res) => {
    try {
        let normalized;
        try {
            const matches = await getOrSet('tennis_live', tennisApi.getLiveMatches, 30);
            normalized = (matches || []).map(normalizeTennisMatch);
        } catch (apiError) {
            console.warn('Tennis API unavailable, using mock data:', apiError.message);
            normalized = mockTennisMatches;
        }

        const live = normalized.filter(m => m.isLive);
        const completed = normalized.filter(m => m.isFinished);
        const upcoming = normalized.filter(m => !m.isLive && !m.isFinished);

        res.json({
            sport: 'tennis',
            live,
            completed,
            upcoming,
            isMock: normalized === mockTennisMatches
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tennis matches' });
    }
};

exports.getMatchDetails = async (req, res) => {
    try {
        const eventId = req.params.id;
        let match;

        try {
            const details = await getOrSet(`tennis_match_${eventId}`, () => tennisApi.getMatchDetails(eventId), 60);
            match = normalizeTennisMatch(details);
            match.raw = details;
        } catch (error) {
            match = mockTennisMatches.find((item) => String(item.id) === String(eventId)) || mockTennisMatches[0];
        }

        res.json(match);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tennis match details', error: error.message });
    }
};
