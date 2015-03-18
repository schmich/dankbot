var common = require('../common'),
    await = common.await,
    sprintf = common.sprintf,
    Twitch = common.Twitch,
    Command = common.Command;

module.exports = function() {
  return new Command('!uptime', function(user) {
    user = user || this.channel;

    var url = sprintf('https://api.twitch.tv/kraken/streams/%s', user);
    var data = await(Twitch.request(url));

    if (!data.stream) {
      this.say('Not streaming');
      return;
    }

    var msec = Date.now() - +(new Date(data.stream.created_at));
    var min = Math.floor(msec / 1000 / 60);

    var uptime = '';
    if (min > 60) {
      var hr = Math.floor(min / 60);
      min -= hr * 60;
      uptime = sprintf('%d hour%s, ', hr, hr == 1 ? '' : 's');
    }

    uptime += sprintf('%d minute%s', min, min == 1 ? '' : 's');

    this.say(uptime);
  });
};
