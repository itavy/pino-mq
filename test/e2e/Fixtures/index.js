'use strict';

const amqp = require('amqplib');
const getTransport = require('../../../lib/index').getTransport;

const rabbitMQURI = 'amqp://pinomqusr:pinomqpwd@localhost/pino-mq';
const rabbitMQExchange = 'pinoMQExchange';

const testsConfig = {
  subscribeQueue: {
    queue: 'pino-mq-queue',
  },
  filterFields: {
    queue:  'pino-mq-queue',
    fields: ['level', 'msg', 'timestamp'],
  },
  patternQueue: {
    queuePattern: 'pino-mq-queue-',
  },
  mapQueue: {
    queueMap: {
      default: 'pinomqqueue-default',
      30:      'pinomqqueue-30',
      40:      'pinomqqueue-40',
    },
  },
};

const testsQueues = {
  singleQueue: {
    queue: testsConfig.subscribeQueue.queue,
  },
  filterFields: {
    queue: 'pino-mq-queue',
  },
  patternQueue: {
    queue30: `${testsConfig.patternQueue.queuePattern}30`,
    queue35: `${testsConfig.patternQueue.queuePattern}35`,
  },
  mapQueue: {
    default: testsConfig.mapQueue.queueMap.default,
    30:      testsConfig.mapQueue.queueMap[30],
    40:      testsConfig.mapQueue.queueMap[40],
  },
};

const testMessages = {
  singleQueue:  'Testing Message',
  filterFields: {
    orig: {
      level:     30,
      msg:       'Testing Message 30',
      timestamp: 123456789,
      extra:     true,
      v:         1,
    },
    received: {
      level:     30,
      msg:       'Testing Message 30',
      timestamp: 123456789,
    },
  },
  patternQueue: {
    msg30: {
      level: 30,
      msg:   'Testing Message 30',
    },
    msg35: {
      level: 35,
      msg:   'Testing Message 35',
    },
  },
  mapQueue: {
    msg30: {
      level: 30,
      msg:   'Testing Message 30',
    },
    msg40: {
      level: 40,
      msg:   'Testing Message 40',
    },
    msgDefault: {
      level: 35,
      msg:   'Testing Message 35',
    },
  },
};

/**
 * Setup testing connection
 * @param {Object[]} definitions pair of queue and resolvers
 * @param {String} definitions.queue queue on which will subscribe
 * @param {Function} definitions.cb resolver for the queue
 * @param {Object} config transport config
 * @returns {Object} resolves with connection and transport on success
 */
const setupTestConn = ({ definitions, config }) => new Promise((resolve, reject) =>
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
      }))
    .catch(err => reject(err)));

/**
 * Close test connection
 * @param {Object} conn test conection
 * @param {Object} transport test transport to be closed
 * @returns {undefined}
 */
const closeTestConn = ({ conn, transport }) => conn.close()
  .then(() => transport.close());

module.exports = {
  setupTestConn,
  closeTestConn,
  rabbitMQURI,
  rabbitMQExchange,
  testsConfig,
  testsQueues,
  testMessages,
};
