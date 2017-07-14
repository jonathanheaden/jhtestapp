var express = require('express');
var router = express.Router();
console.log("require home")
var ctrlHome = require('../controllers/home');
var ctrlGame = require('../controllers/game');
console.log("routes")
/* GET home page. */
router.get('/', ctrlHome.landing);
router.get('/game', ctrlGame.readgame);

module.exports = router;
