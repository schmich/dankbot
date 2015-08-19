var common = require('./common'),
    Bot = require('./bot'),
    _ = require('lodash'),
    MongoClient = common.MongoClient,
    Config = common.Config,
    async = common.async,
    await = common.await,
    sprintf = common.sprintf,
    Log = common.Log,
    Twitch = common.Twitch,
    Points = require('./lib/points').Points;

var awardPoints = async(function(channel, awards, points) {
  Log.info('Attempting to award points.');

  var lastTimestamp = -Infinity;
  var lastAward = await(awards.findOneAsync({}, null, { sort: [['_id', 'desc']] }));
  if (lastAward) {
    lastTimestamp = lastAward.d;
  }

  var now = +Date.now();
  if ((now - lastTimestamp) < ((9 * 60 + 55) * 1000)) {
    Log.warn('Last points awarded too recently, skipping award.');
    return;
  }

  var streamUrl = sprintf('https://api.twitch.tv/kraken/streams/%s', channel);
  try {
    var streamResponse = await(Twitch.request(streamUrl));
  } catch (e) {
    Log.error('Unexpected error getting stream: ' + e);
    return;
  }

  if (!streamResponse) {
    Log.warn('Invalid stream response, skipping award.');
    return;
  }

  if (!streamResponse.stream) {
    Log.warn('Stream is offline, skipping award.');
    return;
  }

  Log.info('Stream is online.');

  var viewersUrl = sprintf('https://tmi.twitch.tv/group/user/%s/chatters', channel);
  try {
    var viewersResponse = await(Twitch.request(viewersUrl));
  } catch (e) {
    Log.error('Unexpected error getting viewers: ' + e);
    return;
  }

  if (!viewersResponse) {
    Log.warn('Invalid viewers response, skipping award.');
    return;
  }

  var chatters = viewersResponse.chatters;
  if (!chatters) {
    Log.warn('No chatters, skipping award.');
    return;
  }

  var ignored = ['dankbot3000', 'zambiechew', 'zambie_chew', 'nightbot', 'real_jansoon'];

  var viewers = _(chatters.moderators).union(
    chatters.staff,
    chatters.admins,
    chatters.global_mods,
    chatters.viewers
  ).map(function(n) {
    return n.toLowerCase().trim();
  }).difference(ignored).value();

  Log.info('Awarding points to: ' + viewers.join(', '));

  _.forEach(viewers, function(user) {
    await(points.adjust(user, 2));
  });

  await(awards.insertAsync({ d: now, u: viewers }));

  Log.info(sprintf('Award complete at %s (%d).', new Date(now), now));
});

var runAwardPoints = async(function(channel, awards, points) {
  await(awardPoints(channel, awards, points));

  setTimeout(async(function() {
    await(runAwardPoints(channel, awards, points));
  }), 1 * 60 * 1000);
});

var run = async(function(channel) {
  var db = await(MongoClient.connectAsync(Config.mongo));

  var awards = db.collection('awards');
  var points = new Points(db);

  await(runAwardPoints(channel, awards, points));
});

if (process.argv.length < 3) {
  Log.error('Channel required.');
  process.exit(1);
}

var channel = process.argv[2];
run(channel).done();
