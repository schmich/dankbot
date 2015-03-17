var Points = require('./points').Points;

module.exports = function(db) {
  var points = new Points(db);

  return [
    new require('./get')(points),
    new require('./gift')(points),
    new require('./award')(points),
    new require('./revoke')(points),
    new require('./leaderboard')(points)
  ];
};
