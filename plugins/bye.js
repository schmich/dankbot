var common = require('../common'),
    _ = require('lodash'),
    async = common.async,
    sprintf = common.sprintf;

module.exports = function() {
  var byes = ['goodbye', 'bye', 'cya', 'peace', 'peace out', 'later', 'see ya'];

  var pattern = new RegExp(sprintf('(%s)\\s*dank\\s*bot', byes.join('|')), 'i');

  return {
    load: function(events) {
      events.on('message', async(function(channel, user, message, say) {
        if (message.match(pattern)) {
          say('%s %s o/', byes[_.random(byes.length - 1)], user);
        }
      }));
    }
  };
};
