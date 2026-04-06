const axios = require('axios');
const { mockNews } = require('./mockData');

const SPORT_QUERIES = {
    all: 'sports OR cricket OR football OR tennis',
    cricket: 'cricket OR IPL OR ICC',
    football: 'football OR soccer OR premier league OR champions league',
    tennis: 'tennis OR ATP OR WTA OR grand slam',
};

const normalizeGNewsArticle = (article, index, sport) => ({
    id: article.url || `gnews-${index}`,
    sport,
    title: article.title,
    summary: article.description || 'No summary available.',
    image: article.image || '',
    timestamp: article.publishedAt,
    source: article.source?.name || 'GNews',
    url: article.url,
});

const getMockNews = (sport) => {
    const items = sport && sport !== 'all'
        ? mockNews.filter((item) => item.sport === sport)
        : mockNews;

    return {
        items,
        source: 'mock',
        updatedAt: new Date().toISOString(),
    };
};

const getNews = async (sport = 'all') => {
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
        return getMockNews(sport);
    }

    try {
        const response = await axios.get('https://gnews.io/api/v4/search', {
            params: {
                q: SPORT_QUERIES[sport] || SPORT_QUERIES.all,
                lang: 'en',
                country: 'in',
                max: 10,
                apikey: apiKey,
            },
            timeout: 10000,
        });

        const items = (response.data?.articles || []).map((article, index) =>
            normalizeGNewsArticle(article, index, sport === 'all' ? detectSport(article) : sport)
        );

        return {
            items: items.length ? items : getMockNews(sport).items,
            source: 'gnews',
            updatedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('News provider fallback used:', error.message);
        return getMockNews(sport);
    }
};

const detectSport = (article) => {
    const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
    if (text.includes('tennis') || text.includes('atp') || text.includes('wta') || text.includes('slam')) {
        return 'tennis';
    }
    if (text.includes('football') || text.includes('soccer') || text.includes('premier league') || text.includes('champions league')) {
        return 'football';
    }
    if (text.includes('cricket') || text.includes('ipl') || text.includes('icc') || text.includes('odi') || text.includes('t20')) {
        return 'cricket';
    }
    return 'all';
};

module.exports = { getNews };
