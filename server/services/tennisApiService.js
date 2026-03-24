const axios = require('axios');

const API_KEY = process.env.TENNIS_API_KEY;
const BASE_URL = process.env.TENNIS_API_BASE_URL;

const apiRequest = async (method, params = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}/`, {
            params: {
                method,                  
                APIkey: API_KEY,         
                ...params
            }
        });

        if (response.data.success === 0) {
            throw new Error(response.data.error || 'Tennis API error');
        }

        return response.data.result;
    } catch (error) {
        console.error(` Tennis API Error [${method}]:`, error.message);
        throw error;
    }
};
const getLiveMatches = async () => {
    return await apiRequest('Livescore');
};

const getMatchesByDate = async (dateFrom, dateTo) => {
    return await apiRequest('Events', { date_start: dateFrom, date_stop: dateTo });
};
const getMatchDetails = async (eventId) => {
    return await apiRequest('Event', { event_id: eventId });
};
const getRankings = async () => {
    return await apiRequest('Rankings');
};
const getPlayerInfo = async (playerId) => {
    return await apiRequest('Player', { player_id: playerId });
};
const getHeadToHead = async (player1Id, player2Id) => {
    return await apiRequest('H2H', {
        player_id_1: player1Id,
        player_id_2: player2Id
    });
};

module.exports = {
    getLiveMatches,
    getMatchesByDate,
    getMatchDetails,
    getRankings,
    getPlayerInfo,
    getHeadToHead
};
