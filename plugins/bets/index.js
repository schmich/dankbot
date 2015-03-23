var Bets = require('../../lib/bets').Bets;

module.exports = function(db) {
  var bets = new Bets(db);

  return [
    new require('./openbet')(bets),
    new require('./closebet')(bets),
    new require('./killbet')(bets),
    new require('./result')(bets),
    new require('./bet')(bets),
    new require('./bets')(bets)
  ];
};
