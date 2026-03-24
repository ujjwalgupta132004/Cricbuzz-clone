const express = require('express');
const router = express.Router();
const { getLiveMatches } = require('../controllers/footballController');

router.get('/matches', getLiveMatches);
module.exports = router;