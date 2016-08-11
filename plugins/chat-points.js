var common = require('../common'),
    _ = require('lodash'),
    async = common.async,
    await = common.await,
    OnMessage = common.OnMessage,
    sprintf = common.sprintf,
    Log = common.Log,
    Twitch = common.Twitch,
    Points = require('../lib/points').Points;

module.exports = function(db, channel) {
  var points = new Points(db);

  var messages = {};

  var awardPoints = async(function () {
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

    var ignored = ['dankbot3000', 'zambiechew', 'zambie_chew', 'nightbot', 'real_jansoon'];

    var users = _(messages).omit(ignored).keys().value();
    if (users.length > 0) {
      Log.info('Awarding points to: ' + users.join(', '));

      for (var user in messages) {
        user = user.toLowerCase();
        await(points.adjust(user, 2));
      }
    }

    messages = {};
  });

  setInterval(async(function () {
    await(awardPoints());
  }), 5 * 60 * 1000);

  return new OnMessage(function() {
    messages[this.user] = messages[this.user] || 0;
    messages[this.user]++;
  });
};
