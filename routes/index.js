var express = require('express');
var router = express.Router();

var ctrlHome = require('../controllers/home');
var ctrlGame = require('../controllers/game');

/* GET home page. */
router.get('/', ctrlHome.landing);
router.get('/game', ctrlGame.readgame);

module.exports = router;
