var common = require('../common'),
    await = common.await,
    request = common.request,
    Command = common.Command;

module.exports = function() {
  return new Command('!joke', function() {
    var result = await(request.getAsync('http://api.icndb.com/jokes/random'));
    var data = JSON.parse(result[0].body);
    this.say(data.value.joke);
  });
};
