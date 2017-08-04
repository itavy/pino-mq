'use strict';

/**
 * MQTransport logs
 */
class MQTransport {
  /**
   * @param {Object} transport mq transport to be used
   * @param {String} [exchange=''] exchange to be used for sending messages
   * @param {String} [queue=null] queue for distributing messages
   * @param {String} [queuePattern=null] queue pattern for distributing messages
   * @param {Object} [queueMap=null] queue map for distributing messages
   * @param {String[]} [fields=[]] message fields to be send over transport
   */
  constructor({ transport, exchange = '', queue = null, queuePattern = null, queueMap = null, fields = [] }) {
    this.transport = transport;
    if (fields.length === 0) {
      this.transformMessage = message => message;
    } else {
      /**
       * Pick for logging only desired fields
       * @param {Object} message original message to be logged
       * @returns {Object} final logging message
       */
      this.transformMessage = message => Object.assign(...fields.map(e => ({ [e]: message[e] })));
    }
    this.exchange = exchange;

    if (queue !== null) {
      this.getMessageQueue = () => Promise.resolve({ queue });
    } else if (queuePattern !== null) {
      this.getMessageQueue = msg => Promise.resolve({ queue: `${queuePattern}${msg.level}` });
    } else {
      this.getMessageQueue = msg => Promise.resolve({
        queue: queueMap[msg.level] || queueMap.default,
      });
    }
  }

  /**
   * @param {Object} chunk message to be logged
   * @param {String} enc encoding
   * @param {Function} cb cb to be called after message is sent
   * @returns {undefined}
   * @public
   */
  write(chunk, enc, cb) {
    this.getMessageQueue(chunk)
      .then(({ queue }) => this.transport.write({
        message:  this.transformMessage(chunk),
        exchange: this.exchange,
        queue,
      }))
      .then(() => cb())
      .catch(err => cb(err));
  }

  /**
   * Forwards close to transport
   * @param {Function} cb callback to be called after close
   * @return {undefined}
   * @public
   */
  close(cb) {
    return this.transport.close(cb);
  }
}

module.exports = {
  MQTransport,
};
