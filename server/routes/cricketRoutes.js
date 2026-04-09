const express = require('express');
const router = express.Router();
const { getLiveMatches, getMatchDetails } = require('../controllers/matchcontroller');
const cricketApi = require('../services/cricketApiService');
const { getOrSet } = require('../services/cacheServices');

router.get('/matches', getLiveMatches);
router.get('/matches/:id', getMatchDetails);

router.get('/series', async (req, res) => {
    try {
        const series = await getOrSet('cricket_series', cricketApi.getSeriesList, 300);
        res.json(series);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch series list' });
    }
});

module.exports = router;