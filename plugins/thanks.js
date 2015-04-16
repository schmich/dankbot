var common = require('../common'),
    _ = require('lodash'),
    Command = common.Command;

module.exports = function(command, message) {
  var welcomes = ['ur welcome', 'np bro', 'sure thing', 'you bet'];
  return new Command(/\b(ty|thanks|danke|(thank you))\s+dank\s*bot/i, function() {
    this.say(welcomes[_.random(welcomes.length - 1)]);
  });
};
