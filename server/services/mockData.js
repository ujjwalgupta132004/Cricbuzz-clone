const mockCricketMatches = [
    {
        id: 'mock_c1',
        name: 'India vs Australia',
        matchType: 'odi',
        status: 'India needs 42 runs in 24 balls',
        venue: 'Narendra Modi Stadium, Ahmedabad',
        date: new Date().toISOString(),
        dateTimeGMT: new Date().toISOString(),
        teams: ['India', 'Australia'],
        teamInfo: [
            { name: 'India', shortname: 'IND', img: 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg' },
            { name: 'Australia', shortname: 'AUS', img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Flag_of_Australia_%28converted%29.svg' }
        ],
        score: [
            { r: 285, w: 4, o: 46.0, inning: 'India Inning' },
            { r: 326, w: 8, o: 50.0, inning: 'Australia Inning' }
        ],
        scorecard: [
            {
                inning: 'Australia Inning',
                batting: [
                    { name: 'D Warner', r: 52, b: 58, 4: 6, 6: 1, sr: 89.6, dismissal: 'c Kohli b Bumrah' },
                    { name: 'T Head', r: 137, b: 120, 4: 15, 6: 4, sr: 114.1, dismissal: 'c Gill b Siraj' },
                    { name: 'S Smith', r: 4, b: 9, 4: 1, 6: 0, sr: 44.4, dismissal: 'lbw b Bumrah' }
                ],
                bowling: [
                    { name: 'J Bumrah', o: 10, m: 1, r: 43, w: 2, eco: 4.30 },
                    { name: 'M Siraj', o: 10, m: 0, r: 45, w: 1, eco: 4.50 },
                    { name: 'R Jadeja', o: 10, m: 0, r: 43, w: 0, eco: 4.30 }
                ]
            },
            {
                inning: 'India Inning',
                batting: [
                    { name: 'R Sharma', r: 47, b: 31, 4: 4, 6: 3, sr: 151.6, dismissal: 'c Head b Maxwell' },
                    { name: 'S Gill', r: 4, b: 7, 4: 0, 6: 0, sr: 57.1, dismissal: 'c Zampa b Starc' },
                    { name: 'V Kohli', r: 54, b: 63, 4: 4, 6: 0, sr: 85.7, dismissal: 'b Cummins' },
                    { name: 'KL Rahul', r: 66, b: 107, 4: 1, 6: 0, sr: 61.6, dismissal: 'not out' }
                ],
                bowling: [
                    { name: 'M Starc', o: 10, m: 0, r: 55, w: 3, eco: 5.50 },
                    { name: 'P Cummins', o: 10, m: 0, r: 34, w: 2, eco: 3.40 },
                    { name: 'J Hazlewood', o: 10, m: 0, r: 40, w: 2, eco: 4.00 }
                ]
            }
        ],
        matchStarted: true,
        matchEnded: false,
        fantasyEnabled: true,
        bbbEnabled: false,
        hasSquad: true,
        series_id: 'mock_s1'
    },
    {
        id: 'mock_c2',
        name: 'England vs South Africa',
        matchType: 'test',
        status: 'Day 2 - Session 1',
        venue: "Lord's, London",
        date: new Date(Date.now() + 86400000).toISOString(),
        dateTimeGMT: new Date(Date.now() + 86400000).toISOString(),
        teams: ['England', 'South Africa'],
        teamInfo: [
            { name: 'England', shortname: 'ENG', img: 'https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg' },
            { name: 'South Africa', shortname: 'SA', img: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg' }
        ],
        score: [],
        matchStarted: false,
        matchEnded: false
    },
    {
        id: 'mock_c3',
        name: 'Surrey vs Middlesex',
        matchType: 't20',
        status: 'Surrey chose to bat',
        venue: 'The Oval, London',
        date: new Date().toISOString(),
        dateTimeGMT: new Date().toISOString(),
        teams: ['Surrey', 'Middlesex'],
        teamInfo: [
            { name: 'Surrey', shortname: 'SUR', img: '' },
            { name: 'Middlesex', shortname: 'MID', img: '' }
        ],
        score: [
            { r: 145, w: 2, o: 15.3, inning: 'Surrey Inning' }
        ],
        matchStarted: true,
        matchEnded: false,
        series_id: 'mock_s2'
    },
    {
        id: 'mock_c4',
        name: 'Pakistan vs New Zealand',
        matchType: 'odi',
        status: 'Pakistan won by 5 wickets',
        venue: 'Rawalpindi Cricket Stadium',
        date: new Date(Date.now() - 86400000).toISOString(),
        dateTimeGMT: new Date(Date.now() - 86400000).toISOString(),
        teams: ['Pakistan', 'New Zealand'],
        teamInfo: [
            { name: 'Pakistan', shortname: 'PAK', img: '' },
            { name: 'New Zealand', shortname: 'NZ', img: '' }
        ],
        score: [
            { r: 280, w: 5, o: 48.2, inning: 'Pakistan Inning' },
            { r: 275, w: 10, o: 50.0, inning: 'New Zealand Inning' }
        ],
        matchStarted: true,
        matchEnded: true
    },
    {
        id: 'mock_c5',
        name: 'West Indies vs Sri Lanka',
        matchType: 't20',
        status: 'Match starts at 7:00 PM IST',
        venue: 'Kensington Oval, Barbados',
        date: new Date(Date.now() + 172800000).toISOString(),
        dateTimeGMT: new Date(Date.now() + 172800000).toISOString(),
        teams: ['West Indies', 'Sri Lanka'],
        teamInfo: [
            { name: 'West Indies', shortname: 'WI', img: '' },
            { name: 'Sri Lanka', shortname: 'SL', img: '' }
        ],
        score: [],
        matchStarted: false,
        matchEnded: false
    }
];

const mockFootballMatches = [
    {
        id: 'mock_f1',
        sport: 'football',
        name: 'Manchester United vs Liverpool',
        status: '65\'',
        isLive: true,
        isFinished: false,
        score: '2 - 1',
        homeTeam: { name: 'Manchester United', logo: '' },
        awayTeam: { name: 'Liverpool', logo: '' },
        league: 'Premier League',
        date: new Date().toISOString(),
        venue: 'Old Trafford'
    },
    {
        id: 'mock_f2',
        sport: 'football',
        name: 'Barcelona vs Real Madrid',
        status: 'HT',
        isLive: true,
        isFinished: false,
        score: '1 - 1',
        homeTeam: { name: 'Barcelona', logo: '' },
        awayTeam: { name: 'Real Madrid', logo: '' },
        league: 'La Liga',
        date: new Date().toISOString(),
        venue: 'Camp Nou'
    },
    {
        id: 'mock_f3',
        sport: 'football',
        name: 'Arsenal vs Chelsea',
        status: 'FT',
        isLive: false,
        isFinished: true,
        score: '3 - 1',
        homeTeam: { name: 'Arsenal', logo: '' },
        awayTeam: { name: 'Chelsea', logo: '' },
        league: 'Premier League',
        date: new Date(Date.now() - 86400000).toISOString(),
        venue: 'Emirates Stadium'
    },
    {
        id: 'mock_f4',
        sport: 'football',
        name: 'Bayern Munich vs Borussia Dortmund',
        status: 'Tomorrow, 8:30 PM',
        isLive: false,
        isFinished: false,
        score: 'v',
        homeTeam: { name: 'Bayern Munich', logo: '' },
        awayTeam: { name: 'Borussia Dortmund', logo: '' },
        league: 'Bundesliga',
        date: new Date(Date.now() + 86400000).toISOString(),
        venue: 'Allianz Arena'
    }
];

const mockTennisMatches = [
    {
        id: 'mock_t1',
        sport: 'tennis',
        name: 'C. Alcaraz vs J. Sinner',
        status: 'Set 2',
        isLive: true,
        isFinished: false,
        score: '6-4, 3-2',
        tournament: 'Roland Garros',
        round: 'Semi Final',
        date: new Date().toISOString()
    },
    {
        id: 'mock_t2',
        sport: 'tennis',
        name: 'I. Swiatek vs A. Sabalenka',
        status: 'FT',
        isLive: false,
        isFinished: true,
        score: '6-3, 7-5',
        tournament: 'Australian Open',
        round: 'Final',
        date: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'mock_t3',
        sport: 'tennis',
        name: 'N. Djokovic vs D. Medvedev',
        status: 'Tomorrow, 3:00 PM',
        isLive: false,
        isFinished: false,
        score: 'v',
        tournament: 'Wimbledon',
        round: 'Quarter Final',
        date: new Date(Date.now() + 86400000).toISOString()
    }
];

const mockNews = [
    {
        id: 'n1',
        sport: 'cricket',
        title: 'Bumrah cleared for upcoming tour after fitness test',
        summary: 'Indian pacer Jasprit Bumrah has been given the green light for the upcoming tour after passing his fitness test with flying colors.',
        image: '',
        timestamp: '2 hours ago',
        source: 'SportsBuzz'
    },
    {
        id: 'n2',
        sport: 'football',
        title: 'Transfer Window: Top 5 deals to watch',
        summary: 'The summer transfer window is heating up with several big-name moves on the cards.',
        image: '',
        timestamp: '4 hours ago',
        source: 'SportsBuzz'
    },
    {
        id: 'n3',
        sport: 'tennis',
        title: 'Alcaraz targets calendar Grand Slam',
        summary: 'World No.1 Carlos Alcaraz has set his sights on achieving the calendar Grand Slam this season.',
        image: '',
        timestamp: '6 hours ago',
        source: 'SportsBuzz'
    },
    {
        id: 'n4',
        sport: 'cricket',
        title: 'IPL 2026: Complete schedule announced',
        summary: 'The BCCI has released the full schedule for IPL 2026, with the tournament set to begin in late March.',
        image: '',
        timestamp: '8 hours ago',
        source: 'SportsBuzz'
    }
];

const mockCricketSeries = [
    { id: 's1', name: 'ICC World Cup 2026', startDate: '2026-10-05', endDate: '2026-11-19', odi: 48, t20: 0, test: 0 },
    { id: 's2', name: 'Indian Premier League 2026', startDate: '2026-03-22', endDate: '2026-05-26', odi: 0, t20: 74, test: 0 },
    { id: 's3', name: 'The Ashes 2026-27', startDate: '2026-11-23', endDate: '2027-01-18', odi: 0, t20: 0, test: 5 },
    { id: 's4', name: 'T20 Blast 2026', startDate: '2026-05-30', endDate: '2026-07-15', odi: 0, t20: 133, test: 0 },
];

const mockPlayerCricket = {
    id: 'p1',
    name: 'Virat Kohli',
    country: 'India',
    playerImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg/220px-Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg',
    role: 'Batsman',
    battingStyle: 'Right Handed Bat',
    bowlingStyle: 'Right-arm Medium',
    stats: {
        matches: 275,
        runs: 13848,
        wickets: 4,
        average: 53.4,
        strikeRate: 93.2,
        hundreds: 50,
        fifties: 72,
        bestScore: '254*'
    },
    recentForm: [82, 12, 45, 0, 113, 34, 67, 8],
    careerByYear: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        runs: [1202, 1377, 842, 596, 817, 1003, 1187, 963],
        average: [68.5, 55.1, 46.8, 35.1, 45.4, 55.7, 59.4, 53.5]
    }
};

const mockPlayerFootball = {
    id: 'pf1',
    name: 'Lionel Messi',
    nationality: 'Argentina',
    playerImg: '',
    position: 'Forward',
    age: 38,
    statistics: [{
        games: { appearences: 34, rating: '8.12' },
        goals: { total: 23, assists: 13 },
        passes: { total: 1840, accuracy: 87 },
        shots: { total: 102, on: 58 },
        dribbles: { attempts: 186, success: 134 }
    }],
    recentForm: [2, 0, 1, 1, 0, 3, 1, 0],
    careerByYear: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        goals: [51, 50, 38, 43, 18, 32, 23, 15],
        assists: [20, 22, 14, 17, 12, 16, 13, 8]
    }
};

const mockPlayerTennis = {
    id: 'pt1',
    name: 'Carlos Alcaraz',
    nationality: 'Spain',
    playerImg: '',
    ranking: 1,
    wins: 204,
    losses: 42,
    titles: 16,
    grandSlams: 4,
    aces: 412,
    doubleFaults: 198,
    winPercentage: 82.9,
    surfaceStats: {
        hard: { wins: 98, losses: 22 },
        clay: { wins: 68, losses: 10 },
        grass: { wins: 38, losses: 10 }
    },
    recentForm: [1, 1, 1, 0, 1, 1, 0, 1],
    careerByYear: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        wins: [12, 38, 57, 58, 54, 42],
        titles: [0, 1, 5, 4, 4, 2]
    }
};

const mockTeamComparison = {
    cricket: {
        team1: {
            name: 'India', shortname: 'IND',
            stats: { matches: 1050, wins: 560, losses: 430, draws: 60, winRate: 53.3,
                     runs: 295000, wickets: 25000, highest: '418/5', lowest: '36' }
        },
        team2: {
            name: 'Australia', shortname: 'AUS',
            stats: { matches: 980, wins: 590, losses: 340, draws: 50, winRate: 60.2,
                     runs: 280000, wickets: 24000, highest: '434/4', lowest: '47' }
        },
        headToHead: { total: 142, team1Wins: 55, team2Wins: 79, draws: 8 }
    },
    football: {
        team1: {
            name: 'Man United', shortname: 'MUN',
            stats: { matches: 450, wins: 210, losses: 120, draws: 120, winRate: 46.7,
                     goals: 680, conceded: 480, cleanSheets: 130, titles: 20 }
        },
        team2: {
            name: 'Liverpool', shortname: 'LIV',
            stats: { matches: 450, wins: 240, losses: 100, draws: 110, winRate: 53.3,
                     goals: 750, conceded: 420, cleanSheets: 150, titles: 19 }
        },
        headToHead: { total: 210, team1Wins: 81, team2Wins: 69, draws: 60 }
    },
    tennis: {
        player1: {
            name: 'Alcaraz', 
            stats: { matches: 246, wins: 204, losses: 42, titles: 16, grandSlams: 4,
                     aces: 412, winRate: 82.9, hardWin: 81, clayWin: 87, grassWin: 79 }
        },
        player2: {
            name: 'Sinner',
            stats: { matches: 258, wins: 198, losses: 60, titles: 14, grandSlams: 2,
                     aces: 380, winRate: 76.7, hardWin: 80, clayWin: 72, grassWin: 70 }
        },
        headToHead: { total: 10, player1Wins: 5, player2Wins: 5 }
    }
};

const mockStandings = {
    cricket: [
        { rank: 1, team: 'Chennai Super Kings', pld: 14, w: 10, l: 4, nrr: '+0.652', pts: 20 },
        { rank: 2, team: 'Mumbai Indians', pld: 14, w: 9, l: 5, nrr: '+0.501', pts: 18 },
        { rank: 3, team: 'Royal Challengers', pld: 14, w: 8, l: 6, nrr: '+0.115', pts: 16 },
        { rank: 4, team: 'Kolkata Knight Riders', pld: 14, w: 7, l: 7, nrr: '+0.239', pts: 14 },
        { rank: 5, team: 'Gujarat Titans', pld: 14, w: 7, l: 7, nrr: '-0.320', pts: 14 },
        { rank: 6, team: 'Rajasthan Royals', pld: 14, w: 6, l: 8, nrr: '-0.148', pts: 12 },
    ],
    football: [
        { rank: 1, team: 'Arsenal', pld: 32, w: 23, d: 5, l: 4, gf: 75, ga: 26, gd: '+49', pts: 74 },
        { rank: 2, team: 'Manchester City', pld: 31, w: 22, d: 7, l: 2, gf: 76, ga: 31, gd: '+45', pts: 73 },
        { rank: 3, team: 'Liverpool', pld: 32, w: 21, d: 8, l: 3, gf: 72, ga: 30, gd: '+42', pts: 71 },
        { rank: 4, team: 'Aston Villa', pld: 33, w: 19, d: 6, l: 8, gf: 68, ga: 49, gd: '+19', pts: 63 },
        { rank: 5, team: 'Tottenham', pld: 32, w: 18, d: 6, l: 8, gf: 65, ga: 49, gd: '+16', pts: 60 },
        { rank: 6, team: 'Newcastle Utd', pld: 32, w: 15, d: 5, l: 12, gf: 69, ga: 52, gd: '+17', pts: 50 },
    ],
    tennis: [
        { rank: 1, player: 'Novak Djokovic', points: 9725, tournaments: 18 },
        { rank: 2, player: 'Jannik Sinner', points: 8710, tournaments: 17 },
        { rank: 3, player: 'Carlos Alcaraz', points: 8645, tournaments: 18 },
        { rank: 4, player: 'Daniil Medvedev', points: 7165, tournaments: 21 },
        { rank: 5, player: 'Alexander Zverev', points: 5415, tournaments: 26 },
        { rank: 6, player: 'Casper Ruud', points: 4020, tournaments: 23 },
    ]
};

const mockSquads = {
    cricket: {
        team1Name: 'PBKS',
        team2Name: 'GT',
        team1: [
            { name: 'Prabhsimran Singh', role: 'WK-Batter', isCaptain: false },
            { name: 'Shreyas Iyer', role: 'Batter', isCaptain: true },
            { name: 'Priyansh Arya', role: 'Batter', isCaptain: false },
            { name: 'Azmatullah Omarzai', role: 'Bowling Allrounder', isCaptain: false },
            { name: 'Marcus Stoinis', role: 'Batting Allrounder', isCaptain: false },
            { name: 'Shashank Singh', role: 'Batting Allrounder', isCaptain: false }
        ],
        team2: [
            { name: 'Shubman Gill', role: 'Batter', isCaptain: true },
            { name: 'Jos Buttler', role: 'WK-Batter', isCaptain: false },
            { name: 'Sai Sudharsan', role: 'Batter', isCaptain: false },
            { name: 'Glenn Phillips', role: 'WK-Batter', isCaptain: false },
            { name: 'Rahul Tewatia', role: 'Bowling Allrounder', isCaptain: false },
            { name: 'M Shahrukh Khan', role: 'Batter', isCaptain: false }
        ]
    },
    football: {
        team1Name: 'Arsenal',
        team2Name: 'Man City',
        team1: [
            { name: 'David Raya', role: 'Goalkeeper', isCaptain: false },
            { name: 'William Saliba', role: 'Defender', isCaptain: false },
            { name: 'Martin Odegaard', role: 'Midfielder', isCaptain: true },
            { name: 'Bukayo Saka', role: 'Forward', isCaptain: false }
        ],
        team2: [
            { name: 'Ederson', role: 'Goalkeeper', isCaptain: false },
            { name: 'Ruben Dias', role: 'Defender', isCaptain: false },
            { name: 'Kevin De Bruyne', role: 'Midfielder', isCaptain: true },
            { name: 'Erling Haaland', role: 'Forward', isCaptain: false }
        ]
    },
    tennis: {
        team1Name: 'Carlos Alcaraz',
        team2Name: 'Novak Djokovic',
        team1: [{ name: 'Carlos Alcaraz', role: 'Rank 3', isCaptain: false }],
        team2: [{ name: 'Novak Djokovic', role: 'Rank 1', isCaptain: false }]
    }
};

const mockSeriesStats = {
    cricket: {
        seriesName: 'Indian Premier League 2026',
        mostRuns: [
            { player: 'Ryan Rickelton', matches: 1, inns: 1, runs: 81, avg: 81.00, sr: 188.37, fours: 4, sixes: 8 },
            { player: 'Ishan Kishan', matches: 1, inns: 1, runs: 80, avg: 80.00, sr: 210.53, fours: 8, sixes: 5 },
            { player: 'Rohit Sharma', matches: 1, inns: 1, runs: 78, avg: 78.00, sr: 205.26, fours: 6, sixes: 6 },
            { player: 'Virat Kohli', matches: 1, inns: 1, runs: 69, avg: '-', sr: 181.58, fours: 5, sixes: 5 }
        ],
        highestScores: [
            { player: 'Ryan Rickelton', matches: 1, inns: 1, score: '81', sr: 188.37, fours: 4, sixes: 8 },
            { player: 'Ishan Kishan', matches: 1, inns: 1, score: '80', sr: 210.53, fours: 8, sixes: 5 },
            { player: 'Rohit Sharma', matches: 1, inns: 1, score: '78', sr: 205.26, fours: 6, sixes: 6 }
        ],
        bestBattingAvg: [
            { player: 'MS Dhoni', matches: 3, inns: 2, runs: 110, avg: 110.00, sr: 195.45 },
            { player: 'Ryan Rickelton', matches: 1, inns: 1, runs: 81, avg: 81.00, sr: 188.37 }
        ],
        bestBattingSR: [
            { player: 'Andre Russell', matches: 2, inns: 2, runs: 95, avg: 47.50, sr: 245.88 },
            { player: 'Ishan Kishan', matches: 1, inns: 1, runs: 80, avg: 80.00, sr: 210.53 }
        ],
        mostHundreds: [ { player: 'Jos Buttler', matches: 4, inns: 4, runs: 210, hundreds: 1, fifties: 1 } ],
        mostFifties: [
            { player: 'Ryan Rickelton', matches: 1, inns: 1, runs: 81, hundreds: 0, fifties: 1 },
            { player: 'Rohit Sharma', matches: 1, inns: 1, runs: 78, hundreds: 0, fifties: 1 }
        ],
        mostFours: [
            { player: 'Ishan Kishan', matches: 1, inns: 1, runs: 80, fours: 8 },
            { player: 'Rohit Sharma', matches: 1, inns: 1, runs: 78, fours: 6 }
        ],
        mostSixes: [
            { player: 'Ryan Rickelton', matches: 1, inns: 1, runs: 81, sixes: 8 },
            { player: 'Andre Russell', matches: 2, inns: 2, runs: 95, sixes: 7 },
            { player: 'Rohit Sharma', matches: 1, inns: 1, runs: 78, sixes: 6 }
        ],
        mostNineties: [ { player: 'Shubman Gill', matches: 3, inns: 3, runs: 180, nineties: 1 } ],
        mostWickets: [
            { player: 'Jasprit Bumrah', matches: 1, inns: 1, wkts: 4, avg: 6.50, econ: 6.50, bb: '4/26' },
            { player: 'Trent Boult', matches: 1, inns: 1, wkts: 3, avg: 7.33, econ: 5.50, bb: '3/22' },
            { player: 'Rashid Khan', matches: 1, inns: 1, wkts: 3, avg: 8.00, econ: 6.00, bb: '3/24' }
        ],
        bestBowlingAvg: [
            { player: 'Sunil Narine', matches: 2, inns: 2, wkts: 5, avg: 5.80, econ: 5.20, bb: '3/15' },
            { player: 'Jasprit Bumrah', matches: 1, inns: 1, wkts: 4, avg: 6.50, econ: 6.50, bb: '4/26' }
        ],
        bestBowling: [
            { player: 'Jasprit Bumrah', matches: 1, inns: 1, overs: 4.0, bb: '4/26', econ: 6.50 },
            { player: 'Trent Boult', matches: 1, inns: 1, overs: 4.0, bb: '3/22', econ: 5.50 }
        ],
        most5Wickets: [ { player: 'Kuldeep Yadav', matches: 3, inns: 3, wkts: 8, fiveW: 1 } ],
        bestEconomy: [
            { player: 'Sunil Narine', matches: 2, inns: 2, overs: 8.0, wkts: 5, econ: 5.20 },
            { player: 'Trent Boult', matches: 1, inns: 1, overs: 4.0, wkts: 3, econ: 5.50 }
        ],
        bestBowlingSR: [ { player: 'Jasprit Bumrah', matches: 1, inns: 1, overs: 4.0, wkts: 4, sr: 6.00 } ]
    },
    football: {
        seriesName: 'Premier League 2025/26',
        mostGoals: [
            { player: 'Erling Haaland', matches: 10, goals: 12, assists: 2, shots: 35 },
            { player: 'Mohamed Salah', matches: 10, goals: 8, assists: 4, shots: 28 },
            { player: 'Bukayo Saka', matches: 10, goals: 7, assists: 5, shots: 22 }
        ],
        mostAssists: [
            { player: 'Kevin De Bruyne', matches: 8, assists: 7, chances: 24, passes: 410 },
            { player: 'Martin Odegaard', matches: 10, assists: 6, chances: 21, passes: 530 }
        ],
        shotsOnTarget: [
            { player: 'Erling Haaland', matches: 10, shots: 35, onTarget: 22, goals: 12 },
            { player: 'Mohamed Salah', matches: 10, shots: 28, onTarget: 16, goals: 8 }
        ],
        cleanSheets: [
            { player: 'David Raya', matches: 10, cleanSheets: 6, saves: 24 },
            { player: 'Ederson', matches: 10, cleanSheets: 5, saves: 19 }
        ],
        mostTackles: [
            { player: 'Declan Rice', matches: 10, tackles: 34, tacklesWon: '78%' },
            { player: 'Rodri', matches: 9, tackles: 29, tacklesWon: '82%' }
        ],
        interceptions: [
            { player: 'William Saliba', matches: 10, interceptions: 22, clearances: 45 },
            { player: 'Virgil van Dijk', matches: 10, interceptions: 19, clearances: 52 }
        ],
        yellowCards: [
            { player: 'Joelinton', matches: 9, yellow: 5, fouls: 21 },
            { player: 'Bruno Fernandes', matches: 10, yellow: 4, fouls: 14 }
        ],
        redCards: [ { player: 'Cristian Romero', matches: 8, red: 1, fouls: 18 } ]
    },
    tennis: {
        seriesName: 'Wimbledon 2026',
        mostAces: [
            { player: 'Hubert Hurkacz', matches: 4, sets: 14, aces: 82, doubleFaults: 11 },
            { player: 'Alexander Zverev', matches: 4, sets: 15, aces: 65, doubleFaults: 14 }
        ],
        '1stServeWinPerc': [
            { player: 'Novak Djokovic', matches: 4, firstServePerc: '68%', firstServeWinPerc: '84%' },
            { player: 'Carlos Alcaraz', matches: 4, firstServePerc: '65%', firstServeWinPerc: '81%' }
        ],
        fastestServe: [
            { player: 'Ben Shelton', matches: 3, fastestServe: '238', avgServe: '210' },
            { player: 'Hubert Hurkacz', matches: 4, fastestServe: '232', avgServe: '205' }
        ],
        breakPointsWon: [
            { player: 'Jannik Sinner', matches: 4, bpWon: 22, bpTotal: 45, bpConv: '48.8%' },
            { player: 'Carlos Alcaraz', matches: 4, bpWon: 20, bpTotal: 42, bpConv: '47.6%' }
        ],
        returnWinners: [
            { player: 'Carlos Alcaraz', matches: 4, returnWinners: 45, returnPts: 180 },
            { player: 'Daniil Medvedev', matches: 4, returnWinners: 38, returnPts: 165 }
        ],
        bestWinPerc: [
            { player: 'Carlos Alcaraz', matches: 4, sets: 12, winPerc: '92%' },
            { player: 'Novak Djokovic', matches: 4, sets: 12, winPerc: '90%' }
        ]
    }
};

module.exports = {
    mockCricketMatches,
    mockFootballMatches,
    mockTennisMatches,
    mockNews,
    mockCricketSeries,
    mockPlayerCricket,
    mockPlayerFootball,
    mockPlayerTennis,
    mockTeamComparison,
    mockStandings,
    mockSquads,
    mockSeriesStats
};
