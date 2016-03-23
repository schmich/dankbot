var common = require('../../common'),
    Command = common.Command,
    canonicalUser = common.canonicalUser,
    dkp = common.dkp,
    await = common.await;

module.exports = function(points, userService) {
  return new Command('!revoke', function(user, amount) {
    if (this.user != this.channel) {
      return;
    }

    if (!amount.match(/^\d+$/)) {
      // Assume arguments are swapped.
      var temp = amount;
      amount = user;
      user = temp;
    }

    var target = canonicalUser(user);
    var amount = parseInt(amount);

    if (isNaN(amount)) {
      this.say('%s: points revoked must be a positive integer.', this.user);
      return;
    }

    amount = Math.abs(amount);

    if (!await(userService.exists(target))) {
      this.say('User %s does not exist.', target);
      return;
    }

    var newPoints = await(points.adjust(target, -amount));
    var newRank = await(points.rank(newPoints));

    this.say('Revoked %s from %s - Total %s (rank %d) Kappa', dkp(amount), target, dkp(newPoints), newRank);
  });
};
