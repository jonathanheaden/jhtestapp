var express = require('express');
var router = express.Router();
var player = require('../controllers/players')



/* GET users listing. */
router.post('/', player.newplayer);

module.exports = router;
