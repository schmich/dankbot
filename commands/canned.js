var common = require('../common'),
    Command = common.Command;

module.exports = function(command, message) {
  return new Command(command, function() {
    this.say(message);
  });
};
