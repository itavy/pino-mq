'use strict';

const tap = require('@itavy/test-utilities').getTap();
const fixtures = require('./Fixtures');
const spawn = require('child_process').spawn;
const path = require('path');


tap.test('Pino delayed close', (t) => {
  let checkConn;
  let msgCounter = 0;

  t.plan(fixtures.pinoTestMessages.length);
  t.tearDown(() => fixtures.closeTestConn({
    conn:      checkConn,
    transport: null,
  }));

  // eslint-disable-next-line require-jsdoc
  const receiveMessage = ({ message }) => {
    t.same(message.msg, fixtures.pinoTestMessages[msgCounter].msg);
    msgCounter += 1;
  };

  fixtures.setupTestConn({
    definitions: [
      {
        queue: fixtures.testsQueues.singleQueue.queue,
        cb:    receiveMessage,
      },
    ],
  })
    .then(({ conn }) => {
      checkConn = conn;
      const pinolog = spawn('node', [
        path.join(__dirname, 'Fixtures', 'pinoDelayed.js'),
      ]);
      const pinomq = spawn('node', [
        path.join(__dirname, '..', '..', '..', 'pino-mq.js'),
        '-c',
        path.join(__dirname, 'Fixtures', 'pino-mq.json'),
      ]);
      pinolog.stdout.pipe(pinomq.stdin);
    });
});
