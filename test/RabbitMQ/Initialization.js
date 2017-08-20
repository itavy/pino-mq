'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const { RabbitMQTransport } = require('../../lib/RabbitMQTransport');
const fixtures = require('./Fixtures');

describe('Initializaton', () => {
  it('Should export a well defined object', (done) => {
    const t = Reflect.construct(RabbitMQTransport, [fixtures.RabbitMqDeps]);
    expect(t).to.have.property('mqURI', fixtures.RabbitMqDeps.uri);
    expect(t).to.have.property('stringify', fixtures.RabbitMqDeps.stringify);
    expect(t).to.have.property('amqpLib', fixtures.RabbitMqDeps.amqpLib);
    expect(t).to.have.property('connection', null);
    expect(t).to.have.property('channel', null);
    expect(t).to.respondTo('write', 'No write method');
    expect(t).to.respondTo('close', 'No close method');

    expect(t).to.respondTo('connect', 'No connect method');
    return done();
  });
});
