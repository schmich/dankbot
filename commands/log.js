var common = require('../common'),
    await = common.await,
    sprintf = common.sprintf,
    Log = common.Log,
    OnMessage = common.OnMessage,
    OnJoin = common.OnJoin,
    OnPart = common.OnPart;

module.exports = function() {
  return [
    new OnMessage(function() {
      Log.info(sprintf('[%s] %s: %s', this.channel, this.user, this.message));
    }),
    new OnJoin(function() {
      Log.info(sprintf('[%s] >>> %s', this.channel, this.user));
    }),
    new OnPart(function() {
      Log.info(sprintf('[%s] <<< %s', this.channel, this.user));
    })
  ];
};
