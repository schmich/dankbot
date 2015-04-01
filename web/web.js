var common = require('../common'),
    MongoClient = common.MongoClient,
    Config = common.Config,
    async = common.async,
    await = common.await,
    express = require('express');

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

var run = async(function(port) {
  var app = express();

  app.get('/', async(function(req, res) {
    var db = await(MongoClient.connectAsync(Config.mongo));

    res.write('<html><head><meta charset="UTF-8"></head><body><pre>');

    var cursor = await(db.collection('messages').findAsync());
    while ((doc = await(cursor.nextObjectAsync())) != null) {
      res.write(doc.d + ': ' + doc.u + ': ' + escapeHtml(doc.t) + '\n');
    }

    res.end('</pre></body></html>');

    cursor.close();
    db.close();
  }));

  app.listen(port, '0.0.0.0', function() {
    console.log('Listening on port ' + port + '.');
  });
});

run(1337);
