var thingsthataresaid = [
    'who just joined?',
    '[Loud Echo or Feedback]',
    'Sorry I was on Mute',
    'Can we take this offline?',
    '[Animal or Child Noises]',
    'Are you still there _____ ??',
    'Can everyone see my Screen',
    'Can you email that to everyone?',
    'I need to jump on another call',
    'can everyone go on Mute?',
    'OK lets kick off',
    'sorry I\'m late [lame excuse]',
    'I didn\'t catch that .. can you repeat?',
    'No it is still loading',
    'Can you hear me now?',
    'No',
    'Yes',
    'I can\'t believe it\'s not',
    'The Techbar is Bloatware',
    'That\'s not my job',
    'Engineering can help us with that',
    'Follow Process',
    'Scragile',
    'Avatar',
    'Ghost',
    'Waterfall',
    'Share your screen',
    'PPM Code',
    'BINGO',
    'Take action',
    'Json'
];

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var get4char = function () {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

module.exports.sendJsonResponse = sendJsonResponse;
module.exports.thingsthataresaid = thingsthataresaid;
module.exports.get4char = get4char;
