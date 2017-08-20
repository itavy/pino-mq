'use strict';

const testUtilities = require('@itavy/test-utilities');
const { RabbitMQTransport } = require('../../lib/RabbitMQTransport');
const fixtures = require('./Fixtures');

const expect = testUtilities.getExpect();

describe('Close', () => {
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

  it('Should call publish on channel', () => {
    const publishStub = sandbox.stub(fixtures.amqpChannelMock, 'publish')
      .throws(fixtures.testingError);
    const stringifySpy = sandbox.spy(testConnector, 'stringify');

    return testConnector.write(fixtures.messageTest)
      .should.be.rejected
      .then((error) => {
        fixtures.testExpectedError({ error });

        expect(publishStub.callCount).to.be.equal(1);
        expect(publishStub.getCall(0).args[0]).to.be.equal(fixtures.messageTest.exchange);
        expect(publishStub.getCall(0).args[1]).to.be.equal(fixtures.messageTest.queue);

        expect(stringifySpy.callCount).to.be.equal(1);
        expect(stringifySpy.getCall(0).args).to.be.eql([fixtures.messageTest.message]);

        expect(publishStub.getCall(0).args[2])
          .to.be.eql(fixtures.bStringifiedMockMessage);

        return Promise.resolve();
      });
  });

  it('Should faill if connection returns false', () => {
    sandbox.stub(fixtures.amqpChannelMock, 'publish').returns(false);

    return testConnector.write(fixtures.messageTest)
      .should.be.rejected
      .then((error) => {
        expect(error.message).to.be.equal('Error sending message on MQ');

        return Promise.resolve();
      });
  });

  it('Should resolve', () => testConnector.write(fixtures.messageTest)
    .should.be.fulfilled);
});
