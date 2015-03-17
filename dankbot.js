var common = require('./common'),
    Bot = require('./bot'),
    MongoClient = common.MongoClient,
    Config = common.Config,
    async = common.async,
    await = common.await,
    Log = common.Log;

var run = async(function(channel) {
  var dankbot = new Bot();

  var db = await(MongoClient.connectAsync(Config.mongo));

  var twitter = 'Follow jansoon https://twitter.com/jansoon SwiftRage';
  var donate = 'Donate to jansoon https://www.twitchalerts.com/donate/real_jansoon Kreygasm';

  var Periodic = require('./commands/periodic');
  var Canned = require('./commands/canned');

  dankbot.plugin(new Canned('!songlist', 'https://www.nightbot.tv/songlist/real_jansoon'));
  dankbot.plugin(new Canned('!dankbot', 'sup?'));
  dankbot.plugin(new Canned('!twitter', twitter));
  dankbot.plugin(new Canned('!donate', donate));
  dankbot.plugin(new Periodic(twitter, 0, 30 * 60 * 1000));
  dankbot.plugin(new Periodic(donate, 15 * 60 * 1000, 30 * 60 * 1000));
  dankbot.plugin(new require('./commands/joke')());
  dankbot.plugin(new require('./commands/kappa')());
  dankbot.plugin(new require('./commands/uptime')());
  dankbot.plugin(new require('./commands/log')());
  dankbot.plugin(new require('./commands/respects')());
  dankbot.plugin(new require('./commands/greets')());
  dankbot.plugin(new require('./commands/age')(db));
  dankbot.plugin(new require('./commands/points')(db));

  dankbot.join(channel);
});

if (process.argv.length < 3) {
  Log.error('Channel required.');
  process.exit(1);
}

var channel = process.argv[2];
run(channel);
