var common = require('../common'),
    await = common.await,
    moment = common.moment,
    Command = common.Command;

module.exports = function(db) {
  var joins = db.collection('joins');

  return new Command('!age', function(user) {
    user = user || this.user;

    var doc = await(joins.findOneAsync({ u: user }, { d: 1 }, { sort: [['d', 'asc']] }));

    if (!doc) {
      this.say('Hmm, never seen %s.', user);
    } else {
      var firstSeen = moment(doc.d);
      var ageDays = moment().diff(firstSeen, 'days');
      this.say('First saw %s on %s (%dd ago).', user, firstSeen.format('YYYY/MM/DD'), ageDays);
    }
  });
};
