var common = require('./common'),
    Bot = require('./bot'),
    MongoClient = common.MongoClient,
    Config = common.Config,
    async = common.async,
    await = common.await,
    Log = common.Log;

var run = async(function(channel) {
  var dankbot = new Bot(Config.twitch.user, Config.twitch.oauth);

  var db = await(MongoClient.connectAsync(Config.mongo));

  var twitter = 'Follow Senpai https://twitter.com/jansoon SwiftRage';
  var donate = '[̲̅$̲̅(̲̅2)̲̅$̲̅] or more dongerbills to hear your dank meme read by robot voice https://www.twitchalerts.com/donate/real_jansoon Kreygasm';
  var reddit = 'Rarest of pepes here: https://www.reddit.com/r/jansoon/ OSfrog';

  var Periodic = require('./plugins/periodic');
  var Canned = require('./plugins/canned');
  var Timeout = require('./plugins/timeout');

  dankbot
    .plugin(new Canned(/^\s*Kappa\s*$/, 'Kappa'))
    .plugin(new Canned(/^\s*KappaPride\s*$/, 'KappaPride'))
    .plugin(new Canned(/(jansoon\s*s\s*u\s*c\s*k\s*s?)|(f\s*u?\s*c\s*k\s*jansoon)|((yo)?u?\s*s\s*u\s*c\s*k\s*jansoon)/i, 'Manners! DansGame'))
    .plugin(new Canned(/f\s*u\s*c\s*k\s*d\s*a\s*n\s*k\s*b\s*o\s*t/i, "Oi, m8, I'll bust ye in de gabba! SwiftRage"))
    .plugin(new Canned('!songlist', 'https://www.nightbot.tv/songlist/real_jansoon'))
    .plugin(new Canned('!commands', 'List of commands under the stream m8. OMGScoots'))
    .plugin(new Canned(/control\s*warrior/i, 'Control warr... ResidentSleeper'))
    .plugin(new Canned(/^\s*a\s*(y\s*)+(l\s*m\s*a\s*o\s*)?/i, 'BabyRage ayy lmao'))
    .plugin(new Canned(/oh\s*my\s*(goodness|damn|(da+y+u+m+))/i, 'https://www.youtube.com/watch?v=DcJFdCmN98s'))
    .plugin(new Canned(/(\bKreygasm\b.*\b@?dankbot)|(\b@?dankbot.*\bKreygasm\b)/i, 'Kreygasm'))
    .plugin(new Canned(/^\s*@?dankbot(3000)?\s*!?\s*$/i, 'sup DatSheffy'))
    .plugin(new Canned(/^\s*Kappa\s*\/\s*$/, '\\ Kappa'))
    .plugin(new Canned(/^\s*\\\s*Kappa\s*$/, 'Kappa /'))
    .plugin(new Canned(/^\s*o\s*\/\s*$/, '\\o'))
    .plugin(new Canned(/^\s*\\\s*o\s*$/, 'o/'))
    .plugin(new Canned(/\bpoor\s*dankbot\b/i, 'BibleThump'))
    .plugin(new Canned('!downtime', 'Downtime? Never! SwiftRage'))
    .plugin(new Canned('!dankbot', 'sup?'))
    .plugin(new Canned('!twitter', twitter))
    .plugin(new Canned('!donate', donate))
    .plugin(new Canned('!reddit', reddit))
    .plugin(new Periodic(twitter, 0, 30 * 60 * 1000))
    .plugin(new Periodic(donate, 10 * 60 * 1000, 30 * 60 * 1000))
    .plugin(new Periodic(reddit, 20 * 60 * 1000, 30 * 60 * 1000))
    .plugin(new Timeout(/\bstrawpoii\.me\b/i, 60))
    .plugin(new Timeout(/\bapo\.af\b/i, 60))
    .plugin(new require('./plugins/color')('GoldenRod'))
    .plugin(new require('./plugins/thanks')())
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
