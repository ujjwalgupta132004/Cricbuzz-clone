const axios = require('axios');

const API_KEY = process.env.FOOTBALL_API_KEY;

const apiRequest = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`https://sportscore1.p.rapidapi.com${endpoint}`, {
            headers: {
                'x-rapidapi-host': 'sportscore1.p.rapidapi.com',
                'x-rapidapi-key': API_KEY
            },
            params  
        });

        return response.data.data; 
    } catch (error) {
        console.error(` SportScore API Error [${endpoint}]:`, error.message);
        throw error;
    }
};

const getLiveMatches = async () => {
    return await apiRequest('/sports/1/events/live');
};

const getMatchesByDate = async (date) => {
    return await apiRequest(`/sports/1/events/date/${date}`); 
};

const getMatchDetails = async (fixtureId) => {
    return await apiRequest(`/events/${fixtureId}`);
};

const getStandings = async (leagueId, season) => {
    return []; // Placeholder, find specific SportScore tournament standings endpoint later if needed
};

const searchPlayers = async (name) => {
    return []; // Placeholder
};

const getPlayerStats = async (playerId, season) => { return []; };
const getTopScorers = async (leagueId, season) => { return []; };

module.exports = {
    getLiveMatches,
    getMatchesByDate,
    getMatchDetails,
    getStandings,
    getPlayerStats,
    searchPlayers,
    getTopScorers
};
