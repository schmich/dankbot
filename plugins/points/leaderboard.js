var common = require('../../common'),
    Command = common.Command,
    await = common.await,
    dkp = common.dkp,
    sprintf = common.sprintf;

module.exports = function(points) {
  return new Command(/^\s*!(leaderboard|whiteknights)\b/, function() {
    var docs = await(points.leaderboard(10));

    var records = [];
    for (var i = 0; i < docs.length; ++i) {
      var doc = docs[i];
      records.push(sprintf("%d) %s %s", i + 1, doc.u, dkp(doc.p)));
    }

    this.say(records.join(' - '));
  });
};
