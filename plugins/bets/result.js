var common = require('../../common'),
    BetError = require('../../lib/bets').BetError,
    Command = common.Command,
    Log = common.Log,
    await = common.await,
    dkp = common.dkp,
    sprintf = common.sprintf;

module.exports = function(bets) {
  return new Command('!result', function(result) {
    var self = this;

    if (this.user != this.channel) {
      return;
    }

    if (!result) {
      this.say('You must specify the winning option.');
      return;
    }

    try {
      var results = await(bets.resolve(result));
      var winners = results.winners;
      var losers = results.losers;

      this.say('★ %s wins it! Drum roll for results...', result);
      var showLosers = function() {
        var loserList = [];
        for (var i = 0; i < losers.length; ++i) {
          loserList.push(sprintf('%s -%s', losers[i].user, losers[i].points));
        }

        self.say(
          'PJSalt Losers (%d): %s',
          loserList.length,
          loserList.length == 0 ? 'no losers (aww)' : loserList.join(', ')
        );
      };

      var showWinners = function() {
        var winnerList = [];
        for (var i = 0; i < winners.length; ++i) {
          winnerList.push(sprintf('%s +%s', winners[i].user, winners[i].points));
        }

        self.say(
          'BloodTrail Winners (%d): %s',
          winnerList.length,
          winnerList.length == 0 ? 'no winners (rekt)' : winnerList.join(', ')
        );
      };

      setTimeout(showLosers, 3000);
      setTimeout(showWinners, 6000);
    } catch (e) {
      if (e instanceof BetError) {
        this.say('Error: ' + e.message);
      } else {
        Log.error(e);
        this.say('Unexpected error.');
      }
    }
  });
};
