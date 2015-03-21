var common = require('../../common'),
    Command = common.Command,
    await = common.await,
    sprintf = common.sprintf;

module.exports = function(bets) {
  return new Command('!killbet', function() {
    if (this.user != this.channel) {
      return;
    }

    var killed = await(bets.kill());
    if (killed) {
      this.say('Bet was killed. No points won or lost.');
    } else {
      this.say('No bet is open. Use !openbet.');
    }
  });
};
