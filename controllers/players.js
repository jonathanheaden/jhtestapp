var ctrlShared = require('./shared');
var playerstate = require('memory-cache');
playerstate.put('players',[])

var putplayer = function(req,res){
    var playername = req.body.playername
    var playervals = req.body.playervals
    var index = req.body.index
    playervals[index] = true
    playerstate.put(playername,playervals)
}

var getplayer = function(req,res){
    var playername =  req.params.playername
    console.log(playername)
    ctrlShared.sendJsonResponse(res, 200, {
      "player" : playerstate.get(playername),
      "players" : playerstate.get('players')
    });

}

var newplayer = function(req,res){
    var playername = req.body.playername
    var playervals = [false,false,false,false,false]
    var playerphrases = getUnique(5)
    var playerobj = {
        'phrases': playerphrases,
        'vals': playervals
    }
    playerstate.put(playername,playerobj)
    var playerslist =  playerstate.get('players')
    playerslist.push(playername)
    console.log(playerslist)
    playerstate.put('players',playerslist)
    ctrlShared.sendJsonResponse(res, 200, {
        "numplayers" : playerstate.get('players').count,
        "players" : playerstate.get('players'),
    });
}

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

var readplayers = function(req,res){
    ctrlShared.sendJsonResponse(res, 200, {
      "game" : "conference call bingo",
      'players': playerstate
    });
}

module.exports.putplayer = putplayer
module.exports.getplayer = getplayer
module.exports.newplayer = newplayer