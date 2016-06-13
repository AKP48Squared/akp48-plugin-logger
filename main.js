'use strict';
var c = require('irc-colors');

class Logger extends global.AKP48.pluginTypes.MessageHandler {
  constructor(AKP48) {
    super(AKP48, 'logger');
  }

  load() {
    this._AKP48.on('sendMsg', this.handleSentMessage);
    this._AKP48.on('fullMsg', this.handleFullMessage);
  }
}

Logger.prototype.handleFullMessage = function (context) {
  var out = `<=== ${context.instanceId()}:${context.to()} | ${context.nick()} | ${c.stripColorsAndStyle(context.text())}`;
  global.logger.stupid(out);
};

Logger.prototype.handleSentMessage = function (context) {
  var xtra = '';
  if(context.isEmote) {xtra = '/me ';}
  var out = `===> ${context.instanceId()}:${context.to()} | ${(context.myNick() ? context.myNick() + ' | ' : '')}${xtra}${c.stripColorsAndStyle(context.text())}`;

  //send logging message on next tick, to let the event queue finish first.
  process.nextTick(() => {
    global.logger.stupid(out);
  });
};

module.exports = Logger;
