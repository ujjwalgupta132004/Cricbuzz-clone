const express = require('express');
const router = express.Router();
const { getNews } = require('../services/newsService');

router.get('/', async (req, res) => {
    try {
        const { sport = 'all' } = req.query;
        const payload = await getNews(sport);
        res.json(payload);
    } catch (error) {
        res.status(500).json({ message: 'Unable to fetch news', error: error.message });
    }
});

module.exports = router;
