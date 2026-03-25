import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000,  
});

export const getCricketMatches = () => api.get('/cricket/matches');
export const getCricketMatchDetails = (id) => api.get(`/cricket/matches/${id}`);
export const getFootballMatches = () => api.get('/football/matches');
export const getFootballMatchDetails = (id) => api.get(`/football/matches/${id}`);
export const getTennisMatches = () => api.get('/tennis/matches');
export const getTennisMatchDetails = (id) => api.get(`/tennis/matches/${id}`);


export default api;
