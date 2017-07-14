var ctrlShared = require('./shared');

module.exports.landing = function (req, res) {
  ctrlShared.sendJsonResponse(res, 200, {
      "title" : "cloud games"
    });;
};