const axios = require('axios');

const API_KEY = process.env.TENNIS_API_KEY;

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
        console.error(` SportScore Tennis API Error [${endpoint}]:`, error.message);
        throw error;
    }
};

const getLiveMatches = async () => {
    return await apiRequest('/sports/2/events/live');
};

const getMatchesByDate = async (dateFrom, dateTo) => {
    return await apiRequest(`/sports/2/events/date/${dateFrom}`);
};

const getMatchDetails = async (eventId) => {
    return await apiRequest(`/events/${eventId}`);
};

const getRankings = async () => { return []; };
const getPlayerInfo = async (playerId) => { return []; };
const getHeadToHead = async (player1Id, player2Id) => { return []; };

module.exports = {
    getLiveMatches,
    getMatchesByDate,
    getMatchDetails,
    getRankings,
    getPlayerInfo,
    getHeadToHead
};
