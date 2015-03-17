var common = require('../common'),
    Command = common.Command;

module.exports = function() {
  return [
    new Command(/^\s*Kappa\s*\/\s*$/, function() {
      this.say('\\Kappa');
    }),
    new Command(/^\s*\\\s*Kappa\s*$/, function() {
      this.say('Kappa/');
    }),
    new Command(/^\s*o\s*\/\s*$/, function() {
      this.say('\\o');
    }),
    new Command(/^\s*\\\s*o\s*$/, function() {
      this.say('o/');
    })
  ];
};
