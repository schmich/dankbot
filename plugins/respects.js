var common = require('../common'),
    await = common.await,
    Twitch = common.Twitch,
    Command = common.Command;

module.exports = function() {
  var lastF = {};

  return new Command(/^\s*F\s*$/, function() {
    var self = this;
    var last = lastF[this.channel];
    var now = +Date.now();

    if (!last || (now - last > (30 * 1000))) {
      setTimeout(function() {
        self.say('F');
      }, 5000);

      lastF[this.channel] = now;
    }
  });
};
