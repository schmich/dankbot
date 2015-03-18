var Points = require('../../lib/points').Points;

module.exports = function(db) {
  var points = new Points(db);
  var userService = require('../../lib/user')(db);

  return [
    new require('./get')(points),
    new require('./gift')(points, userService),
    new require('./award')(points, userService),
    new require('./revoke')(points, userService),
    new require('./leaderboard')(points)
  ];
};
