'use strict';


/**
 * Logging RabbitMQ Transport
 */
class RabbitMQTransport {
  /**
   * @param {String} uri connection details
   * @param {Function} stringify function to JSON stringify object
   * @param {Object} amqpLib amqp connect library
   */
  constructor({ uri, stringify, amqpLib }) {
    this.connection = null;
    this.channel = null;

    this.mqURI = uri;
    this.stringify = stringify;
    this.amqpLib = amqpLib;
  }

  /**
   * Send message over MQ
   * @param {Object} message message to be sent
   * @param {String} queue queue or topic on which message will be sent
   * @param {String} [exchange=''] exchange to be used for sending message
   * @returns {Promise} resolves on success
   * @public
   */
  write({ message, queue, exchange = '' }) {
    return this.connect()
      .then(() => new Promise((resolve, reject) => {
        const publishResult =
          this.channel.publish(exchange, queue, Buffer.from(this.stringify(message)));
        if (publishResult) {
          return resolve();
        }
        return reject(Error('Error sending message on MQ'));
      }))
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Conenct to RabbitMQ
   * @returns {Promise} resolves on success
   * @private
   */
  connect() {
    if (this.connection && this.channel) {
      return Promise.resolve();
    }
    return this.amqpLib.connect(this.mqURI)
      .then((connection) => {
        this.connection = connection;
        return this.connection.createConfirmChannel();
      })
      .then((pchannel) => {
        this.channel = pchannel;
        return Promise.resolve();
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Close connection to RabbitMQ
   * @param {Function} cb callback to be called after close
   * @return {undefined}
   * @public
   */
  close(cb) {
    if (this.connection) {
      return this.connection.close(() => cb());
    }
    return cb();
  }
}

module.exports = {
  RabbitMQTransport,
};
