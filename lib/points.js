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
    var points = await(this.points(user));
    var rank = await(this.rank(points));

    return {
      points: points,
      rank: rank
    };
  });

  this.points = async(function(user) {
    var doc = await(collection.findOneAsync({ u: user }));

    var points = 0;
    if (doc) {
      points = doc.p
    }

    return points;
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
}

module.exports = {
  Points: Points,
  InsufficientPoints: InsufficientPoints
}
