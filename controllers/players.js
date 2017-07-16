var ctrlShared = require('./shared');
var playerstate = require('memory-cache');
playerstate.put('players', [])
playerstate.put('playernames', [])
playerstate.put('winner', 'No winner!')
playerstate.put('playerids',[])
playerstate.put('gameover', false)

var putplayer = function (req, res) {
    var playerid = req.params.playerid
    var index = req.params.phrase
    if (['0', '1', '2', '3', '4'].includes(index)) {
        var player = playerstate.get(playerid)
        player.vals[index] = true
        if (!player.vals.includes(false)) {
            if (playerstate.get('winner') != 'No winner!') {
                playerstate.put('winner', playerid)
            }
        }
        playerstate.put(playerid, player)
        ctrlShared.sendJsonResponse(res, 200, {
            "player": playerstate.get(playerid)
        });
    } else {
        ctrlShared.sendJsonResponse(res, 405, {
            "message": 'index out of bounds.'
        });
    }
}

var getplayer = function (req, res) {
    var playerid = req.params.playerid
    console.log(playerid)
    ctrlShared.sendJsonResponse(res, 200, {
        "player": playerstate.get(playerid),
        "players": playerstate.get('players')
    });

}

var newplayer = function (req, res) {
    var playername = req.body.playername
    var playerid = getnewplayerid()
    if (!playerstate.gameover) {
        if (playerstate.get('playernames').includes(playername)) {
            ctrlShared.sendJsonResponse(res, 405, {
                "message": 'name is already registered',
            })
        } else {
            var playervals = [false, false, false, false, false]
            var playerphrases = getUnique(5)
            var playerobj = {
                'name': playername,
                'phrases': playerphrases,
                'vals': playervals
            }
            playerstate.put(playerid, playerobj)
            var playerslist = playerstate.get('players')
            playerslist.push(playerid)
            console.log(playerslist)
            playerstate.put('players', playerslist)
            ctrlShared.sendJsonResponse(res, 200, {
                "numplayers": playerstate.get('players').count,
                "players": playerstate.get('players'),
            });
        }
    }
}


var readplayers = function (req, res) {
    var response = []
    playerstate.get('players').forEach(function (playerid) {
        var obj = {
            'name': playerid,
            'card': playerstate.get(playerid)
        }
        response.push(obj)
    }, this);
    ctrlShared.sendJsonResponse(res, 200, {
        "game": "conference call bingo",
        'players': response
    });
}


var readgame = function (req, res) {
  ctrlShared.sendJsonResponse(res, 200, {
      "game" : "conference call bingo",
      'BingoCard': getUnique(5)
    });
};


// helper functions

function getUnique(count) {

    var tmp = ctrlShared.thingsthataresaid.slice()
    var ret = [];

    for (var i = 0; i < count; i++) {
        var index = Math.floor(Math.random() * tmp.length);
        var removed = tmp.splice(index, 1);
        ret.push(removed[0]);
    }
    return ret;
}

function getnewplayerid() {
    var id = ctrlShared.get4char()
    while ((playerstate.get('playerids').includes(id))) {
        id = ctrlShared.get4char()    
    }
    return id
}

module.exports.putplayer = putplayer
module.exports.getplayer = getplayer
module.exports.newplayer = newplayer
module.exports.readplayers = readplayers
module.exports.readgame = readgame