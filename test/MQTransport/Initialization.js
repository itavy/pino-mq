'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const { MQTransport } = require('../../lib/MQTransport');
const fixtures = require('./Fixtures');

describe('Initializaton', () => {
  it('Should export a well defined object', (done) => {
    const t = Reflect.construct(MQTransport, [fixtures.mqtDeps.queue]);

    expect(t).to.have.property('transport', fixtures.mockTransport);
    expect(t).to.have.property('exchange', fixtures.mockExchange);

    expect(t).to.respondTo('transformMessage', 'No transformMessage method');
    expect(t).to.respondTo('getMessageQueue', 'No getMessageQueue method');
    expect(t).to.respondTo('write', 'No write method');
    expect(t).to.respondTo('close', 'No close method');

    return done();
  });
});
