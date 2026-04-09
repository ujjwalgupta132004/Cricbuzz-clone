
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const getOrSet = async (key, fetchFunction, ttl = 60) => {
    const cached = cache.get(key);
    // Even if it's explicitly 'null' (cached failure), return it to prevent API spam
    if (cached !== undefined) {
        console.log(` Cache HIT: ${key}`);
        return cached === 'null_fallback' ? null : cached; 
    }

    console.log(` Cache MISS: ${key} — calling API...`);
    try {
        const freshData = await fetchFunction(); 
        cache.set(key, freshData, ttl);          
        return freshData;
    } catch (err) {
        // Cache the failure so we don't hammer the API 50 times a second when rate limited
        console.log(` Cache ERROR: ${key} failed, caching fallback to prevent retry spam.`);
        cache.set(key, 'null_fallback', ttl);
        throw err; // Re-throw so controllers know to use mock data
    }
};

const clearCache = (key) => {
    if (key) cache.del(key);
    else cache.flushAll();
};

const getStats = () => cache.getStats();

module.exports = { getOrSet, clearCache, getStats };
