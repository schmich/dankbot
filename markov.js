var common = require('./common'),
    Bot = require('./bot'),
    MongoClient = common.MongoClient,
    Config = common.Config,
    async = common.async,
    await = common.await,
    Log = common.Log;

var run = async(function(channel) {
  var dankbot = new Bot(Config.markov.user, Config.markov.oauth);

  var db = await(MongoClient.connectAsync(Config.markov.db));

  dankbot
    .plugin(new require('./plugins/markov')(channel, db))
    .join(channel);
});

if (process.argv.length < 3) {
  Log.error('Channel required.');
  process.exit(1);
}

var channel = process.argv[2];
run(channel).done();
