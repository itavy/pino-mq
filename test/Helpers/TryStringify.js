'use strict';

const testUtilities = require('@itavy/test-utilities');
const helpersLib = require('../../lib/Helpers');

const expect = testUtilities.getExpect();

describe('TryStringify', () => {
  let sandbox;

  beforeEach((done) => {
    sandbox = testUtilities.getSinonSandbox();
    done();
  });

  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('Should use JSON.stringify', (done) => {
    const o = {
      f: true,
    };
    const stringifySpy = sandbox.spy(JSON, 'stringify');

    expect(helpersLib.tryStringify(o)).to.be.equal('{"f":true}');

    expect(stringifySpy.callCount).to.be.equal(1);
    expect(stringifySpy.getCall(0).args[0]).to.be.equal(o);

    done();
  });

  it('Should use safeStringify', (done) => {
    const o = {
      f: true,
    };
    o.f2 = o;

    expect(helpersLib.tryStringify(o)).to.be.equal('{"f":true,"f2":"[Circular]"}');
    done();
  });
});
