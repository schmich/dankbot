var common = require('../common'),
    Command = common.Command;

module.exports = function() {
  return new Command(/^\s*Kappa\s*$/, function() {
    this.say('Kappa');
  });
};
