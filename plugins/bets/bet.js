var common = require('../../common'),
    BetError = require('../../lib/bets').BetError,
    Command = common.Command,
    Log = common.Log,
    await = common.await,
    sprintf = common.sprintf,
    dkp = common.dkp;

module.exports = function(bets) {
  return new Command('!bet', function(amount, option) {
    var amount = parseInt(amount);
    if (isNaN(amount) || (amount < 1)) {
      this.say('%s: bet amount must be a positive integer.', this.user);
      return;
    }

    if (!option) {
      this.say('%s: you must specify an option to bet on.', this.user);
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
