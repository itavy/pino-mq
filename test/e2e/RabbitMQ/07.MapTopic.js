'use strict';

const tap = require('@itavy/test-utilities').getTap();
const fixtures = require('./Fixtures');

tap.test('Map queue', (t) => {
  let testTransport;
  let checkConn;
  t.plan(4);
  t.tearDown(() => fixtures.closeTestConn({
    conn:      checkConn,
    transport: testTransport,
  }));

  // eslint-disable-next-line require-jsdoc
  const receive30 = ({ message, routingKey }) => {
    t.same(message, fixtures.testMessages.mapQueue.msg30);
    t.equals(routingKey, fixtures.testsQueues.mapTopic.topic30);
  };
  // eslint-disable-next-line require-jsdoc
  const receiveDefault = ({ message, routingKey }) => {
    t.same(message, fixtures.testMessages.mapQueue.msgDefault);
    t.equals(routingKey, fixtures.testsQueues.mapTopic.topicDefault);
  };

  fixtures.setupTestConn({
    definitions: [
      {
        queue: fixtures.testsQueues.mapTopic[30],
        cb:    receive30,
      },
      {
        queue: fixtures.testsQueues.mapTopic.default,
        cb:    receiveDefault,
      },
    ],
    config: fixtures.testsConfig.mapTopic,
  })
    .then(({ conn, transport }) => {
      checkConn = conn;
      testTransport = transport;

      testTransport.write(fixtures.testMessages.mapQueue.msg30, null, () =>
        testTransport.write(fixtures.testMessages.mapQueue.msgDefault, null, () => null));
    })
    .catch(err => t.bailout(err));
});
