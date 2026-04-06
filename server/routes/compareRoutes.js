const express = require('express');
const router = express.Router();
const {
    mockPlayerCricket,
    mockPlayerFootball,
    mockPlayerTennis,
} = require('../services/mockData');

const SPORT_LABELS = {
    cricket: ['Batting', 'Bowling', 'Fielding', 'Consistency', 'Impact'],
    football: ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending'],
    tennis: ['Serve', 'Power', 'Speed', 'Stamina', 'Mental'],
};

const PRESET_ENTITIES = {
    cricket: {
        'virat kohli': {
            name: 'Virat Kohli',
            type: 'Player',
            radar: { labels: SPORT_LABELS.cricket, data: [98, 32, 88, 95, 97] },
            stats: { Matches: 550, Runs: 26700, Average: 53.2, Hundreds: 80, 'Recent Form': 'Elite' },
            insight: 'Elite chase control and consistency across formats.',
        },
        'jasprit bumrah': {
            name: 'Jasprit Bumrah',
            type: 'Player',
            radar: { labels: SPORT_LABELS.cricket, data: [28, 99, 84, 94, 96] },
            stats: { Matches: 230, Wickets: 395, Economy: 4.8, Average: 22.4, 'Recent Form': 'Elite' },
            insight: 'Outstanding death bowling and pressure overs impact.',
        },
        india: {
            name: 'India',
            type: 'Team',
            radar: { labels: SPORT_LABELS.cricket, data: [94, 86, 88, 91, 93] },
            stats: { Matches: 1050, Wins: 560, Losses: 430, Titles: 9, WinRate: '53.3%' },
            insight: 'Deep batting and strong spin-bowling balance.',
        },
        australia: {
            name: 'Australia',
            type: 'Team',
            radar: { labels: SPORT_LABELS.cricket, data: [92, 90, 86, 93, 95] },
            stats: { Matches: 980, Wins: 590, Losses: 340, Titles: 12, WinRate: '60.2%' },
            insight: 'Big-match pedigree and stronger historical conversion rate.',
        },
    },
    football: {
        'lionel messi': {
            name: 'Lionel Messi',
            type: 'Player',
            radar: { labels: SPORT_LABELS.football, data: [84, 95, 96, 98, 36] },
            stats: { Goals: 850, Assists: 380, Matches: 1080, ChancesCreated: 520, 'Recent Form': 'Elite' },
            insight: 'Best-in-class chance creation and final-third decision making.',
        },
        'cristiano ronaldo': {
            name: 'Cristiano Ronaldo',
            type: 'Player',
            radar: { labels: SPORT_LABELS.football, data: [83, 97, 84, 88, 40] },
            stats: { Goals: 890, Assists: 255, Matches: 1210, Shots: 2300, 'Recent Form': 'Strong' },
            insight: 'Relentless finishing output and aerial threat.',
        },
        'manchester united': {
            name: 'Manchester United',
            type: 'Team',
            radar: { labels: SPORT_LABELS.football, data: [79, 83, 80, 76, 72] },
            stats: { Matches: 450, Wins: 210, Goals: 680, Conceded: 480, Titles: 20 },
            insight: 'Transition threat remains their biggest edge.',
        },
        liverpool: {
            name: 'Liverpool',
            type: 'Team',
            radar: { labels: SPORT_LABELS.football, data: [86, 88, 85, 84, 78] },
            stats: { Matches: 450, Wins: 240, Goals: 750, Conceded: 420, Titles: 19 },
            insight: 'Higher pressing intensity and attacking volume.',
        },
        barcelona: {
            name: 'Barcelona',
            type: 'Team',
            radar: { labels: SPORT_LABELS.football, data: [82, 85, 92, 88, 76] },
            stats: { Matches: 450, Wins: 248, Goals: 765, Conceded: 410, Titles: 27 },
            insight: 'Superior ball retention and central progression.',
        },
        'real madrid': {
            name: 'Real Madrid',
            type: 'Team',
            radar: { labels: SPORT_LABELS.football, data: [84, 90, 87, 86, 79] },
            stats: { Matches: 450, Wins: 255, Goals: 790, Conceded: 405, Titles: 36 },
            insight: 'Clinical in big moments and better finishing ceiling.',
        },
    },
    tennis: {
        'carlos alcaraz': {
            name: 'Carlos Alcaraz',
            type: 'Player',
            radar: { labels: SPORT_LABELS.tennis, data: [92, 94, 96, 89, 91] },
            stats: { Ranking: 2, Titles: 17, Aces: 430, WinRate: '82.9%', GrandSlams: 4 },
            insight: 'Explosive court coverage and all-surface upside.',
        },
        'jannik sinner': {
            name: 'Jannik Sinner',
            type: 'Player',
            radar: { labels: SPORT_LABELS.tennis, data: [90, 95, 92, 88, 92] },
            stats: { Ranking: 1, Titles: 18, Aces: 510, WinRate: '84.1%', GrandSlams: 3 },
            insight: 'Cleaner baseline hitting and improved serve protection.',
        },
        'novak djokovic': {
            name: 'Novak Djokovic',
            type: 'Player',
            radar: { labels: SPORT_LABELS.tennis, data: [91, 89, 88, 87, 99] },
            stats: { Ranking: 5, Titles: 99, Aces: 7600, WinRate: '83.4%', GrandSlams: 24 },
            insight: 'Best mental resilience and return quality of the era.',
        },
        'iga swiatek': {
            name: 'Iga Swiatek',
            type: 'Player',
            radar: { labels: SPORT_LABELS.tennis, data: [83, 94, 90, 88, 95] },
            stats: { Ranking: 1, Titles: 23, Aces: 210, WinRate: '81.6%', GrandSlams: 5 },
            insight: 'Heavy topspin and elite rally tolerance.',
        },
    },
};

const lookupEntity = (nameParam, sport) => {
    const n = nameParam.toLowerCase();
    const preset = PRESET_ENTITIES[sport]?.[n];
    if (preset) {
        return preset;
    }

    if (sport === 'cricket' && mockPlayerCricket.name.toLowerCase() === n) {
        return {
            name: mockPlayerCricket.name,
            type: 'Player',
            radar: { labels: SPORT_LABELS.cricket, data: [98, 32, 88, 95, 97] },
            stats: {
                Matches: mockPlayerCricket.stats.matches,
                Runs: mockPlayerCricket.stats.runs,
                Average: mockPlayerCricket.stats.average,
                StrikeRate: mockPlayerCricket.stats.strikeRate,
                Hundreds: mockPlayerCricket.stats.hundreds,
            },
            insight: 'Elite batter with sustained output in run chases.',
        };
    }

    if (sport === 'football' && mockPlayerFootball.name.toLowerCase() === n) {
        const stat = mockPlayerFootball.statistics[0];
        return {
            name: mockPlayerFootball.name,
            type: 'Player',
            radar: { labels: SPORT_LABELS.football, data: [84, 95, 96, 98, 36] },
            stats: {
                Matches: stat.games.appearences,
                Goals: stat.goals.total,
                Assists: stat.goals.assists,
                PassAccuracy: `${stat.passes.accuracy}%`,
                Rating: stat.games.rating,
            },
            insight: 'Elite final-third creativity and carrying ability.',
        };
    }

    if (sport === 'tennis' && mockPlayerTennis.name.toLowerCase() === n) {
        return {
            name: mockPlayerTennis.name,
            type: 'Player',
            radar: { labels: SPORT_LABELS.tennis, data: [92, 94, 96, 89, 91] },
            stats: {
                Ranking: mockPlayerTennis.ranking,
                Titles: mockPlayerTennis.titles,
                GrandSlams: mockPlayerTennis.grandSlams,
                Aces: mockPlayerTennis.aces,
                WinRate: `${mockPlayerTennis.winPercentage}%`,
            },
            insight: 'Explosive all-court game with elite transition speed.',
        };
    }

    const seededData = [
        70 + (n.length * 2) % 25,
        75 + (n.charCodeAt(0) % 20),
        80 + ((n.charCodeAt(1) || 0) % 15),
        70 + ((n.charCodeAt(2) || 0) % 20),
        72 + ((n.charCodeAt(3) || 0) % 18),
    ];

    return {
        name: nameParam,
        type: 'Entity',
        radar: {
            labels: SPORT_LABELS[sport],
            data: seededData,
        },
        stats: {
            Matches: 40 + n.length * 4,
            ImpactScore: `${68 + (n.charCodeAt(0) % 25)}%`,
            RecentForm: 'Good',
            Consistency: `${70 + (n.charCodeAt(1) % 20)}%`,
            PeakRating: 7.5 + ((n.charCodeAt(2) || 0) % 20) / 10,
        },
        insight: `Generated comparison profile for ${nameParam} using local fallback metrics.`,
    };
};

router.get('/:sport', async (req, res) => {
    const { sport } = req.params;
    const { e1, e2 } = req.query;

    if (!e1 || !e2) {
        return res.status(400).json({ message: 'Both comparison entities are required.' });
    }

    const entity1Result = lookupEntity(e1, sport);
    const entity2Result = lookupEntity(e2, sport);

    const mockH2H = {
        total: 12 + ((e1.length + e2.length) % 8),
        e1Wins: 5 + (e1.length % 5),
        e2Wins: 4 + (e2.length % 5),
        draws: sport === 'football' ? 2 : 0
    };

    res.json({
        sport,
        e1: entity1Result,
        e2: entity2Result,
        h2h: entity1Result.type === 'Player' && entity2Result.type === 'Player' && sport === 'tennis' ? null : mockH2H,
        summary: `${entity1Result.name} vs ${entity2Result.name} highlights differences in ${SPORT_LABELS[sport][0].toLowerCase()}, ${SPORT_LABELS[sport][1].toLowerCase()}, and overall impact.`,
    });
});

module.exports = router;
