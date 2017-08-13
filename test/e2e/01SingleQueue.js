'use strict';

const tap = require('tap');
const fixtures = require('./Fixtures');

tap.test('Single queue', (t) => {
  let testTransport;
  let checkConn;
  t.plan(1);
  t.tearDown(() => fixtures.closeTestConn({
    conn:      checkConn,
    transport: testTransport,
  }));

  // eslint-disable-next-line require-jsdoc
  const receiveMessage = ({ message }) => {
    t.equal(message, fixtures.testMessages.singleQueue);
  };

  fixtures.setupTestConn({
    definitions: [
      {
        queue: fixtures.testsQueues.singleQueue.queue,
        cb:    receiveMessage,
      },
    ],
    config: fixtures.testsConfig.subscribeQueue,
  })
    .then(({ conn, transport }) => {
      checkConn = conn;
      testTransport = transport;
      testTransport.write(fixtures.testMessages.singleQueue, null, () => null);
    })
    .catch(err => t.bailout(err));
});
