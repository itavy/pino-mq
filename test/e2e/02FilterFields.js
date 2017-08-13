'use strict';

const tap = require('tap');
const fixtures = require('./Fixtures');

tap.test('Filter fields', (t) => {
  let testTransport;
  let checkConn;
  t.plan(1);
  t.tearDown(() => fixtures.closeTestConn({
    conn:      checkConn,
    transport: testTransport,
  }));

  // eslint-disable-next-line require-jsdoc
  const receiveMessage = ({ message }) => {
    t.same(message, fixtures.testMessages.filterFields.received);
  };

  fixtures.setupTestConn({
    definitions: [
      {
        queue: fixtures.testsQueues.filterFields.queue,
        cb:    receiveMessage,
      },
    ],
    config: fixtures.testsConfig.filterFields,
  })
    .then(({ conn, transport }) => {
      checkConn = conn;
      testTransport = transport;
      testTransport.write(fixtures.testMessages.filterFields.orig, null, () => null);
    })
    .catch(err => t.bailout(err));
});
