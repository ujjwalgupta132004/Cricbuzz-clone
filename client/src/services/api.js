import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000,  
});

export const getCricketMatches = () => api.get('/cricket/matches');
export const getCricketMatchDetails = (id) => api.get(`/cricket/matches/${id}`);

// ═══════ FOOTBALL (will add in Phase 2) ═══════
// export const getFootballMatches = () => api.get('/football/matches');

// ═══════ TENNIS (will add in Phase 2) ═══════
// export const getTennisMatches = () => api.get('/tennis/matches');

export default api;
