var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Config = require('./config');
var Promise = require('bluebird');
var mongodb = Promise.promisifyAll(require('mongodb'));
var Log = require('winston');
var sprintf = require('sprintf');
var moment = require('moment');
var URI = require('urijs');
var MongoClient = mongodb.MongoClient;
var Collection = mongodb.Collection;
var request = Promise.promisifyAll(require('request'));
var plugin = require('./plugin');

Log.remove(Log.transports.Console);
Log.add(Log.transports.Console, { timestamp: function() { return moment().format(); } });

function sleep(duration) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, duration);
  });
}

function canonicalUser(user) {
  if (!user) {
    return null;
  }

  user = user.trim();
  if (user[0] == '@') {
    user = user.substr(1);
  }

  return user.toLowerCase();
}

function dkp(points) {
  function commafy(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return sprintf('%s ₯', commafy(points));
}

var json = async(function(url) {
  var response = await(request.getAsync(url));

  if (!response) {
    return null;
  }

  var body = response[0].body;
  return JSON.parse(body);
});

function Twitch() {
}

Twitch.lastRequest = Date.now();

Twitch.request = async(function(url, headers) {
  var now = Date.now();
  var wait = Math.max(1 - (now - Twitch.lastRequest), 0);
  await(sleep(wait));

  var tries = 0;
  var maxTries = 5;

  var options = { url: url };

  if (headers !== false) {
    options.headers = {
      'Accept': 'application/vnd.twitchtv.v3+json',
      'Client-ID': 'dankbot (https://github.com/schmich/dankbot)'
    };
  }

  while (true) {
    ++tries;

    Log.info(sprintf('Requesting %s.', options.url));

    var response = await(request.getAsync(options));
    var body = response[0].body;

    var statusCode = response[0].statusCode;
    if (statusCode != 200) {
      Log.error(sprintf('Unexpected status code: %d\nResponse: %s', statusCode, body));
      if (tries == maxTries) {
        throw new Error(sprintf('Max tries exceeded for %s.', options.url));
      }

      Log.info(sprintf('Try %d of %d, waiting for 5s.', tries, maxTries));
      await(sleep(5000));
      continue;
    }

    Twitch.lastRequest = now;
    
    return JSON.parse(body);
  }
});

module.exports = {
  async: async,
  await: await,
  Config: Config,
  request: request,
  json: json,
  Log: Log,
  sprintf: sprintf,
  URI: URI,
  MongoClient: MongoClient,
  Twitch: Twitch,
  Promise: Promise,
  sleep: sleep,
  dkp: dkp,
  canonicalUser: canonicalUser,
  moment: moment,
  Command: plugin.Command,
  OnMessage: plugin.OnMessage,
  OnChannel: plugin.OnChannel,
  OnJoin: plugin.OnJoin,
  OnPart: plugin.OnPart
};
