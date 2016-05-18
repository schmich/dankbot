var common = require('../common'),
    sprintf = common.sprintf,
    async = common.async;

module.exports = function(pattern, timeoutSeconds) {
  return {
    load: function(events) {
      events.on('message', async(function(channel, user, message, say) {
        if (message.match(pattern) && (user.toLowerCase() !== channel.toLowerCase())) {
          unsafeSay(sprintf('.timeout %s %d', user, timeoutSeconds));
          say(sprintf('%s rekt EleGiggle', user));
        }
      }));
    }
  };
};
