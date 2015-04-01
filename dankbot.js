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

  var Periodic = require('./plugins/periodic');
  var Canned = require('./plugins/canned');

  dankbot
    .plugin(new Canned(/^\s*Kappa\s*$/, 'Kappa'))
    .plugin(new Canned(/\b(ty|thanks|danke|(thank you))\s+dank\s*bot/i, 'ur welcome'))
    .plugin(new Canned(/(jansoon\s*s\s*u\s*c\s*k\s*s?)|(f\s*u?\s*c\s*k\s*jansoon)|((yo)?u?\s*s\s*u\s*c\s*k\s*jansoon)/i, 'Manners! DansGame'))
    .plugin(new Canned(/f\s*u\s*c\s*k\s*d\s*a\s*n\s*k\s*b\s*o\s*t/i, "Oi, m8, I'll bust ye in de gabba! SwiftRage"))
    .plugin(new Canned('!songlist', 'https://www.nightbot.tv/songlist/real_jansoon'))
    .plugin(new Canned('!commands', 'List of commands under the stream m8. OMGScoots'))
    .plugin(new Canned(/control\s*warrior/i, 'Control warrio...ResidentSleeper'))
    .plugin(new Canned(/^\s*a\s*(y\s*)+(l\s*m\s*a\s*o\s*)?/i, 'BabyRage ayy lmao'))
    .plugin(new Canned(/oh\s*my\s*(goodness|damn|(da+y+u+m+))/i, 'https://www.youtube.com/watch?v=DcJFdCmN98s'))
    .plugin(new Canned(/(\bKreygasm\b.*\bdankbot)|(\bdankbot.*\bKreygasm\b)/, 'Kreygasm'))
    .plugin(new Canned(/^\s*Kappa\s*\/\s*$/, '\\Kappa'))
    .plugin(new Canned(/^\s*\\\s*Kappa\s*$/, 'Kappa/'))
    .plugin(new Canned(/^\s*o\s*\/\s*$/, '\\o'))
    .plugin(new Canned(/^\s*\\\s*o\s*$/, 'o/'))
    .plugin(new Canned('!dankbot', 'sup?'))
    .plugin(new Canned('!twitter', twitter))
    .plugin(new Canned('!donate', donate))
    .plugin(new Periodic(twitter, 0, 30 * 60 * 1000))
    .plugin(new Periodic(donate, 15 * 60 * 1000, 30 * 60 * 1000))
    .plugin(new require('./plugins/joke')())
    .plugin(new require('./plugins/uptime')())
    .plugin(new require('./plugins/console-log')())
    .plugin(new require('./plugins/mongo-log')(db))
    .plugin(new require('./plugins/respects')())
    .plugin(new require('./plugins/dududu')())
    .plugin(new require('./plugins/bye')())
    .plugin(new require('./plugins/greet')(db))
    .plugin(new require('./plugins/song-request')())
    .plugin(new require('./plugins/press-1-if')())
    .plugin(new require('./plugins/age')(db))
    .plugin(new require('./plugins/points')(db))
    .plugin(new require('./plugins/bets')(db))
    .join(channel);
});

if (process.argv.length < 3) {
  Log.error('Channel required.');
  process.exit(1);
}

var channel = process.argv[2];
run(channel).done();
