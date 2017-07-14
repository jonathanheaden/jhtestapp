var express = require('express');
var router = express.Router();

var ctrlHome = require('../controllers/home');
var ctrlGame = require('../controllers/game');
var ctrlPlayers = require('../controllers/players');

/* GET home page. */
router.get('/', ctrlHome.landing);
router.get('/game', ctrlGame.readgame);
router.get('/players', ctrlPlayers.readplayers);
router.get('/players/:playername', ctrlPlayers.getplayer);
router.put('/players/:playername/:phrase', ctrlPlayers.putplayer);

module.exports = router;
