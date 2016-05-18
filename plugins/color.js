var common = require('../common'),
    OnChannel = common.OnChannel;

module.exports = function(color) {
  return new OnChannel(function() {
    this.unsafeSay('.color ' + color);
  });
};
