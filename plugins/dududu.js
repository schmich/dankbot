var common = require('../common'),
    _ = require('lodash'),
    await = common.await,
    Twitch = common.Twitch,
    Command = common.Command;

module.exports = function() {
  var lastF = {};
  var countF = {};
  var reset = {};

  return new Command(/^\s*u*(\s*d+\s*u+\s*){2,}d*\s*$/i, function() {
    var self = this;

    var channel = this.channel;
    var last = lastF[channel] || 0;
    var now = Date.now();

    if (now - last > (2 * 60 * 1000)) {
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
          self.say(dududu());

          lastF[channel] = Date.now();
          countF[channel] = 0;
          clearTimeout(reset[channel]);
          delete reset[channel];
        }, _.random(2, 5) * 1000);
      }
    }
  });

  function dududu() {
    var message = '';
    for (var i = _.random(3, 4); i > 0; --i) {
      message += _.repeat(_.random(1, 2) == 1 ? 'D' : 'd', _.random(1, 2));
      message += _.repeat(_.random(1, 2) == 1 ? 'U' : 'u', _.random(1, 2));
    }

    return message;
  }
};
