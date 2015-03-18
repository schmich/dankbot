var common = require('../common'),
    url = require('url'),
    _ = require('lodash'),
    Command = common.Command,
    Config = common.Config,
    URI = common.URI,
    await = common.await,
    sprintf = common.sprintf
    json = common.json;

module.exports = function(points) {
  return new Command('!songrequest', function(arg) {
    if (!arg) {
      this.say('%s: format is !songrequest https://youtu.be/DcJFdCmN98s or !songrequest DcJFdCmN98s', this.user);
      return;
    }

    var url = URI('https://www.googleapis.com/youtube/v3/videos')
      .query({ part: 'id', id: videoId(arg), key: Config.youtube.key })
      .toString();

    var data = await(json(url));

    var valid = data && data.items && data.items.length;
    if (valid) {
      this.say('%s: gr8 request m8', this.user);
    } else {
      this.say('%s: invalid video, format is !songrequest https://youtu.be/DcJFdCmN98s or !songrequest DcJFdCmN98s', this.user);
    }
  });

  function videoId(idOrUrl) {
    // Formats:
    // ?v=FHxH0kkXWpY
    // v=FHxH0kkXWpY
    // FHxH0kkXWpY
    // watch?v=FHxH0kkXWpY
    // bit.ly/302

    var id = idOrUrl;
    var parts = url.parse(idOrUrl);

    if (parts.host && parts.host.match(/\.youtube\./i)) {
      var params = querystring.parse(parts.query);
      id = params.v || id;
    } else if (parts.host && parts.host.match(/youtu\.be/i)) {
      var paths = parts.path.split('/');
      id = _.filter(paths, function(p) { return p; })[0] || id;
    }
    
    /* else if (!parts.host && parts.pathname && parts.pathname.match(/^\/?watch\b/i)) {
      var params = querystring.parse(parts.query);
      id = params.v || id;
    } */

    return id;
  }
};
