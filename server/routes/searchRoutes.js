const express = require('express');
const router = express.Router();
const cricketApi = require('../services/cricketApiService');
const footballApi = require('../services/footballApiService');
const tennisApi = require('../services/tennisApiService');
const { getOrSet } = require('../services/cacheServices');
const {
    mockCricketMatches,
    mockFootballMatches,
    mockTennisMatches,
    mockCricketSeries,
    mockSquads,
    mockPlayerCricket,
    mockPlayerFootball,
    mockPlayerTennis,
} = require('../services/mockData');

const SEARCH_ENTITIES = [
    { sport: 'cricket', type: 'Team', name: 'India' },
    { sport: 'cricket', type: 'Team', name: 'Australia' },
    { sport: 'cricket', type: 'Team', name: 'England' },
    { sport: 'cricket', type: 'Team', name: 'Pakistan' },
    { sport: 'cricket', type: 'Player', name: mockPlayerCricket.name },
    { sport: 'cricket', type: 'Player', name: 'Jasprit Bumrah' },
    { sport: 'football', type: 'Team', name: 'Manchester United' },
    { sport: 'football', type: 'Team', name: 'Liverpool' },
    { sport: 'football', type: 'Team', name: 'Barcelona' },
    { sport: 'football', type: 'Team', name: 'Real Madrid' },
    { sport: 'football', type: 'Player', name: mockPlayerFootball.name },
    { sport: 'football', type: 'Player', name: 'Cristiano Ronaldo' },
    { sport: 'tennis', type: 'Player', name: mockPlayerTennis.name },
    { sport: 'tennis', type: 'Player', name: 'Jannik Sinner' },
    { sport: 'tennis', type: 'Player', name: 'Novak Djokovic' },
    { sport: 'tennis', type: 'Player', name: 'Iga Swiatek' },
];

const uniquePlayers = (list) => {
    const seen = new Set();
    return list.filter((player) => {
        const key = player.name?.toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

const deriveCricketLiveSquads = (match) => {
    const teams = match?.teamInfo?.map((team) => team.name || team.shortname) || match?.teams || ['Team 1', 'Team 2'];
    const innings = match?.scorecard || [];

    const currentBatting = uniquePlayers(
        innings.flatMap((inning) => (inning.batting || []).map((player) => ({
            name: player.name || player.batsman?.name,
            role: 'Batter',
            isCaptain: false,
        })))
    );

    const currentBowling = uniquePlayers(
        innings.flatMap((inning) => (inning.bowling || []).map((player) => ({
            name: player.name || player.bowler?.name,
            role: 'Bowler',
            isCaptain: false,
        })))
    );

    const midpoint = Math.max(1, Math.ceil(currentBatting.length / 2));
    return {
        team1Name: teams[0] || 'Team 1',
        team2Name: teams[1] || 'Team 2',
        team1: currentBatting.slice(0, midpoint),
        team2: currentBowling.slice(0, Math.max(midpoint, 1)),
        source: 'live-derived',
    };
};

router.get('/squads/:sport', async (req, res) => {
    const { sport } = req.params;
    const { matchId } = req.query;

    try {
        if (sport === 'cricket' && matchId) {
            try {
                const match = await getOrSet(`cricket_match_${matchId}`, () => cricketApi.getMatchInfo(matchId), 60);
                const liveSquads = deriveCricketLiveSquads(match);
                if (liveSquads.team1.length || liveSquads.team2.length) {
                    return res.json(liveSquads);
                }
            } catch (error) {
                // fall through to mock fallback
            }
        }

        if (sport === 'football' && matchId) {
            try {
                const lineups = await getOrSet(`football_lineups_${matchId}`, () => footballApi.getLineups(matchId), 60);
                if (Array.isArray(lineups) && lineups.length >= 2) {
                    const [home, away] = lineups;
                    return res.json({
                        team1Name: home.team?.name || 'Home',
                        team2Name: away.team?.name || 'Away',
                        team1: [
                            ...(home.startXI || []).map((entry) => ({ name: entry.player?.name, role: entry.player?.pos || 'Starter', isCaptain: false })),
                            ...(home.substitutes || []).map((entry) => ({ name: entry.player?.name, role: 'Substitute', isCaptain: false })),
                        ],
                        team2: [
                            ...(away.startXI || []).map((entry) => ({ name: entry.player?.name, role: entry.player?.pos || 'Starter', isCaptain: false })),
                            ...(away.substitutes || []).map((entry) => ({ name: entry.player?.name, role: 'Substitute', isCaptain: false })),
                        ],
                        source: 'live-lineups',
                    });
                }
            } catch (error) {
                // fall through to mock fallback
            }
        }

        if (sport === 'tennis' && matchId) {
            try {
                const match = await getOrSet(`tennis_match_${matchId}`, () => tennisApi.getMatchDetails(matchId), 60);
                const p1 = match?.homeTeam?.name || match?.home_team?.name || 'Player 1';
                const p2 = match?.awayTeam?.name || match?.away_team?.name || 'Player 2';
                return res.json({
                    team1Name: p1,
                    team2Name: p2,
                    team1: [{ name: p1, role: 'Player', isCaptain: false }],
                    team2: [{ name: p2, role: 'Player', isCaptain: false }],
                    source: 'live-participants',
                });
            } catch (error) {
                // fall through to mock fallback
            }
        }
    } catch (error) {
        console.error('Squad lookup failed:', error.message);
    }

    if (mockSquads[sport]) {
        let squadPayload = JSON.parse(JSON.stringify(mockSquads[sport]));
        
        // Dynamically replace Team names based on Real Match
        if (matchId) {
            let foundMatch = null;
            if (sport === 'cricket') foundMatch = mockCricketMatches.find(m => m.id === matchId);
            if (sport === 'football') foundMatch = mockFootballMatches.find(m => m.id === matchId);
            if (sport === 'tennis') foundMatch = mockTennisMatches.find(m => m.id === matchId);

            if (foundMatch) {
                if (sport === 'cricket') {
                    squadPayload.team1Name = foundMatch.teamInfo?.[0]?.shortname || foundMatch.teams?.[0] || squadPayload.team1Name;
                    squadPayload.team2Name = foundMatch.teamInfo?.[1]?.shortname || foundMatch.teams?.[1] || squadPayload.team2Name;
                } else if (sport === 'football') {
                    squadPayload.team1Name = foundMatch.homeTeam?.name || squadPayload.team1Name;
                    squadPayload.team2Name = foundMatch.awayTeam?.name || squadPayload.team2Name;
                } else if (sport === 'tennis') {
                    const players = foundMatch.name?.split(' vs ');
                    if (players && players.length === 2) {
                        squadPayload.team1Name = players[0];
                        squadPayload.team2Name = players[1];
                    }
                }
            }
        }
        
        return res.json(squadPayload);
    }
    return res.json({ team1Name: 'Team A', team2Name: 'Team B', team1: [], team2: [] });
});

router.get('/series-stats/:sport', async (req, res) => {
    const { sport } = req.params;
    const { mockSeriesStats } = require('../services/mockData');
    
    try {
        if (sport === 'football') {
            const footballApi = require('../services/footballApiService');
            const topScorers = await footballApi.getTopScorers(39, new Date().getFullYear() - 1);
            if (topScorers && topScorers.length > 0) {
                const mostRuns = topScorers.map(t => ({ name: t.player.name, stat: t.statistics[0].goals.total })).slice(0, 5);
                const mostWickets = topScorers.map(t => ({ name: t.player.name, stat: t.statistics[0].goals.assists || 0 })).slice(0, 5);
                return res.json({ seriesName: 'Premier League', mostRuns, mostWickets });
            }
        } else if (sport === 'cricket') {
            const cricketApi = require('../services/cricketApiService');
            const seriesList = await cricketApi.getSeriesList();
            if (seriesList && seriesList.length > 0) {
                const topSeries = seriesList[0];
                return res.json({ 
                    seriesName: topSeries.name,
                    mostRuns: mockSeriesStats.cricket.mostRuns, 
                    mostWickets: mockSeriesStats.cricket.mostWickets 
                });
            }
        }
    } catch (e) {
        console.error("Error fetching live series stats:", e.message);
    }
    
    if (process.env.USE_MOCK_FALLBACK === 'true' && mockSeriesStats[sport]) {
        return res.json(mockSeriesStats[sport]);
    }
    return res.json({ seriesName: 'Tournament Name', mostRuns: [], mostWickets: [] });
});

router.get('/', (req, res) => {
    const q = (req.query.q || '').toLowerCase();
    if (!q) return res.json([]);

    const results = [];

    SEARCH_ENTITIES.forEach((entity) => {
        if (entity.name.toLowerCase().includes(q)) {
            results.push({
                sport: entity.sport,
                type: entity.type,
                name: entity.name,
                subtitle: `${entity.sport} ${entity.type}`,
                link: entity.type === 'Player' ? '/compare' : '/compare',
            });
        }
    });

    // Search Cricket
    mockCricketMatches.forEach(m => {
        if (m.name.toLowerCase().includes(q) || m.teams.some(t => t.toLowerCase().includes(q))) {
            results.push({ sport: 'cricket', type: 'Match', name: m.name, subtitle: m.status, link: `/match/${m.id}?sport=cricket` });
        }
    });
    mockCricketSeries.forEach(s => {
        if (s.name.toLowerCase().includes(q)) {
            results.push({ sport: 'cricket', type: 'Series', name: s.name, subtitle: `${s.matches} matches`, link: `/cricket` });
        }
    });

    // Search Football
    mockFootballMatches.forEach(m => {
        const title = `${m.homeTeam.name} vs ${m.awayTeam.name}`;
        if (title.toLowerCase().includes(q) || m.league.toLowerCase().includes(q)) {
            results.push({ sport: 'football', type: 'Match', name: title, subtitle: m.league, link: `/match/${m.id}?sport=football` });
        }
    });

    // Search Tennis
    mockTennisMatches.forEach(m => {
        if (m.name.toLowerCase().includes(q) || m.tournament.toLowerCase().includes(q)) {
            results.push({ sport: 'tennis', type: 'Match', name: m.name, subtitle: m.tournament, link: `/match/${m.id}?sport=tennis` });
        }
    });

    const unique = results.filter((item, index, arr) =>
        arr.findIndex((entry) => entry.sport === item.sport && entry.type === item.type && entry.name === item.name) === index
    );

    res.json(unique.slice(0, 12));
});

module.exports = router;
