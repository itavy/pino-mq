'use strict';

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

module.exports = {
  rabbitMQURI,
  rabbitMQExchange,
  tests,
  testMessages,
};
