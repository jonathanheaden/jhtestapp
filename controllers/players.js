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
        var p = playerstate.get(playerid)
        p.vals[index] = true
        if (!p.vals.includes(false)) {
            if (!playerstate.get('gameover')) {
                playerstate.put('gameover', true)
                playerstate.put('winner', playerid)
            }
        }
        playerstate.put(playerid, p)
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
    ctrlShared.sendJsonResponse(res, 200, {
        "player": playerstate.get(playerid),
        "players": playerstate.get('playernames')
    });

}

var newplayer = function (req, res) {
    var list = playerstate.get('playernames')
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
            var playerslist = playerstate.get('playernames')
            var playersidlist = playerstate.get('playerids')
            playerslist.push(playername)
            playersidlist.push(playerid)
            playerstate.put('playernames', playerslist)
            playerstate.put('playerids', playersidlist)
            ctrlShared.sendJsonResponse(res, 200, {
                "id": playerid,
                "numplayers": (playerstate.get('playernames')).length,
                "players": playerstate.get('playernames'),
            });
        }
    }
}


var readgame = function (req, res) {
    var response = []
    var id = req.params.playerid
    if (!req.params.playerid) { id = '007' }
    playerstate.get('playerids').forEach(function (playerid) {
        
        var playercard = playerstate.get(playerid)
        if (playerid == id) { // put all the phrases into the response
            var obj = {
                'name': playercard.name,
                'playerid':playerid,
                'card': playercard.phrases,
                'vals':playercard.vals
            }
        } else  {
            var playerphrases = [];
            for (var i = 0; i < 5; i++) {
                var element
                if (playercard.vals[i]) {
                    element = playercard.phrases[i];
                } else {
                    element = '???'
                }
                playerphrases.push(element)                
            }
            var obj = {
                'name': playercard.name,
                'playerid':playerid,
                'card': playerphrases,
                'vals': playercard.vals,
            }
        }

        response.push(obj)
    }, this);
    ctrlShared.sendJsonResponse(res, 200, {
        "game": "conference call bingo",
        'players': response
    });
}

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
// module.exports.readplayers = readplayers
module.exports.readgame = readgame
