'use strict';

const expect = require('@itavy/test-utilities').getExpect();
const helpersLib = require('../../lib/Helpers');

describe('Export', () => {
  it('Should have all required helpers', (done) => {
    expect(helpersLib).to.be.an('object');

    const expectedKeys = [
      { name: 'tryStringify', type: 'function' },
      { name: 'validateMqSettings', type: 'function' },
    ];

    expect(Object.keys(helpersLib).length).to.be.equal(expectedKeys.length);

    expectedKeys.map(el => expect(helpersLib[el.name]).to.be.a(el.type));
    done();
  });
});
