var ctrlShared = require('./shared');
var playerstate = require('memory-cache');

playerstate.put('games', [])


var landing = function (req, res) {
    var games = []
    playerstate.get('games').forEach(function (element) {
        var item = {
            description: element.description,
            id: element.id
        }
        games.push(item)
    }, this);
    ctrlShared.sendJsonResponse(res, 201, {
        'games': games
    })
}

var newgame = function(req,res){
    var description = req.body.description.substring(0,140)
    var games = playerstate.get('games')
    console.log(games)
    var gameids = []
    if (games.length >= 1) {
        console.log(games.length)
        games.array.forEach(function (element) {
            gameids.push(element.id)
        }, this);
    }
    var gameid = getnewid(gameids)
    var newgame = {
        id: gameid,
        description: description,
        players: [],
        playernames: [],
        playerids:[],
        winner: 'No Winner!',
        gameover: false
    }
    console.log(newgame)
    games.push(newgame)
    playerstate.put('games', games)
    ctrlShared.sendJsonResponse(res, 200, {
                "id": gameid,
                "description": description
            });
}

var newplayer = function (req, res) {
    var playername = req.body.playername
    var gameid = req.params.gameid
    var games = playerstate.get('games')
    var newGames = []
    var game
    games.array.forEach(function(element) {
        if (element.id == gameid) {
            game = element
        } else {
            newGames.push(element)
        }
    }, this);
    var list = game.playernames
    var playerid = getnewid(game.playerids)
    if (!game.gameover) {
        if (game.playernames.includes(playername)) {
            ctrlShared.sendJsonResponse(res, 405, {
                "message": 'name is already registered',
            })
        } else {
            var playervals = [false, false, false, false, false]
            var playerphrases = getUnique(5)
            var playerobj = {
                'id': playerid,
                'name': playername,
                'phrases': playerphrases,
                'vals': playervals
            }
            game.players.push(playerobj)
            game.playerslist.push(playername)
            game.playersidlist.push(playerid)
            newGames.push(newgame)
            playerstate.put('games',newGames)
            ctrlShared.sendJsonResponse(res, 200, {
                "id": playerid,
                "numplayers": game.playernames.length,
                "players": game.playernames
            });
        }
    }
}


var readgame = function (req, res) {
    var response = []
    var id = req.params.playerid
    if (!req.params.playerid) {
        id = '007'
    }
    playerstate.get('playerids').forEach(function (playerid) {

        var playercard = playerstate.get(playerid)
        if (playerid == id) {
            var obj = {
                'name': playercard.name,
                'playerid': playerid,
                'card': playercard.phrases,
                'vals': playercard.vals
            }
        } else {
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
                'playerid': playerid,
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

var putplayer = function (req, res) {
    var playerid = req.params.playerid
    if (playerstate.get('gameover')) {
        ctrlShared.sendJsonResponse(res, 201, {
            'gamestatus': 'Game Over',
            'winner': (playerstate.get('winner'))
        })
    } else {
        var index = req.params.phrase
        if (['0', '1', '2', '3', '4'].includes(index)) {
            var p = playerstate.get(playerid)
            p.vals[index] = true
            if (!p.vals.includes(false)) {
                if (!playerstate.get('gameover')) {
                    playerstate.put('gameover', true)
                    playerstate.put('winner', p.name)
                }
            }
            playerstate.put(playerid, p)
            ctrlShared.sendJsonResponse(res, 200, {
                "player": playerstate.get(playerid),
                'gamestatus': playerstate.get('gameover') ? 'Game Over' : 'Game On',
                'winner': (playerstate.get('winner'))
            });
        } else {
            ctrlShared.sendJsonResponse(res, 405, {
                "message": 'index out of bounds.'
            });
        }
    }
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

function getnewid(currentIDs) {
    var id = ctrlShared.get4char()
    while (currentIDs.includes(id)) {
        id = ctrlShared.get4char()
    }
    return id
}

module.exports.landing = landing
module.exports.putplayer = putplayer
//module.exports.getplayer = getplayer
module.exports.newplayer = newplayer
module.exports.newgame = newgame
// module.exports.readplayers = readplayers
module.exports.readgame = readgame
