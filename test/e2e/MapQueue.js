'use strict';

const tap = require('tap');
const fixtures = require('./Fixtures');

tap.test('Map queue', (t) => {
  let testTransport;
  let checkConn;
  t.plan(6);
  t.tearDown(() => fixtures.closeTestConn({
    conn:      checkConn,
    transport: testTransport,
  }));

  // eslint-disable-next-line require-jsdoc
  const receive30 = ({ message, routingKey }) => {
    t.same(message, fixtures.testMessages.mapQueue.msg30);
    t.equals(routingKey, fixtures.testsQueues.mapQueue[30]);
  };
  // eslint-disable-next-line require-jsdoc
  const receive40 = ({ message, routingKey }) => {
    t.same(message, fixtures.testMessages.mapQueue.msg40);
    t.equals(routingKey, fixtures.testsQueues.mapQueue[40]);
  };
  // eslint-disable-next-line require-jsdoc
  const receiveDefault = ({ message, routingKey }) => {
    t.same(message, fixtures.testMessages.mapQueue.msgDefault);
    t.equals(routingKey, fixtures.testsQueues.mapQueue.default);
  };

  fixtures.setupTestConn({
    definitions: [
      {
        queue: fixtures.testsQueues.mapQueue[30],
        cb:    receive30,
      },
      {
        queue: fixtures.testsQueues.mapQueue[40],
        cb:    receive40,
      },
      {
        queue: fixtures.testsQueues.mapQueue.default,
        cb:    receiveDefault,
      },
    ],
    config: fixtures.testsConfig.mapQueue,
  })
    .then(({ conn, transport }) => {
      checkConn = conn;
      testTransport = transport;

      testTransport.write(fixtures.testMessages.mapQueue.msg30, null, () =>
        testTransport.write(fixtures.testMessages.mapQueue.msg40, null, () =>
          testTransport.write(fixtures.testMessages.mapQueue.msgDefault, null, () => null)));
    })
    .catch(err => t.bailout(err));
});
