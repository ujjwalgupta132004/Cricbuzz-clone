const express = require('express');
const router = express.Router();
const { mockStandings } = require('../services/mockData');
const footballApi = require('../services/footballApiService');
const tennisApi = require('../services/tennisApiService');

const COMPETITIONS = {
    cricket: {
        ipl: { id: 'ipl', label: 'IPL', source: 'mock' },
        odi: { id: 'odi', label: 'ICC ODI Rankings', source: 'mock' },
        test: { id: 'test', label: 'ICC Test Rankings', source: 'mock' },
        t20: { id: 't20', label: 'ICC T20 Rankings', source: 'mock' },
    },
    football: {
        epl: { id: 'epl', label: 'Premier League', leagueId: 39, source: 'api' },
        laliga: { id: 'laliga', label: 'La Liga', leagueId: 140, source: 'api' },
        ucl: { id: 'ucl', label: 'UEFA Champions League', leagueId: 2, source: 'api' },
    },
    tennis: {
        atp: { id: 'atp', label: 'ATP Rankings', source: 'mock' },
        wta: { id: 'wta', label: 'WTA Rankings', source: 'mock' },
    },
};

const CRICKET_TABLES = {
    ipl: mockStandings.cricket,
    odi: [
        { rank: 1, team: 'India', pld: 42, w: 29, l: 11, nrr: '+1.22', pts: 126 },
        { rank: 2, team: 'Australia', pld: 38, w: 25, l: 11, nrr: '+0.95', pts: 119 },
        { rank: 3, team: 'South Africa', pld: 31, w: 19, l: 10, nrr: '+0.41', pts: 97 },
        { rank: 4, team: 'Pakistan', pld: 30, w: 17, l: 11, nrr: '+0.12', pts: 88 },
    ],
    test: [
        { rank: 1, team: 'Australia', pld: 19, w: 12, l: 4, nrr: '+1.04', pts: 144 },
        { rank: 2, team: 'India', pld: 20, w: 11, l: 5, nrr: '+0.88', pts: 132 },
        { rank: 3, team: 'England', pld: 21, w: 10, l: 8, nrr: '+0.23', pts: 118 },
        { rank: 4, team: 'South Africa', pld: 16, w: 8, l: 5, nrr: '+0.14', pts: 96 },
    ],
    t20: [
        { rank: 1, team: 'India', pld: 36, w: 29, l: 6, nrr: '+1.65', pts: 128 },
        { rank: 2, team: 'England', pld: 32, w: 23, l: 8, nrr: '+1.11', pts: 112 },
        { rank: 3, team: 'Australia', pld: 34, w: 23, l: 10, nrr: '+0.98', pts: 109 },
        { rank: 4, team: 'West Indies', pld: 30, w: 18, l: 10, nrr: '+0.52', pts: 94 },
    ],
};

const TENNIS_TABLES = {
    atp: mockStandings.tennis,
    wta: [
        { rank: 1, player: 'Iga Swiatek', points: 10485, tournaments: 18 },
        { rank: 2, player: 'Aryna Sabalenka', points: 8890, tournaments: 18 },
        { rank: 3, player: 'Coco Gauff', points: 7140, tournaments: 19 },
        { rank: 4, player: 'Elena Rybakina', points: 6045, tournaments: 17 },
        { rank: 5, player: 'Jessica Pegula', points: 5135, tournaments: 18 },
    ],
};

router.get('/:sport', async (req, res) => {
    const { sport } = req.params;
    const competitionMap = COMPETITIONS[sport];

    if (!competitionMap) {
        return res.status(404).json({ message: `No standings format known for ${sport}` });
    }

    const requestedCompetition = req.query.competition || Object.keys(competitionMap)[0];
    const selectedCompetition = competitionMap[requestedCompetition] || Object.values(competitionMap)[0];

    try {
        if (sport === 'football' && process.env.FOOTBALL_API_KEY) {
            const standingsData = await footballApi.getStandings(
                selectedCompetition.leagueId,
                Number(req.query.season) || new Date().getFullYear()
            );

            if (standingsData && standingsData.length > 0) {
                const tableInfo = standingsData[0].league.standings[0].map(team => ({
                    rank: team.rank,
                    team: team.team.name,
                    pld: team.all.played,
                    w: team.all.win,
                    d: team.all.draw,
                    l: team.all.lose,
                    gf: team.all.goals.for,
                    ga: team.all.goals.against,
                    gd: team.goalsDiff > 0 ? `+${team.goalsDiff}` : `${team.goalsDiff}`,
                    pts: team.points
                }));

                return res.json({
                    sport,
                    competition: selectedCompetition.id,
                    label: standingsData[0].league.name,
                    table: tableInfo,
                    competitions: Object.values(competitionMap),
                    source: 'api-football',
                    updatedAt: new Date().toISOString(),
                });
            }
        }

        if (sport === 'cricket') {
            return res.json({
                sport,
                competition: selectedCompetition.id,
                label: selectedCompetition.label,
                table: CRICKET_TABLES[selectedCompetition.id] || CRICKET_TABLES.ipl,
                competitions: Object.values(competitionMap),
                source: 'mock',
                updatedAt: new Date().toISOString(),
            });
        }

        if (sport === 'tennis') {
            if (process.env.TENNIS_API_KEY) {
                try {
                    const rankings = await tennisApi.getRankings(selectedCompetition.id);
                    const table = (rankings || []).slice(0, 20).map((player, index) => ({
                        rank: player.ranking || player.rank || index + 1,
                        player: player.name || player.player?.name || player.team?.name || 'Unknown Player',
                        tournaments: player.tournaments || player.played || player.events || '-',
                        points: player.points || player.rating || 0,
                    }));

                    if (table.length > 0) {
                        return res.json({
                            sport,
                            competition: selectedCompetition.id,
                            label: selectedCompetition.label,
                            table,
                            competitions: Object.values(competitionMap),
                            source: 'api-tennis',
                            updatedAt: new Date().toISOString(),
                        });
                    }
                } catch (error) {
                    console.error('Tennis standings fallback used:', error.message);
                }
            }

            return res.json({
                sport,
                competition: selectedCompetition.id,
                label: selectedCompetition.label,
                table: TENNIS_TABLES[selectedCompetition.id] || TENNIS_TABLES.atp,
                competitions: Object.values(competitionMap),
                source: 'mock',
                updatedAt: new Date().toISOString(),
            });
        }

        return res.json({
            sport,
            competition: selectedCompetition.id,
            label: selectedCompetition.label,
            table: mockStandings[sport] || [],
            competitions: Object.values(competitionMap),
            source: 'mock',
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Standings fallback used:', error.message);

        if (sport === 'football') {
            return res.json({
                sport,
                competition: selectedCompetition.id,
                label: selectedCompetition.label,
                table: mockStandings.football || [],
                competitions: Object.values(competitionMap),
                source: 'mock',
                updatedAt: new Date().toISOString(),
            });
        }

        return res.status(500).json({ message: 'Unable to fetch standings', error: error.message });
    }
});

module.exports = router;
