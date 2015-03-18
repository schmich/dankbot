var common = require('../../common'),
    Command = common.Command,
    await = common.await,
    sprintf = common.sprintf;

module.exports = function(points) {
  return new Command('!leaderboard', function() {
    var docs = await(points.leaderboard(5));

    var records = [];
    for (var i = 0; i < docs.length; ++i) {
      var doc = docs[i];
      records.push(sprintf("%d) %s %s", i + 1, doc.u, points.display(doc.p)));
    }

    this.say(records.join(' - '));
  });
};
