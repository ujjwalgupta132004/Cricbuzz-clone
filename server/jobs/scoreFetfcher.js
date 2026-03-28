const cron = require('node-cron');
const { getIO } = require('../config/socket');
const cricketApi = require('../services/cricketApiService');
const footballApi = require('../services/footballApiService');
const tennisApi = require('../services/tennisApiService');
const { getOrSet } = require('../services/cacheServices');

const startScoreFetcher = () => {
    cron.schedule('*/30 * * * * *', async () => {
        const io = getIO();

        try {
            const cricketMatches = await getOrSet('cricket_liveMatches',
                cricketApi.getCurrentMatches, 25);
            io.to('sport_cricket').emit('liveScoreUpdate', {
                sport: 'cricket',
                live: cricketMatches.filter(m => m.matchStarted && !m.matchEnded),
                completed: cricketMatches.filter(m => m.matchEnded),
                upcoming: cricketMatches.filter(m => !m.matchStarted),
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error('Cricket fetch error:', err.message);
        }

        try {
            const footballMatches = await getOrSet('football_live',
                footballApi.getLiveMatches, 25);
            io.to('sport_football').emit('liveScoreUpdate', {
                sport: 'football',
                matches: footballMatches,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error('Football fetch error:', err.message);
        }

        try {
            const tennisMatches = await getOrSet('tennis_live',
                tennisApi.getLiveMatches, 25);
            io.to('sport_tennis').emit('liveScoreUpdate', {
                sport: 'tennis',
                matches: tennisMatches,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error('Tennis fetch error:', err.message);
        }

        console.log(`📡 Broadcast to ${io.engine.clientsCount} clients`);
    });

    console.log('⏰ Multi-sport score fetcher started (every 30s)');
};

module.exports = startScoreFetcher;
