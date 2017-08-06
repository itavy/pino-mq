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

  it('Should write only provided fields message', (done) => {
    const t = Reflect.construct(MQTransport, [fixtures.mqtDeps.queueFields]);
    const transportWriteStub = sandbox.stub(testTransport.transport, 'write')
      .rejects(fixtures.testingError);

    t.write(fixtures.messageTest, null, (error) => {
      fixtures.testExpectedError({ error });
      expect(transportWriteStub.callCount).to.be.equal(1);
      expect(transportWriteStub.getCall(0).args[0].message)
        .to.be.eql(fixtures.transformedMessage);

      return done();
    });
  });

  it('Should write message on configured queue', (done) => {
    const transportWriteStub = sandbox.stub(testTransport.transport, 'write')
      .rejects(fixtures.testingError);

    testTransport.write(fixtures.messageTest, null, (error) => {
      fixtures.testExpectedError({ error });
      expect(transportWriteStub.callCount).to.be.equal(1);
      expect(transportWriteStub.getCall(0).args[0])
        .to.have.property('queue', fixtures.mockQueue);

      return done();
    });
  });

  it('Should write message on configured queue by pattern', (done) => {
    const t = Reflect.construct(MQTransport, [fixtures.mqtDeps.queuePattern]);
    const transportWriteStub = sandbox.stub(testTransport.transport, 'write')
      .rejects(fixtures.testingError);

    t.write(fixtures.messageTest, null, (error) => {
      fixtures.testExpectedError({ error });
      expect(transportWriteStub.callCount).to.be.equal(1);
      expect(transportWriteStub.getCall(0).args[0])
        .to.have.property('queue', `${fixtures.mockQueuePattern}${fixtures.messageTest.level}`);

      return done();
    });
  });

  it('Should write message on configured queue from map', (done) => {
    const t = Reflect.construct(MQTransport, [fixtures.mqtDeps.queueMap]);
    const transportWriteStub = sandbox.stub(testTransport.transport, 'write')
      .rejects(fixtures.testingError);

    t.write(fixtures.messageTest, null, (error) => {
      fixtures.testExpectedError({ error });
      expect(transportWriteStub.callCount).to.be.equal(1);
      expect(transportWriteStub.getCall(0).args[0])
        .to.have.property('queue', fixtures.mockQueueMap[20]);

      return done();
    });
  });

  it('Should write message on default queue from map', (done) => {
    const t = Reflect.construct(MQTransport, [fixtures.mqtDeps.queueMap]);
    const transportWriteStub = sandbox.stub(testTransport.transport, 'write')
      .rejects(fixtures.testingError);

    t.write(Object.assign({}, fixtures.messageTest, { level: 21 }), null, (error) => {
      fixtures.testExpectedError({ error });
      expect(transportWriteStub.callCount).to.be.equal(1);
      expect(transportWriteStub.getCall(0).args[0])
        .to.have.property('queue', fixtures.mockQueueMap.default);

      return done();
    });
  });

  it('Should call provided cb without arguments', (done) => {
    testTransport.write(fixtures.messageTest, null, (...args) => {
      expect(args.length).to.be.equal(0);

      return done();
    });
  });
});
