const axios = require('axios');

const API_KEY = process.env.TENNIS_API_KEY;
const API_HOST = process.env.TENNIS_API_HOST || 'tennisapi1.p.rapidapi.com';
const BASE_URL = process.env.TENNIS_API_BASE_URL || `https://${API_HOST}`;

const apiRequest = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            headers: {
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': API_KEY
            },
            params,
            proxy: false,
        });

        return response.data;
    } catch (error) {
        console.error(` Tennis API Error [${endpoint}]:`, error.message);
        throw error;
    }
};

const getResponseArray = (payload, keys = []) => {
    for (const key of keys) {
        if (Array.isArray(payload?.[key])) return payload[key];
    }

    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload)) return payload;
    return [];
};

const getLiveMatches = async () => {
    const payload = await apiRequest('/api/tennis/events/live');
    return getResponseArray(payload, ['events', 'data']);
};

const getMatchesByDate = async (dateFrom) => {
    const payload = await apiRequest(`/api/tennis/events/${dateFrom}`);
    return getResponseArray(payload, ['events', 'data']);
};

const getMatchDetails = async (eventId) => {
    const payload = await apiRequest(`/api/tennis/event/${eventId}`);
    return payload?.event || payload?.data || payload;
};

const getRankings = async (tour = 'atp') => {
    const normalizedTour = String(tour || 'atp').toLowerCase() === 'wta' ? 'wta' : 'atp';
    const payload = await apiRequest(`/api/tennis/rankings/${normalizedTour}`);
    return getResponseArray(payload, ['rankings', 'players', 'data']);
};

const getPlayerInfo = async (playerId) => {
    const payload = await apiRequest(`/api/tennis/player/${playerId}`);
    return payload?.player || payload?.data || payload;
};

const getHeadToHead = async (player1Id, player2Id) => {
    const payload = await apiRequest(`/api/tennis/h2h/${player1Id}/${player2Id}`);
    return payload?.h2h || payload?.data || payload;
};

module.exports = {
    getLiveMatches,
    getMatchesByDate,
    getMatchDetails,
    getRankings,
    getPlayerInfo,
    getHeadToHead
};
