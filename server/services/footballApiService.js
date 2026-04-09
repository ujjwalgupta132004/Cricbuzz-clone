const axios = require('axios');

const API_KEY = process.env.FOOTBALL_API_KEY;

const apiRequest = async (endpoint, params = {}) => {
    try {
        const baseURL = process.env.FOOTBALL_API_BASE_URL || 'https://v3.football.api-sports.io';
        const response = await axios.get(`${baseURL}${endpoint}`, {
            headers: {
                'x-apisports-key': API_KEY
            },
            params,
            proxy: false,
        });

        // API-Sports returns its array in `response` key instead of `data`
        return response.data.response; 
    } catch (error) {
        console.error(` SportScore API Error [${endpoint}]:`, error.message);
        throw error;
    }
};

const getLiveMatches = async () => {
    return await apiRequest('/fixtures?live=all');
};

const getMatchesByDate = async (date) => {
    return await apiRequest(`/fixtures?date=${date}`); 
};

const getMatchDetails = async (fixtureId) => {
    return await apiRequest(`/fixtures?id=${fixtureId}`);
};

const getStandings = async (leagueId, season) => {
    return await apiRequest('/standings', { league: leagueId, season: season });
};

const getLineups = async (fixtureId) => {
    return await apiRequest('/fixtures/lineups', { fixture: fixtureId });
};

const getFixtureStatistics = async (fixtureId) => {
    return await apiRequest('/fixtures/statistics', { fixture: fixtureId });
};

const searchPlayers = async (name) => {
    return await apiRequest('/players', { search: name });
};

const getPlayerStats = async (playerId, season) => { 
    return await apiRequest('/players', { id: playerId, season: season }); 
};
const getTopScorers = async (leagueId, season) => { 
    return await apiRequest('/players/topscorers', { league: leagueId, season: season }); 
};

module.exports = {
    getLiveMatches,
    getMatchesByDate,
    getMatchDetails,
    getStandings,
    getLineups,
    getFixtureStatistics,
    getPlayerStats,
    searchPlayers,
    getTopScorers
};
