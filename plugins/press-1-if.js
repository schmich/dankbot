var common = require('../common'),
    async = common.async;

module.exports = function() {
  return {
    load: function(events) {
      events.on('message', async(function(channel, user, message, say) {
        if (m = message.match(/^\s*(press|hit|type|spam)\s+(.*?)\bif\b/i)) {
          say(m[2].trim());
        }
      }));
    }
  };
};
