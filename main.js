'use strict';
const TextDecorator = new (global.AKP48.TextDecorator)();

class Logger extends global.AKP48.pluginTypes.MessageHandler {
  constructor(AKP48) {
    super(AKP48, 'logger');
  }

  load() {
    this._AKP48.on('logMsg', this.handleSentMessage);
    this._AKP48.on('fullMsg', this.handleFullMessage);
  }
}

Logger.prototype.handleFullMessage = function (context) {
  var out = `<=== ${context.instanceId()}:${context.to()} | ${context.nick()} | ${TextDecorator.parse(context.text())}`;
  global.logger.stupid(out);
};

Logger.prototype.handleSentMessage = function (context) {
  var xtra = '';
  var msg = TextDecorator.parse(context.text());

  if(context.getCustomData('isEmote')) {xtra = '/me ';}
  if(!context.getCustomData('noPrefix')) {msg = `${context.nick()}: ${msg}`;}

  var out = `===> ${context.instanceId()}:${context.to()} | ${(context.myNick() ? context.myNick() + ' | ' : '')}${xtra}${msg}`;

  //send logging message on next tick, to let the event queue finish first.
  process.nextTick(() => {
    global.logger.stupid(out);
  });
};

module.exports = Logger;
