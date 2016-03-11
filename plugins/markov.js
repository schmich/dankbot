var common = require('../common'),
    Chance = require('chance'),
    await = common.await,
    async = common.async,
    sprintf = common.sprintf,
    OnChannel = common.OnChannel,
    OnMessage = common.OnMessage,
    Log = common.Log;

module.exports = function(channel, db) {
  function MarkovChainGenerator(markovCollection, degree) {
    this.chance = new Chance();

    this.generate = async(function() {
      var prevStates = [];
      for (var i = 0; i < degree; ++i) {
        prevStates.push(null);
      }

      var text = '';
      while (true) {
        var next = await(this.nextSymbol(prevStates));
        if (next.symbol == null) {
          break;
        }

        text += next.token + ' ';

        prevStates.shift();
        prevStates.push(next.symbol);
      }

      return text.trim();
    });

    this.nextSymbol = async(function(states) {
      var cursor = await(markovCollection.findAsync({ state: states })).batchSize(100);

      var options = [];
      var weights = [];
      while ((doc = await(cursor.nextObjectAsync())) != null) {
        options.push({ symbol: doc.next, token: doc.tokens[0] });
        weights.push(doc.count);
      }

      return this.chance.weighted(options, weights);
    });
  }

  var collection = db.collection(channel + '.2');
  var generator = new MarkovChainGenerator(collection, 2);

  var otherMessageCount = 0;

  return [
    new OnChannel(function() {
      var self = this;

      self.say('.color Red');

      setInterval(async(function() {
        if (otherMessageCount < 7) {
          return;
        }

        var message = await(generator.generate());

        Log.info(sprintf('Saying "%s"', message));
        self.say(message);
        otherMessageCount = 0;
      }), 9 * 60 * 1000);
    }),
    new OnMessage(function() {
      if (this.user != 'dankbot3000') {
        otherMessageCount++;
      }
    })
  ];
};
