var common = require('../common'),
    await = common.await,
    Twitch = common.Twitch,
    Command = common.Command;

module.exports = function() {
  var lastF = {};
  var countF = {};
  var reset = {};

  return new Command(/^\s*F\s*$/i, function() {
    var self = this;

    var channel = this.channel;
    var last = lastF[channel] || 0;
    var now = Date.now();

    if (now - last > (60 * 1000)) {
      countF[channel] = countF[channel] || 0;
      countF[channel]++;

      if (reset[channel]) {
        clearTimeout(reset[channel]);
      }

      reset[channel] = setTimeout(function() {
        countF[channel] = 0;
        clearTimeout(reset[channel]);
        delete reset[channel];
      }, 15 * 1000);

      if (countF[channel] == 2) {
        setTimeout(function() {
          self.say('F');
          lastF[channel] = Date.now();
          countF[channel] = 0;
          clearTimeout(reset[channel]);
          delete reset[channel];
        }, 1000);
      }
    }
  });
};
