var async = require('asyncawait/async');
var await = require('asyncawait/await');

function OnMessage(handler) {
  var self = this;

  this.handler = async(handler);

  this.load = function(events) {
    events.on('message', async(function(channel, user, message, say, unsafeSay) {
      self.channel = channel;
      self.user = user;
      self.message = message;
      self.say = say;
      self.unsafeSay = unsafeSay;

      self.handler();
    }));
  };
}

function Command(command, handler) {
  var self = this;

  this.command = command;
  this.handler = async(handler);

  return new OnMessage(function() {
    self.channel = this.channel;
    self.user = this.user;
    self.message = this.message;
    self.say = this.say;
    self.unsafeSay = this.unsafeSay;

    if (self.command instanceof RegExp) {
      if (self.message.match(self.command)) {
        var args = self.message.split(/\s+/);
        args.shift();

        for (var i = 0; i < args.length; ++i) {
          args[i] = args[i].trim();
        }

        self.handler.apply(self, args);
      }
    } else if ((self.command instanceof String) || (typeof self.command == 'string')) {
      self.message = self.message.trim();

      var pattern = new RegExp('^\\s*' + self.command + '(\\s+|$)', 'i');
      if (self.message.match(pattern)) {
        var args = self.message.split(/\s+/);
        args.shift();

        for (var i = 0; i < args.length; ++i) {
          args[i] = args[i].trim();
        }

        self.handler.apply(self, args);
      }
    }
  });
}

function OnChannel(handler) {
  var self = this;
  
  this.handler = async(handler);

  this.load = function(events) {
    events.on('channel', async(function(channel, say, unsafeSay) {
      self.channel = channel;
      self.say = say;
      self.unsafeSay = unsafeSay;

      self.handler();
    }));
  };
}

function OnJoin(handler) {
  var self = this;

  this.handler = async(handler);

  this.load = function(events) {
    events.on('join', async(function(channel, user, say, unsafeSay) {
      self.channel = channel;
      self.user = user;
      self.say = say;
      self.unsafeSay = unsafeSay;

      self.handler();
    }));
  };
}

function OnPart(handler) {
  var self = this;

  this.handler = async(handler);

  this.load = function(events) {
    events.on('part', async(function(channel, user, say, unsafeSay) {
      self.channel = channel;
      self.user = user;
      self.say = say;
      self.unsafeSay = unsafeSay;

      self.handler();
    }));
  };
}

module.exports = {
  Command: Command,
  OnMessage: OnMessage,
  OnChannel: OnChannel,
  OnJoin: OnJoin,
  OnPart: OnPart
};
