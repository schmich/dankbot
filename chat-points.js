var common = require('./common'),
    Bot = require('./bot'),
    MongoClient = common.MongoClient,
    Config = common.Config,
    async = common.async,
    await = common.await,
    Log = common.Log;

var run = async(function(channel) {
  var dankbot = new Bot("justinfan0", "");

  var db = await(MongoClient.connectAsync(Config.mongo));

  dankbot
    .plugin(new require('./plugins/chat-points')(db, channel))
    .join(channel);
});

if (process.argv.length < 3) {
  Log.error('Channel required.');
  process.exit(1);
}

var channel = process.argv[2];
run(channel).done();
