'use strict';

const expect = require('@itavy/test-utilities').getExpect();

const mockTransport = {
  write: () => Promise.resolve(),
  close: cb => cb(),
};
const mockFields = [];
const filterFields = [
  'hostname',
  'level',
  'msg',
  'time',
];

const mockExchange = 'mockExchange';
const mockQueue = 'mockQueue';
const mockQueuePattern = 'mockQueue.';
const mockQueueMap = {
  20:      'mockQueueMap20',
  default: 'mockQueueMapDefault',
};

const messageTest = {
  pid:      process.pid,
  hostname: 'testing',
  level:    20,
  msg:      'test message',
  time:     Date.now(),
  v:        1,
};
const transformedMessage = Object.assign(...filterFields.map(e => ({ [e]: messageTest[e] })));

const mqtDeps = {
  queue: {
    transport: mockTransport,
    exchange:  mockExchange,
    queue:     mockQueue,
    fields:    mockFields,
  },
  queuePattern: {
    transport:    mockTransport,
    exchange:     mockExchange,
    queuePattern: mockQueuePattern,
    fields:       mockFields,
  },
  queueMap: {
    transport: mockTransport,
    exchange:  mockExchange,
    queueMap:  mockQueueMap,
    fields:    mockFields,
  },
  queueFields: {
    transport: mockTransport,
    exchange:  mockExchange,
    queue:     mockQueue,
    fields:    filterFields,
  },
};

const testingError = Error('testing error');
/**
 * tests if provided error has expected name and has cause a specific error
 * @param {Error} error error to be tested
 * @returns {undefined} returns nothing on success
 */
const testExpectedError = ({ error }) => {
  expect(error).to.be.equal(testingError);
};

module.exports = {
  mockTransport,
  mockFields,
  filterFields,
  mockExchange,
  mockQueue,
  mockQueuePattern,
  mockQueueMap,
  messageTest,
  transformedMessage,
  mqtDeps,
  testingError,
  testExpectedError,
};
