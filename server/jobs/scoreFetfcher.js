const { getIO } = require('../config/socket');
const cricketApi = require('../services/cricketApiService');
const footballApi = require('../services/footballApiService');
const tennisApi = require('../services/tennisApiService');
const { getOrSet } = require('../services/cacheServices');
const { mockCricketMatches, mockFootballMatches, mockTennisMatches } = require('../services/mockData');

const USE_MOCKS = process.env.USE_MOCK_FALLBACK === 'true';

const startScoreFetcher = async () => {
    console.log(`⏰ Smart Score Fetcher started. (Mocks Enabled: ${USE_MOCKS})`);
    
    const fetchLoop = async () => {
        const io = getIO();
        let isAnyMatchLive = false;

        // Only explicitly hit APIs if someone is actually connected
        if (io && io.engine.clientsCount > 0) {
            try {
                let cricketMatches;
                try {
                    cricketMatches = await getOrSet('cricket_liveMatches', cricketApi.getCurrentMatches, 55);
                } catch (err) {
                    console.warn('Cricket API failed:', err.message);
                    cricketMatches = USE_MOCKS ? mockCricketMatches : [];
                }

                const cricketLive = cricketMatches.filter(m => m.matchStarted && !m.matchEnded);
                if (cricketLive.length > 0) isAnyMatchLive = true;

                io.to('sport_cricket').emit('liveScoreUpdate', {
                    sport: 'cricket',
                    live: cricketLive,
                    completed: cricketMatches.filter(m => m.matchEnded),
                    upcoming: cricketMatches.filter(m => !m.matchStarted),
                    timestamp: new Date().toISOString()
                });
            } catch (err) { console.error('Cricket broadast err:', err.message); }

            try {
                let footballMatches;
                try {
                    footballMatches = await getOrSet('football_live', footballApi.getLiveMatches, 55);
                } catch (err) {
                    console.warn('Football API failed:', err.message);
                    footballMatches = USE_MOCKS ? mockFootballMatches : [];
                }
                
                const footballLive = footballMatches.filter(m => m.status === 'inprogress');
                if (footballLive.length > 0) isAnyMatchLive = true;

                io.to('sport_football').emit('liveScoreUpdate', {
                    sport: 'football',
                    matches: footballMatches,
                    timestamp: new Date().toISOString()
                });
            } catch (err) { console.error('Football broadast err:', err.message); }

            try {
                let tennisMatches;
                try {
                    tennisMatches = await getOrSet('tennis_live', tennisApi.getLiveMatches, 55);
                } catch (err) {
                    console.warn('Tennis API failed:', err.message);
                    tennisMatches = USE_MOCKS ? mockTennisMatches : [];
                }

                const tennisLive = tennisMatches.filter(m => m.status === 'inprogress');
                if (tennisLive.length > 0) isAnyMatchLive = true;

                io.to('sport_tennis').emit('liveScoreUpdate', {
                    sport: 'tennis',
                    matches: tennisMatches,
                    timestamp: new Date().toISOString()
                });
            } catch (err) { console.error('Tennis broadast err:', err.message); }
            
            console.log(`📡 Broadcast to ${io.engine.clientsCount} clients. Mode: ${isAnyMatchLive ? 'LIVE' : 'IDLE'}`);
        } else {
            console.log('💤 No clients connected. Skipping API fetch.');
        }

        // Adaptive Polling Strategy:
        // 1 Minute (60000ms) if Active Matches are running
        // 15 Minutes (900000ms) during Off-Peak (no live matches or nobody connected)
        const nextInterval = (isAnyMatchLive && io?.engine?.clientsCount > 0) ? 60000 : 900000;
        
        setTimeout(fetchLoop, nextInterval);
    };

    // Kickoff the loop
    fetchLoop();
};

module.exports = startScoreFetcher;
