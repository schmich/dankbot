var common = require('../common'),
    await = common.await,
    sprintf = common.sprintf,
    Log = common.Log,
    OnMessage = common.OnMessage,
    OnJoin = common.OnJoin,
    OnPart = common.OnPart;

module.exports = function(db) {
  var messages = db.collection('messages');
  var joins = db.collection('joins');
  var parts = db.collection('parts');

  return [
    new OnMessage(function() {
      messages.insertAsync({ u: this.user, t: this.message, d: new Date() });
    }),
    new OnJoin(function() {
      joins.insertAsync({ u: this.user, d: new Date() });
    }),
    new OnPart(function() {
      parts.insertAsync({ u: this.user, d: new Date() });
    })
  ];
};
