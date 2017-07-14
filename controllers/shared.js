var thingsthataresaid = [
    'who just joined?',
    '[Loud Echo or Feedback]',
    'Sorry I was on Mute',
    'Can we take this offline?',
    '[Animal or Child Noises]',
    'Can everyone see my Screen',
    'Can you email that to everyone?',
    'I need to jump on another call',
    'can everyone go on Mute?',
    'No it is still loading'
];

sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.sendJsonResponse = sendJsonResponse;
module.exports.thingsthataresaid = thingsthataresaid