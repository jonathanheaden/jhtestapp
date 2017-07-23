var ctrlShared = require('./shared');
var playerstate = require('memory-cache');

playerstate.put('games', [])


var landing = function (req, res) {
    var games = []
    playerstate.get('games').forEach(function (element) {
        var item = {
            description: element.description,
            id: element.id,
            gameon: !element.gameover,
            numplayers: element.players.length
        }
        games.push(item)
    }, this);
    ctrlShared.sendJsonResponse(res, 201, {
        'games': games
    })
}

var newgame = function (req, res) {
    var description = req.body.description.substring(0, 140)
    var games = playerstate.get('games')
    var gameids = []
    if (games.length >= 1) {
        games.forEach(function (element) {
            gameids.push(element.id)
        }, this);
    }
    var gameid = getnewid(gameids)
    var newgame = {
        id: gameid,
        description: description,
        players: [],
        playernames: [],
        playerids: [],
        winner: 'No Winner!',
        gameover: false
    }
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
    games.forEach(function (element) {
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
            game.playernames.push(playername)
            game.playerids.push(playerid)
            newGames.push(game)
            playerstate.put('games', newGames)
            ctrlShared.sendJsonResponse(res, 200, {
                "playerid": playerid,
                "gameid": game.id,
                "numplayers": game.playernames.length,
                "players": game.playernames
            });
        }
    }
}


var readgame = function (req, res) {
    var gameid = req.params.gameid
    var id = req.params.playerid
    if (!req.params.playerid) {
        id = '007'
    }
    if (!req.params.gameid) {
        gameid = 'spy'
    }
    var response = []
    var game = getgame(gameid)
    if (!game) {
        ctrlShared.sendJsonResponse(res, 401, {
            "message": "game not found"
        });
    } else {
        game.players.forEach(function (player) {
            if (player.id == id) {
                var obj = player
            } else {
                var playerphrases = [];
                for (var i = 0; i < 5; i++) {
                    var element
                    if (player.vals[i]) {
                        element = player.phrases[i];
                    } else {
                        element = '???'
                    }
                    playerphrases.push(element)
                }
                var obj = {
                    'name': player.name,
                    'playerid': player.id,
                    'card': playerphrases,
                    'vals': player.vals,
                }
            }

            response.push(obj)
        }, this);
        ctrlShared.sendJsonResponse(res, 200, {
            "game": "conference call bingo",
            'players': response
        });
    }
}

var putplayer = function (req, res) {
    var gameid = req.params.gameid
    var playerid = req.params.playerid
    var phraseid = req.params.phraseid
    var newGames = []
    var games = playerstate.get('games')
    var game

    games.forEach(function (element) {
        if (element.id == gameid) {
            game = element
        } else {
            newGames.push(element)
        }
    }, this);
    if (!game) {
        ctrlShared.sendJsonResponse(res, 401, {
            "message": "game not found"
        });
    } else {
        if (game.gameover) {
            ctrlShared.sendJsonResponse(res, 201, {
                'gamestatus': 'Game Over',
                'winner': (game.winner)
            })
        } else {
            if (['0', '1', '2', '3', '4'].includes(phraseid)) {
                var p = getplayeringame(playerid,game)
                p.vals[phraseid] = true
                if (!p.vals.includes(false)) {
                    game.gameover = true
                    game.winner = p.name
                }
                var newstateofplayers = []
                game.players.map(plyr => {
                    console.log(plyr.id + ' ?== '+ playerid)
                    console.log(!plyr.id == playerid ) 
                    if (!(plyr.id == playerid)) {
                        newstateofplayers.push(plyr)
                    } else {
                        
                        newstateofplayers.push(p)
                    }
                })
                game.players = newstateofplayers
                newGames.push(game)
                playerstate.put('games', newGames)
                ctrlShared.sendJsonResponse(res, 200, {
                    "player": playerid,
                    'gamestatus': game.gameover ? 'Game Over' : 'Game On',
                    'winner': game.winner
                });
            } else {
                ctrlShared.sendJsonResponse(res, 405, {
                    "message": 'index out of bounds.'
                });
            }
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

function getgame(id) {
    var game
    playerstate.get('games').forEach(function (element) {
        if (element.id == id) {
            game = element
        }
    }, this);
    return game
}
function getplayeringame(id, game){
    var player
    game.players.forEach(function(p){
        if (p.id == id) { 
            player = p
        }
    })
    return player
}

module.exports.landing = landing
module.exports.putplayer = putplayer
module.exports.newplayer = newplayer
module.exports.newgame = newgame
module.exports.readgame = readgame