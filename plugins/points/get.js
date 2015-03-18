var common = require('../../common'),
    Command = common.Command,
    canonicalUser = common.canonicalUser,
    await = common.await;

module.exports = function(points) {
  return new Command(/^\s*!(dankness|dkp|dankpoints|points|epeen|rank)(\s+|$)/i, function(user) {
    var user = canonicalUser(user) || this.user;

    var stats = await(points.query(user));
    this.say('%s has %s (rank %d)', user, points.display(stats.points), stats.rank);
  });
};
