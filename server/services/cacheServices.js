
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const getOrSet = async (key, fetchFunction, ttl = 60) => {
    const cached = cache.get(key);
    if (cached) {
        console.log(` Cache HIT: ${key}`);
        return cached; 
    }

    console.log(` Cache MISS: ${key} — calling API...`);
    const freshData = await fetchFunction(); 
    cache.set(key, freshData, ttl);          
    return freshData;
};

const clearCache = (key) => {
    if (key) cache.del(key);
    else cache.flushAll();
};

const getStats = () => cache.getStats();

module.exports = { getOrSet, clearCache, getStats };
