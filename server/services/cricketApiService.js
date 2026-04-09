const axios = require('axios');

const API_KEY = process.env.CRICKET_API_KEY;
const BASE_URL = process.env.CRICKET_API_BASE_URL;

const apiRequest = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}/${endpoint}`, {
            params: { apikey: API_KEY, ...params },
            proxy: false,
        });

        if (response.data.status !== 'success') {
            throw new Error(`API returned: ${response.data.status}`);
        }

        return response.data.data;
    } catch (error) {
        console.error(` Cricket API Error [${endpoint}]:`, error.message);
        throw error;
    }
};

const getCurrentMatches = async () => {
    return await apiRequest('currentMatches', { offset: 0 });
};
const getMatchInfo = async (matchId) => {
    return await apiRequest('match_scorecard', { id: matchId });
};
const getPlayerInfo = async (playerId) => {
    return await apiRequest('players_info', { id: playerId });
};
const getSeriesList = async () => {
    return await apiRequest('series', { offset: 0 });
};
const searchPlayers = async (name) => {
    return await apiRequest('players', { search: name });
};

module.exports = {
    getCurrentMatches,
    getMatchInfo,
    getPlayerInfo,
    getSeriesList,
    searchPlayers
};
