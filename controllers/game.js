var ctrlShared = require('./shared');
var player = require('./players')

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

module.exports.readgame = function (req, res) {
  ctrlShared.sendJsonResponse(res, 200, {
      "game" : "conference call bingo",
      'BingoCard': getUnique(5)
    });
};

