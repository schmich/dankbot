var common = require('../common'),
    _ = require('lodash'),
    Points = require('./points').Points,
    async = common.async,
    await = common.await,
    dkp = common.dkp,
    sprintf = common.sprintf;

function BetError(message) {
  this.message = message;
}

function Bets(db) {
  var bets = db.collection('bets');
  var pointsService = new Points(db);

  this.open = async(function(options) {
    for (var i = 0; i < options.length; ++i) {
      options[i] = options[i].trim().toLowerCase();
    }

    var now = Date.now();
    var openBet = await(bets.findAndModifyAsync(
      { result: null },
      null,
      {
        $setOnInsert: {
          timestamp: now,
          open: true,
          result: null,
          options: options,
          bets: []
        }
      },
      { new: true, upsert: true }
    ));

    if (openBet[0].timestamp == now) {
      return openBet[0];
    } else {
      return null;
    }
  });

  this.close = async(function() {
    var doc = await(bets.findAndModifyAsync(
      { open: true },
      null,
      { $set: { open: false } },
      { new: true, upsert: false }
    ));

    return doc[0];
  });

  this.kill = async(function() {
    var doc = await(bets.findAndModifyAsync(
      { result: null },
      [['timestamp', 'desc']], 
      null,
      { remove: true }
    ));

    return doc != null;
  });

  this.bet = async(function(user, amount, option) {
    var bet = await(bets.findOneAsync({ open: true }));
    if (!bet) {
      throw new BetError(sprintf('%s: betting is not open.', user));
    }

    option = option.trim().toLowerCase();
    if (!_.includes(bet.options, option)) {
      throw new BetError(sprintf('%s: invalid option. Options are: %s.', user, bet.options.join(', ')));
    }

    var points = await(pointsService.points(user));
    if (amount > points) {
      throw new BetError(sprintf('%s: you cannot bet %s, you only have %s.', user, dkp(amount), dkp(points)));
    }

    var remove = await(bets.updateAsync(
      { open: true, 'bets.user': user },
      {
        $pull: {
          bets: { user: user }
        }
      },
      { upsert: false }
    ));

    var doc = await(bets.findAndModifyAsync(
      { open: true },
      null,
      {
        $push: {
          bets: {
            user: user,
            points: amount,
            option: option
          }
        }
      },
      { new: true, upsert: false }
    ));

    return {
      user: user,
      amount: amount,
      option: option,
      updated: (remove[0] != 0)
    };
  });

  this.resolve = async(function(result) {
    var bet = await(bets.findOneAsync({ open: false, result: null }));
    if (!bet) {
      throw new BetError('No unresolved bets or betting is still open.');
    }

    var userBets = bet.bets;
    var options = bet.options;

    result = result.trim().toLowerCase();
    if (!_.includes(options, result)) {
      throw new BetError(sprintf('Invalid option. Options are: %s.', options.join(', ')));
    }

    var doc = await(bets.findAndModifyAsync(
      { result: null },
      [['timestamp', 'desc']], 
      { $set: { result: result } },
      { new: true }
    ));

    if (!doc[0]) {
      throw new BetError('Failed to set bet result.');
    }

    var losers = [];
    var winners = [];
    var losersTotal = 0;
    var winnersTotal = 0;

    for (var i = 0; i < userBets.length; ++i) {
      var points = userBets[i].points;
      if (userBets[i].option != result) {
        losersTotal += points;
        losers.push({ user: userBets[i].user, points: points });
      } else {
        winnersTotal += points;
        winners.push({ user: userBets[i].user, points: points });
      }
    }

    for (var i = 0; i < winners.length; ++i) {
      var pointsBet = winners[i].points;
      var ratio = pointsBet / winnersTotal;
      var pointsWon = Math.ceil(ratio * losersTotal);
      winners[i].points = pointsWon;
    }

    for (var i = 0; i < winners.length; ++i) {
      pointsService.adjust(winners[i].user, winners[i].points);
    }

    for (var i = 0; i < losers.length; ++i) {
      pointsService.adjust(losers[i].user, -losers[i].points);
    }

    return {
      losers: _(losers).sortBy('points').value().reverse(),
      winners: _(winners).sortBy('points').value().reverse()
    };
  });
}

module.exports = {
  Bets: Bets,
  BetError: BetError
};
