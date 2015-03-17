var common = require('../../common'),
    async = common.async,
    await = common.await,
    sprintf = common.sprintf;

function Points(db) {
  var collection = db.collection('points');

  this.rank = async(function(points) {
    var count = await(collection.countAsync({ p: { $gt: points } }));
    return count + 1;
  });

  this.query = async(function(user) {
    var doc = await(collection.findOneAsync({ u: user }));

    var points = 0;
    if (doc) {
      points = doc.p
    }

    var rank = await(this.rank(points));

    return {
      points: points,
      rank: rank
    };
  });

  this.adjust = async(function(user, amount) {
    var doc = await(collection.findAndModifyAsync({ u: user }, null, { $inc: { p: amount } }, { new: true, upsert: true }));
    return doc[0].p;
  });

  this.user = function(string) {
    string = string.trim();
    if (string[0] == '@') {
      string = string.substr(1);
    }

    return string.toLowerCase();
  };

  this.userExists = async(function(user) {
    var joins = db.collection('joins');
    var parts = db.collection('parts');
    var messages = db.collection('messages');

    var docs = await({
      join: joins.findOneAsync({ u: user }, {}),
      part: parts.findOneAsync({ u: user }, {}),
      message: messages.findOneAsync({ u: user }, {})
    });

    return !!(docs.join || docs.part || docs.message);
  });

  this.display = function(points) {
    return dkp(points);
  };

  function commafy(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function dkp(points) {
    return sprintf('%s ₯', commafy(points));
  }
}

module.exports = Points;
