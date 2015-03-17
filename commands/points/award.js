var common = require('../../common'),
    Command = common.Command,
    await = common.await;

module.exports = function(points) {
  return new Command(/^\s*!award\s+/i, function(user, amount) {
    if (this.user != this.channel) {
      return;
    }

    var target = points.user(user);
    var amount = parseInt(amount);

    if (isNaN(amount)) {
      this.say('%s: points awarded must be an integer.', this.user);
      return;
    }

    if (!await(points.userExists(target))) {
      this.say('User %s does not exist.', target);
      return;
    }

    var newPoints = await(points.adjust(target, amount));
    var newRank = await(points.rank(newPoints));

    this.say('Awarded %s to %s - Total %s (rank %d) BloodTrail', points.display(amount), target, points.display(newPoints), newRank);
  });
};
