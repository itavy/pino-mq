'use strict';

const tap = require('tap');
const amqp = require('amqplib');
const fixtures = require('./Fixtures');
const getTransport = require('../../lib').getTransport;

tap.test('Single queue', (t) => {
  t.plan(1);
  let testTransport;
  let checkConn;

  // eslint-disable-next-line require-jsdoc
  const receiveMessage = (qMessage) => {
    const message = JSON.parse(qMessage.content.toString());
    t.equal(message, fixtures.testMessages.singleQueue);
    checkConn.close()
      .then(() => testTransport.close());
  };


  amqp.connect(fixtures.rabbitMQURI)
    .then((conn) => {
      checkConn = conn;
      conn.createChannel()
        .then(ch => ch.consume(fixtures.tests.subscribeQueue.queue,
          receiveMessage, { noAck: true }))
        .then(() => {
          testTransport = getTransport({
            type:            'RABBITMQ',
            queue:           fixtures.tests.subscribeQueue.queue,
            transportParams: {
              uri: fixtures.rabbitMQURI,
            },
          });
          testTransport.write(fixtures.testMessages.singleQueue, null, () => null);
        });
    });
});
