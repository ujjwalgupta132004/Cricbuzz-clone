const cricketApi = require('../services/cricketApiService');
const footballApi = require('../services/footballApiService');
const tennisApi = require('../services/tennisApiService');
const { getOrSet } = require('../services/cacheServices');
const { mockPlayerCricket, mockPlayerFootball, mockPlayerTennis } = require('../services/mockData');

exports.getPlayer = async (req, res) => {
    try {
        const { sport, id } = req.params;
        let playerData;

        switch (sport) {
            case 'cricket':
                try {
                    playerData = await getOrSet(`player_cricket_${id}`,
                        () => cricketApi.getPlayerInfo(id), 300);
                } catch {
                    playerData = mockPlayerCricket;
                }
                break;
            case 'football':
                try {
                    playerData = await getOrSet(`player_football_${id}`,
                        () => footballApi.getPlayerStats(id, new Date().getFullYear()), 300);
                } catch {
                    playerData = mockPlayerFootball;
                }
                break;
            case 'tennis':
                try {
                    playerData = await getOrSet(`player_tennis_${id}`,
                        () => tennisApi.getPlayerInfo(id), 300);
                } catch {
                    playerData = mockPlayerTennis;
                }
                break;
            default:
                return res.status(400).json({ message: `Unknown sport: ${sport}` });
        }

        res.json({ sport, player: playerData });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch player data' });
    }
};

exports.searchPlayers = async (req, res) => {
    try {
        const { sport } = req.params;
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({ message: 'Search query must be at least 2 characters' });
        }

        let results;
        switch (sport) {
            case 'cricket':
                try { results = await cricketApi.searchPlayers(q); }
                catch { results = [mockPlayerCricket]; }
                break;
            case 'football':
                try { results = await footballApi.searchPlayers(q); }
                catch { results = [mockPlayerFootball]; }
                break;
            case 'tennis':
                results = [mockPlayerTennis];
                break;
            default:
                return res.status(400).json({ message: `Search not available for ${sport}` });
        }

        res.json({ sport, query: q, results });
    } catch (error) {
        res.status(500).json({ message: 'Player search failed' });
    }
};
