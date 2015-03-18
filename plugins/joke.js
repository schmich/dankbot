var common = require('../common'),
    await = common.await,
    json = common.json,
    Command = common.Command;

module.exports = function() {
  return new Command('!joke', function() {
    var data = await(json('http://api.icndb.com/jokes/random'));
    
    if (!data || !data.value || !data.value.joke) {
      this.say('Failed to get joke :(');
      return;
    }

    this.say(data.value.joke) ;
  });
};
