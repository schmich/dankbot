var common = require('../common'),
    async = common.async,
    await = common.await,
    sprintf = common.sprintf;

function InsufficientPoints(points) {
  this.points = points;
}

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

  this.transfer = async(function(from, to, amount) {
    var doc = await(collection.findOneAsync({ u: from }));

    var fromPoints = 0;
    if (doc) {
      fromPoints = doc.p;
    }

    if (amount > fromPoints) {
      throw new InsufficientPoints(fromPoints);
    }

    await(collection.findAndModifyAsync({ u: to }, null, { $inc: { p: amount } }, { new: true, upsert: true }));
    await(collection.updateAsync({ u: from }, { $inc: { p: -amount } }));
  });

  this.leaderboard = async(function(count) {
    return await(collection.find({}).sort({ p: -1 }).limit(count).toArrayAsync());
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

module.exports = {
  Points: Points,
  InsufficientPoints: InsufficientPoints
}
