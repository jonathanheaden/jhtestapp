var express = require('express');
var router = express.Router();

var ctrlPlayers = require('../controllers/players');

/* GET home page. */
router.get('/', ctrlPlayers.landing);
router.get('/:gameid/', ctrlPlayers.readgame);
router.get('/:gameid/:playerid', ctrlPlayers.readgame);
router.post('/',ctrlPlayers.newgame);
//router.get('/players/:playerid', ctrlPlayers.getplayer);
router.put('/players/:playerid/:phrase', ctrlPlayers.putplayer);

module.exports = router;
