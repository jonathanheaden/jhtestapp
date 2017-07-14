var ctrlShared = require('./shared');

module.exports.readgame = function (req, res) {
  ctrlShared.sendJsonResponse(res, 200, {
      "game" : "conference call bingo"
    });;
};