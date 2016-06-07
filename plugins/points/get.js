var common = require('../../common'),
    Command = common.Command,
    canonicalUser = common.canonicalUser,
    dkp = common.dkp,
    await = common.await;

module.exports = function(points) {
  return new Command(/^\s*!(dankness|dp|dkp|dankpoints|points|epeen|rank)(\s+|$)/i, function(user) {
    var user = canonicalUser(user) || this.user;

    if (user === this.channel) {
      this.say('%s has ∞ ₯ deIlluminati', user);
      return;
    }

    var stats = null;
    if (user.match(/^\d+$/)) {
      var position = +user;
      if (position <= 0) {
        this.say('%s: you must specify a rank of 1 or higher.', this.user);
        return;
      } else {
        stats = await(points.queryPosition(position));
      }
    } else {
      stats = await(points.query(user));
    }

    if (!stats) {
      this.say('%s: unknown user or rank %s.', this.user, user);
      return;
    }

    this.say('%s has %s (rank %d)', stats.user, dkp(stats.points), stats.rank);
  });
};
