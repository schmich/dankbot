var common = require('../common'),
    Set = require('collections/set'),
    Points = require('../lib/points').Points,
    async = common.async,
    await = common.await,
    sprintf = common.sprintf,
    Config = common.Config,
    Command = common.Command,
    OnChannel = common.OnChannel,
    OnMessage = common.OnMessage,
    Twitch = common.Twitch;

module.exports = function(db) {
  var liveUsers = {};
  var say = {};
  var partDelays = {};

  var joins = db.collection('joins');
  var parts = db.collection('parts');

  var userService = require('../lib/user')(db);
  var pointService = new Points(db);

  function onUserJoin(channel, user) {
    if (user != channel && user != Config.twitch.user) {
      var channelDelays = delays(channel);
      if (channelDelays[user]) {
        clearTimeout(channelDelays[user]);
        delete channelDelays[user];
      } else {
        var lastSeen = await(userService.lastSeen(user));
        var stats = await(pointService.query(user));

        if (lastSeen === null) {
          say[channel]('New viewer %s joined PogChamp Neva bin here befo!', user);
        } else {
          say[channel]('Welcome back %s 4Head Last here %s - %s (rank %d)', user, timeAgo(lastSeen), pointService.display(stats.points), stats.rank);
        }
      }
    }

    joins.insertAsync({ u: user, d: new Date() });
  }

  function onUserPart(channel, user) {
    parts.insertAsync({ u: user, d: new Date() });

    if (user == channel || user == Config.twitch.user) {
      return;
    }

    var channelDelays = delays(channel);
    channelDelays[user] = setTimeout(function() {
      clearTimeout(channelDelays[user]);
      delete channelDelays[user];
      say[channel]('%s left BibleThump...rip', user);
    }, 2 * 60 * 1000);
  }

  function timeAgo(timestamp) {
    var now = (new Date()).getTime();
    var elapsedSec = (now - timestamp) / 1000;

    var parts = [];

    var elapsedDay = Math.floor(elapsedSec / (60 * 60 * 24));
    if (elapsedDay > 0) {
      parts.push(elapsedDay + 'd');
      elapsedSec -= elapsedDay * (60 * 60 * 24);
    }

    var elapsedHr = Math.floor(elapsedSec / (60 * 60));
    if (elapsedHr > 0) {
      parts.push(elapsedHr + 'h');
      elapsedSec -= elapsedHr * (60 * 60);
    }

    var elapsedMin = Math.floor(elapsedSec / 60);
    if (elapsedMin > 0) {
      parts.push(elapsedMin + 'm');
    }

    if (parts.length > 0) {
      return parts.slice(0, 2).join(' ') + ' ago';
    } else {
      return 'just now';
    }
  }

  var updateLiveUsers = async(function(channel) {
    var url = sprintf('https://tmi.twitch.tv/group/user/%s/chatters', channel);
    var data = await(Twitch.request(url, false));

    var currentUsers = new Set()
      .addEach(data.chatters.moderators)
      .addEach(data.chatters.staff)
      .addEach(data.chatters.admins)
      .addEach(data.chatters.global_mods)
      .addEach(data.chatters.viewers);
  
    if (liveUsers[channel]) {
      var usersPart = liveUsers[channel].difference(currentUsers);
      var usersJoin = currentUsers.difference(liveUsers[channel]);

      usersPart.forEach(function(user) {
        onUserPart(channel, user);
      });

      usersJoin.forEach(function(user) {
        onUserJoin(channel, user);
      });
    }

    liveUsers[channel] = currentUsers;
  });

  function delays(channel, user) {
    var users = partDelays[channel];
    if (!users) {
      partDelays[channel] = users = {}
    }

    return users;
  }

  return [
    new OnChannel(function() {
      say[this.channel] = this.say;

      var channel = this.channel;

      updateLiveUsers(channel);

      setInterval(function() {
        updateLiveUsers(channel);
      }, 30 * 1000);
    }),
    new OnMessage(function() {
      clearTimeout(delays(this.channel)[this.user]);
    })
  ];
};
