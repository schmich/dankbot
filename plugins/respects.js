var common = require('../common'),
    await = common.await,
    Twitch = common.Twitch,
    Command = common.Command;

module.exports = function() {
  var lastF = {};
  var countF = {};

  return new Command(/^\s*F\s*$/i, function() {
    var self = this;

    var channel = this.channel;
    var last = lastF[channel] || 0;
    var now = Date.now();

    if (now - last > (30 * 1000)) {
      countF[channel] = countF[channel] || 0;
      countF[channel]++;

      if (countF[channel] == 2) {
        setTimeout(function() {
          self.say('F');
          lastF[channel] = Date.now();
          countF[channel] = 0;
        }, 1000);
      }
    }
  });
};
