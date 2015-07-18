var common = require('../../common'),
    BetError = require('../../lib/bets').BetError,
    Command = common.Command,
    Log = common.Log,
    await = common.await,
    sprintf = common.sprintf,
    dkp = common.dkp;

module.exports = function(bets) {
  return new Command('!bet', function(amount, option) {
    if (!amount && !option) {
      var bet = await(bets.current());
      if (!bet) {
        this.say('%s: no bet is open.', this.user);
      } else {
        var userBet = null;
        for (var i = 0; i < bet.bets.length; ++i) {
          if (bet.bets[i].user == this.user) {
            userBet = bet.bets[i];
            break;
          }
        }

        var currentBet = (userBet == null)
          ? "You haven't bet yet. Bet with !bet <amount> <option>."
          : sprintf('Your bet is %s on %s.', dkp(userBet.points), userBet.option);

        var state = bet.open ? 'open' : 'closed';
        var options = bet.open ? sprintf('Options are %s.', bet.options.join(', ')) : ''

        this.say(
          '%s: betting is %s. %s %s',
          this.user,
          state,
          currentBet,
          options
        );
      }

      return;
    }

    if (!amount.match(/^\d+$/)) {
      // Assume arguments are swapped.
      var temp = option;
      option = amount;
      amount = temp;
    }

    var amount = parseInt(amount);

    if (isNaN(amount) || (amount < 1)) {
      this.say('%s: bet amount must be a positive integer. Format is !bet <amount> <option>', this.user);
      return;
    }

    if (!option) {
      this.say('%s: you must specify an option to bet on. Format is !bet <amount> <option>', this.user);
      return;
    }

    try {
      var result = await(bets.bet(this.user, amount, option));
      var verb = 'bet';
      if (result.updated) {
        verb = 'updated bet to';
      }
      this.say('%s: %s %s on %s.', this.user, verb, dkp(result.amount), result.option);
    } catch (e) {
      if (e instanceof BetError) {
        this.say(e.message);
      } else {
        Log.error(e);
        this.say('Unexpected error.');
      }
    }
  });
};
