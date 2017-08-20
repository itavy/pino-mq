'use strict';

const tap = require('@itavy/test-utilities').getTap();
const fixtures = require('./Fixtures');

tap.test('Single Topic', (t) => {
  let testTransport;
  let checkConn;
  t.plan(1);
  t.tearDown(() => fixtures.closeTestConn({
    conn:      checkConn,
    transport: testTransport,
  }));

  // eslint-disable-next-line require-jsdoc
  const receiveMessage = ({ message }) => {
    t.same(message, fixtures.testMessages.singleQueue);
  };

  fixtures.setupTestConn({
    definitions: [
      {
        queue: fixtures.testsQueues.singleTopic.queue,
        cb:    receiveMessage,
      },
    ],
    config: fixtures.testsConfig.singleTopic,
  })
    .then(({ conn, transport }) => {
      checkConn = conn;
      testTransport = transport;
      testTransport.write(fixtures.testMessages.singleQueue, null, () => null);
    })
    .catch(err => t.bailout(err));
});
