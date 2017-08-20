'use strict';

const tap = require('@itavy/test-utilities').getTap();
const fixtures = require('./Fixtures');

tap.test('Pattern queue', (t) => {
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
    t.equals(routingKey, fixtures.testsQueues.patternQueue.queue30);
  };
  // eslint-disable-next-line require-jsdoc
  const receive35 = ({ message, routingKey }) => {
    t.same(message, fixtures.testMessages.patternQueue.msg35);
    t.equals(routingKey, fixtures.testsQueues.patternQueue.queue35);
  };

  fixtures.setupTestConn({
    definitions: [
      {
        queue: fixtures.testsQueues.patternQueue.queue30,
        cb:    receive30,
      },
      {
        queue: fixtures.testsQueues.patternQueue.queue35,
        cb:    receive35,
      },
    ],
    config: fixtures.testsConfig.patternQueue,
  })
    .then(({ conn, transport }) => {
      checkConn = conn;
      testTransport = transport;

      testTransport.write(fixtures.testMessages.patternQueue.msg30, null, () =>
        testTransport.write(fixtures.testMessages.patternQueue.msg35, null, () => null));
    })
    .catch(err => t.bailout(err));
});
