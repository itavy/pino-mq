'use strict';

const tap = require('tap');
const fixtures = require('./Fixtures');

tap.test('Single queue', (t) => {
  t.plan(1);
  let testTransport;
  let checkConn;

  // eslint-disable-next-line require-jsdoc
  const receiveMessage = ({ message }) => {
    t.equal(message, fixtures.testMessages.singleQueue);
    checkConn.close()
      .then(() => testTransport.close());
  };

  fixtures.setupTestConn({
    definitions: [
      {
        queue: fixtures.tests.subscribeQueue.queue,
        cb:    receiveMessage,
      },
    ],
    config: {
      queue: fixtures.tests.subscribeQueue.queue,
    },
  })
    .then(({ conn, transport }) => {
      checkConn = conn;
      testTransport = transport;
      testTransport.write(fixtures.testMessages.singleQueue, null, () => null);
    });
});
