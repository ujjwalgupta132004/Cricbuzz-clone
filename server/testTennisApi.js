require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.TENNIS_API_KEY;
const API_HOST = process.env.TENNIS_API_HOST || 'tennisapi1.p.rapidapi.com';
const BASE_URL = process.env.TENNIS_API_BASE_URL || `https://${API_HOST}`;

async function run() {
    if (!API_KEY) {
        console.error('Missing TENNIS_API_KEY in server/.env');
        process.exit(1);
    }

    try {
        const response = await axios.get(`${BASE_URL}/api/tennis/events/live`, {
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': API_HOST,
            },
            timeout: 15000,
            proxy: false,
        });

        console.log('Status:', response.status);
        console.log('Top-level keys:', Object.keys(response.data || {}));
        console.log('Preview:', JSON.stringify(response.data, null, 2).slice(0, 1500));
    } catch (error) {
        console.error('Request failed');
        console.error('Status:', error.response?.status || 'unknown');
        console.error('Status text:', error.response?.statusText || 'unknown');
        console.error('Response body:', JSON.stringify(error.response?.data || {}, null, 2));
        console.error('Message:', error.message);
        process.exit(1);
    }
}

run();
