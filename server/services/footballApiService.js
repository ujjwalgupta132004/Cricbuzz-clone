const axios = require('axios');

const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = process.env.FOOTBALL_API_BASE_URL;

const apiRequest = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}/${endpoint}`, {
            headers: {
                'x-apisports-key': API_KEY,  
            },
            params  
        });

        if (response.data.errors && Object.keys(response.data.errors).length > 0) {
            throw new Error(JSON.stringify(response.data.errors));
        }

        return response.data.response; 
    } catch (error) {
        console.error(` Football API Error [${endpoint}]:`, error.message);
        throw error;
    }
};


const getLiveMatches = async () => {
    return await apiRequest('fixtures', { live: 'all' });
};

const getMatchesByDate = async (date) => {
    return await apiRequest('fixtures', { date });
};
const getMatchDetails = async (fixtureId) => {
    return await apiRequest('fixtures', { id: fixtureId });
};

const getStandings = async (leagueId, season) => {
    return await apiRequest('standings', { league: leagueId, season });
};
const getPlayerStats = async (playerId, season) => {
    return await apiRequest('players', { id: playerId, season });
};

const searchPlayers = async (name) => {
    return await apiRequest('players', { search: name });
};
const getTopScorers = async (leagueId, season) => {
    return await apiRequest('players/topscorers', { league: leagueId, season });
};

module.exports = {
    getLiveMatches,
    getMatchesByDate,
    getMatchDetails,
    getStandings,
    getPlayerStats,
    searchPlayers,
    getTopScorers
};
