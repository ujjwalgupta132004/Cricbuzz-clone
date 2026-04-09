const express = require('express');
const router = express.Router();
const { getLiveMatches, getMatchDetails } = require('../controllers/footballController');

router.get('/matches', getLiveMatches);
router.get('/matches/:id', getMatchDetails);
module.exports = router;
