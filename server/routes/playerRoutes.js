const express = require('express');
const router = express.Router();
const { getPlayer, searchPlayers } = require('../controllers/playerController');
router.get('/:sport/search', searchPlayers);
router.get('/:sport/:id', getPlayer);

module.exports = router;
