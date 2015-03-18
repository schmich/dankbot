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
  var db = await(MongoClient.connectAsync(Config.mongo));

  var app = express();

  app.get('/', function(req, res) {
    res.write('<html><head><meta charset="UTF-8"></head><body><pre>');
    var cursor = db.collection('messages').find();
    cursor.each(function(err, doc) {
      if (doc === null) {
        res.end('</pre></body></html>');
      } else {
        res.write(doc.d + ': ' + doc.u + ': ' + escapeHtml(doc.t) + '\n');
      }
    });
  });

  app.listen(port, '0.0.0.0', function() {
    console.log('Listening on port ' + port + '.');
  });
});

run(1337);
