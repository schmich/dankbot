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

  dankbot
    .plugin(new Canned(/(jansoon\s*s\s*u\s*c\s*k\s*s?)|(f\s*u?\s*c\s*k\s*jansoon)|((yo)?u?\s*s\s*u\s*c\s*k\s*jansoon)/i, 'Manners! DansGame'))
    .plugin(new Canned(/f\s*u\s*c\s*k\s*d\s*a\s*n\s*k\s*b\s*o\s*t/i, "Oi, m8, I'll bust ye in de gabba! SwiftRage"))
    .plugin(new Canned('!songlist', 'https://www.nightbot.tv/songlist/real_jansoon'))
    .plugin(new Canned(/control\s*warrior/i, 'Control warrio...ResidentSleeper'))
    .plugin(new Canned(/^\s*a\s*(y\s*)+(l\s*m\s*a\s*o\s*)?/i, 'BabyRage ayy lmao'))
    .plugin(new Canned(/oh\s*my\s*(goodness|damn|(da+y+u+m+))/i, 'https://www.youtube.com/watch?v=DcJFdCmN98s'))
    .plugin(new Canned(/(\bKreygasm\b.*\bdankbot)|(\bdankbot.*\bKreygasm\b)/, 'Kreygasm'))
    .plugin(new Canned('!dankbot', 'sup?'))
    .plugin(new Canned('!twitter', twitter))
    .plugin(new Canned('!donate', donate))
    .plugin(new Periodic(twitter, 0, 30 * 60 * 1000))
    .plugin(new Periodic(donate, 15 * 60 * 1000, 30 * 60 * 1000))
    .plugin(new require('./commands/joke')())
    .plugin(new require('./commands/kappa')())
    .plugin(new require('./commands/uptime')())
    .plugin(new require('./commands/console-log')())
    .plugin(new require('./commands/mongo-log')(db))
    .plugin(new require('./commands/respects')())
    .plugin(new require('./commands/greets')())
    .plugin(new require('./commands/song-request')())
    .plugin(new require('./commands/age')(db))
    .plugin(new require('./commands/points')(db))
    .join(channel);
});

if (process.argv.length < 3) {
  Log.error('Channel required.');
  process.exit(1);
}

var channel = process.argv[2];
run(channel);
