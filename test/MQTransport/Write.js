'use strict';

const testUtilities = require('@itavy/test-utilities');
const { MQTransport } = require('../../lib/MQTransport');
const fixtures = require('./Fixtures');

const expect = testUtilities.getExpect();

describe('Write', () => {
  let sandbox;
  let testTransport;

  beforeEach((done) => {
    sandbox = testUtilities.getSinonSandbox();
    testTransport = Reflect.construct(MQTransport, [fixtures.mqtDeps.queue]);
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    testTransport = null;
    done();
  });

  it('Should write entire message', (done) => {
    const transportWriteStub = sandbox.stub(testTransport.transport, 'write')
      .rejects(fixtures.testingError);

    testTransport.write(fixtures.messageTest, null, (error) => {
      fixtures.testExpectedError({ error });
      expect(transportWriteStub.callCount).to.be.equal(1);
      expect(transportWriteStub.getCall(0).args[0])
        .to.have.property('message', fixtures.messageTest);

      return done();
    });
  });

  it('Should write only provided fields message', () => {
    const t = Reflect.construct(MQTransport, [fixtures.mqtDeps.queueFields]);
    const transportWriteStub = sandbox.stub(testTransport.transport, 'write')
      .rejects(fixtures.testingError);

    return new Promise((resolve) => {
      t.write(fixtures.messageTest, null, (error) => {
        fixtures.testExpectedError({ error });
        expect(transportWriteStub.callCount).to.be.equal(1);
        expect(transportWriteStub.getCall(0).args[0].message)
          .to.be.eql(fixtures.transformedMessage);

        resolve();
      });
    })
      .catch(err => Promise.reject(err));
  });
});
