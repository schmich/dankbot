var common = require('../../common'),
    Command = common.Command,
    await = common.await,
    sprintf = common.sprintf;

module.exports = function(bets) {
  return new Command('!openbet', function() {
    if (this.user != this.channel) {
      return;
    }

    var options = Array.prototype.slice.call(arguments);
    if (options.length < 2) {
      this.say('You must specify at least two options.');
      return;
    }

    var created = await(bets.open(options));

    if (created) {
      var message = sprintf(
        'Betting is now open. Options are: %s. Use !bet <amount> <option> to bet, e.g. !bet 20 %s',
        created.options.join(', '),
        created.options[0]
      );
      this.say(message);
    } else {
      this.say('A bet is already open or is unresolved. Use !killbet or !result.');
    }
  });
};
