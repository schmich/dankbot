var common = require('../common'),
    OnChannel = common.OnChannel;

module.exports = function(message, offset, interval) {
  return new OnChannel(function() {
    var self = this;
    setTimeout(function() {
      setInterval(function() {
        self.say(message);
      }, interval);
    }, offset);
  });
};
