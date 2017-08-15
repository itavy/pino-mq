'use strict';

const tap = require('@itavy/test-utilities').getTap();
const fixtures = require('./Fixtures');

tap.test('Pattern topic', (t) => {
  let testTransport;
  let checkConn;
  t.plan(4);
  t.tearDown(() => fixtures.closeTestConn({
    conn:      checkConn,
    transport: testTransport,
  }));

  // eslint-disable-next-line require-jsdoc
  const receive30 = ({ message, routingKey }) => {
    t.same(message, fixtures.testMessages.patternQueue.msg30);
    t.equals(routingKey, fixtures.testsQueues.patternTopic.topic30);
  };
  // eslint-disable-next-line require-jsdoc
  const receive35 = ({ message, routingKey }) => {
    t.same(message, fixtures.testMessages.patternQueue.msg35);
    t.equals(routingKey, fixtures.testsQueues.patternTopic.topic35);
  };

  fixtures.setupTestConn({
    definitions: [
      {
        queue: fixtures.testsQueues.patternTopic.queue30,
        cb:    receive30,
      },
      {
        queue: fixtures.testsQueues.patternTopic.queue35,
        cb:    receive35,
      },
    ],
    config: fixtures.testsConfig.patternTopic,
  })
    .then(({ conn, transport }) => {
      checkConn = conn;
      testTransport = transport;

      testTransport.write(fixtures.testMessages.patternQueue.msg30, null, () =>
        testTransport.write(fixtures.testMessages.patternQueue.msg35, null, () => null));
    })
    .catch(err => t.bailout(err));
});
