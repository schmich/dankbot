var common = require('../common'),
    async = common.async;
    await = common.await;

function User(db) {
  this.joins = db.collection('joins');
  this.parts = db.collection('parts');

  this.lastSeen = async(function(user) {
    var docs = {
      join: await(this.joins.findOneAsync({ u: user }, { d: 1 }, { sort: [['d', 'desc']] })),
      part: await(this.parts.findOneAsync({ u: user }, { d: 1 }, { sort: [['d', 'desc']] }))
    };

    var lastSeen = Math.max(
      docs.join ? docs.join.d.getTime() : 0,
      docs.part ? docs.part.d.getTime() : 0
    );

    return lastSeen == 0 ? null : lastSeen;
  });
}

module.exports = function(db) {
  return new User(db);
};
