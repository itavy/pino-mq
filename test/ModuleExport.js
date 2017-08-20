'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const pinoMQModule = require('../lib/');
const { RabbitMQTransport } = require('../lib/RabbitMQTransport');

describe('Module Export', () => {
  it('Should have all required fields', (done) => {
    expect(pinoMQModule).to.be.an('object');

    const expectedKeys = [
      { name: 'getTransport', type: 'function' },
    ];

    expect(Object.keys(pinoMQModule).length).to.be.equal(expectedKeys.length);

    expectedKeys.map(el => expect(pinoMQModule[el.name]).to.be.a(el.type));
    done();
  });

  it('Should fail for missing queue configs', (done) => {
    expect(() => pinoMQModule.getTransport({}))
      .to.throw('You must provide at least queue or queuePatern or queueMap.');
    return done();
  });

  it('Should fail for unknown transport', (done) => {
    expect(() => pinoMQModule.getTransport({ queue: 'test-queue', type: 'anotherTransport' }))
      .to.throw('Unknown transport type requested: anotherTransport.');
    return done();
  });

  it('Should instantiate with RabbitMQ transport', (done) => {
    const t = pinoMQModule.getTransport({ queue: 'test-queue', type: 'RABBITMQ' });
    expect(t.transport).to.be.instanceOf(RabbitMQTransport);
    return done();
  });
});
