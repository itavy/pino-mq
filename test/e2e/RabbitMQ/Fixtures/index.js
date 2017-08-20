'use strict';

const amqp = require('amqplib');
const getTransport = require('../../../../lib/index').getTransport;

const rabbitMQURI = 'amqp://pinomqusr:pinomqpwd@localhost/pino-mq';
const rabbitMQExchange = 'pinoMQExchange';

const testsConfig = {
  singleQueue: {
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
  singleTopic: {
    exchange: 'pinoMQExchange',
    queue:    'pinoMQTopic',
  },
  patternTopic: {
    queuePattern: 'pinoMQTopic.',
    exchange:     'pinoMQExchange',
  },
  mapTopic: {
    exchange: 'pinoMQExchange',
    queueMap: {
      default: 'pinoMQ.Topic.default',
      30:      'pinoMQ.Topic.30',
    },
  },
};

const testsQueues = {
  singleQueue: {
    queue: testsConfig.singleQueue.queue,
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
  singleTopic: {
    queue: 'pino-mq-queue-topic',
  },
  patternTopic: {
    queue30: 'pino-mq-patternqueue-topic-1',
    topic30: `${testsConfig.patternTopic.queuePattern}30`,
    queue35: 'pino-mq-patternqueue-topic-2',
    topic35: `${testsConfig.patternTopic.queuePattern}35`,
  },
  mapTopic: {
    default:      'pino-mq-mapqueue-topic-2',
    topicDefault: testsConfig.mapTopic.queueMap.default,
    30:           'pino-mq-mapqueue-topic-1',
    topic30:      testsConfig.mapTopic.queueMap[30],
  },
};

const testMessages = {
  singleQueue: {
    level:     30,
    msg:       'Testing Message',
    timestamp: Date.now(),
    v:         1,
  },
  filterFields: {
    orig: {
      level:     30,
      msg:       'Testing Message 30',
      timestamp: Date.now(),
      extra:     true,
      v:         1,
    },
    received: {
      level:     30,
      msg:       'Testing Message 30',
      timestamp: Date.now(),
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

const pinoTestMessages = [
  {
    level:   'info',
    msg:     'msg1',
    delayed: false,
  },
  {
    level:   'info',
    msg:     'msg2',
    delayed: false,
  },
  {
    level:   'error',
    msg:     'msg3',
    delayed: false,
  },
  {
    level:   'warn',
    msg:     'msg4',
    delayed: false,
  },
  {
    level:   'info',
    msg:     'msg delayed',
    delayed: true,
  },
];

/**
 * Setup testing connection
 * @param {Object[]} definitions pair of queue and resolvers
 * @param {String} definitions.queue queue on which will subscribe
 * @param {Function} definitions.cb resolver for the queue
 * @param {Object} config transport config
 * @returns {Object} resolves with connection and transport on success
 */
const setupTestConn = ({ definitions, config = null }) => new Promise((resolve, reject) =>
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
        if (config === null) {
          return resolve({
            transport: null,
            conn,
          });
        }
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
  .then(() => transport && transport.close());

module.exports = {
  setupTestConn,
  closeTestConn,
  rabbitMQURI,
  rabbitMQExchange,
  testsConfig,
  testsQueues,
  testMessages,
  pinoTestMessages,
};
