'use strict';

const testUtilities = require('@itavy/test-utilities');
const { MQTransport } = require('../../lib/MQTransport');
const fixtures = require('./Fixtures');

const expect = testUtilities.getExpect();

describe('Close', () => {
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

  it('Should call cb provided', (done) => {
    const transportCloseSpy = sandbox.spy(fixtures.mockTransport, 'close');
    const cbSpy = sandbox.spy();

    testTransport.close(cbSpy);

    expect(transportCloseSpy.callCount).to.be.equal(1);
    expect(cbSpy.callCount).to.be.equal(1);

    return done();
  });
});
