var common = require('../common'),
    OnMessage = common.OnMessage;

module.exports = function(db) {
  var messages = db.collection('messages');

  // Joins and parts are handled in greet.js.

  return new OnMessage(function() {
    messages.insertAsync({ u: this.user, t: this.message, d: new Date() });
  });
};
