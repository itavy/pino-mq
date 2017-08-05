'use strict';

const testUtilities = require('@itavy/test-utilities');
const { RabbitMQTransport } = require('../../lib/RabbitMQTransport');
const fixtures = require('./Fixtures');

const expect = testUtilities.getExpect();

describe('Connect', () => {
  let sandbox;
  let testConnector;

  beforeEach((done) => {
    sandbox = testUtilities.getSinonSandbox();
    testConnector = Reflect.construct(RabbitMQTransport, [fixtures.RabbitMqDeps]);
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    testConnector = null;
    done();
  });

  it('Should call amqplib connect', () => {
    const connectStub = sandbox.stub(fixtures.amqpLibMock, 'connect').rejects(fixtures.testingError);
    return testConnector.connect()
      .should.be.rejected
      .then((error) => {
        fixtures.testExpectedError({ error });

        expect(connectStub.callCount).to.be.equal(1);
        expect(connectStub.getCall(0).args).to.be.eql([fixtures.RabbitMqDeps.uri]);

        return Promise.resolve();
      });
  });

  it('Should set connection', () => {
    sandbox.stub(fixtures.amqpConnectionMock, 'createConfirmChannel')
      .rejects(fixtures.testingError);
    return testConnector.connect()
      .should.be.rejected
      .then((error) => {
        fixtures.testExpectedError({ error });

        expect(testConnector.connection).to.be.equal(fixtures.amqpConnectionMock);

        return Promise.resolve();
      });
  });

  it('Should set channel', () => testConnector.connect()
    .should.be.fulfilled
    .then(() => {
      expect(testConnector.channel).to.be.equal(fixtures.amqpChannelMock);

      return Promise.resolve();
    }));

  it('Should resolve on subsequent calls', () => {
    const connectSpy = sandbox.spy(fixtures.amqpLibMock, 'connect');
    return testConnector.connect()
      .then(() => testConnector.connect())
      .should.be.fulfilled
      .then(() => {
        expect(connectSpy.callCount).to.be.equal(1);

        return Promise.resolve();
      });
  });
});

