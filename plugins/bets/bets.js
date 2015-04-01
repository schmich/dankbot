var common = require('../../common'),
    BetError = require('../../lib/bets').BetError,
    _ = require('lodash'),
    Command = common.Command,
    Log = common.Log,
    await = common.await,
    sprintf = common.sprintf,
    dkp = common.dkp;

module.exports = function(bets) {
  return new Command('!bets', function(amount, option) {
    if (this.user != this.channel) {
      return;
    }

    var currentBet = await(bets.current()); 
    if (!currentBet) {
      this.say('No bet is open. Use !openbet.');
      return;
    }

    var options = {};
    for (var i = 0; i < currentBet.options.length; ++i) {
      options[currentBet.options[i]] = [];
    }

    for (var i = 0; i < currentBet.bets.length; ++i) {
      var bet = currentBet.bets[i];
      options[bet.option].push({ user: bet.user, points: bet.points });
    }

    var grandTotal = 0;

    var betMessages = [];
    for (var option in options) {
      var optionBets = options[option];
      var users = 'no bets';

      if (optionBets.length > 0) {
        users = _(optionBets).sortBy('points').reverse().map(function(bet) {
          return sprintf('%s %d', bet.user, bet.points);
        }).join(', ');

        var total = _(optionBets).map(function(b) { return b.points; }).sum();
        grandTotal += total;

        betMessages.push(sprintf('★ %s (%s): %s', option, dkp(total), users));
      } else {
        betMessages.push(sprintf('★ %s: no bets', option));
      }
    }

    this.say('Total %s %s', dkp(grandTotal), betMessages.join(' — '));
  });
};
