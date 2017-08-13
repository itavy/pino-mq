'use strict';

const amqp = require('amqplib');
const getTransport = require('../../lib').getTransport;

const rabbitMQURI = 'amqp://pinomqusr:pinomqpwd@localhost/pino-mq';
const rabbitMQExchange = 'pinoMQExchange';

const tests = {
  subscribeQueue: {
    exchange: '',
    queue:    'pino-mq-queue',
  },
};

const testMessages = {
  singleQueue: 'Testing Message',
};

/**
 * Setup testing connection
 * @param {Object[]} definitions pair of queue and resolvers
 * @param {String} definitions.queue queue on which will subscribe
 * @param {Function} definitions.cb resolver for the queue
 * @param {Object} config transport config
 * @returns {Object} resolves with connection and transport on success
 */
const setupTestConn = ({ definitions, config }) => new Promise(resolve =>
  amqp.connect(rabbitMQURI)
    .then(conn => conn.createChannel()
      .then(ch => Promise.all(definitions.map(el => ch.consume(el.queue, (qMessage) => {
        el.cb({
          message:    JSON.parse(qMessage.content.toString()),
          routingKey: qMessage.fields.routingKey,
          exchange:   qMessage.fields.exchange,
        });
      }, { noAck: true }))))
      .then(() => {
        const transport = getTransport(Object.assign({
          type:            'RABBITMQ',
          transportParams: {
            uri: rabbitMQURI,
          },
        }, config));
        return resolve({
          conn,
          transport,
        });
      })));

module.exports = {
  setupTestConn,
  rabbitMQURI,
  rabbitMQExchange,
  tests,
  testMessages,
};
