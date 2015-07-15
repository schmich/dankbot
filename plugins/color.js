var common = require('../common'),
    OnChannel = common.OnChannel;

module.exports = function(color) {
  return new OnChannel(function() {
    this.say('.color ' + color);
  });
};
