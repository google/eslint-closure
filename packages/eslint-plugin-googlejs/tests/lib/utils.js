/**
 * @fileoverview Tests for utils.
 */

/* global describe it expect */
const utils = require('../../lib/utils');
const expect = require('chai').expect
describe('Utils', () => {

  it('should correctly determine underscored strings', () => {
    expect(utils.isUnderscored('')).to.be.false;
    expect(utils.isUnderscored('a')).to.be.false;
    expect(utils.isUnderscored('ab')).to.be.false;
    expect(utils.isUnderscored('ab c')).to.be.false;


    expect(utils.isUnderscored('_')).to.be.true;
    expect(utils.isUnderscored('a_')).to.be.true;
    expect(utils.isUnderscored('__')).to.be.true;
    expect(utils.isUnderscored('_a')).to.be.true;
    expect(utils.isUnderscored(' _')).to.be.true;
    expect(utils.isUnderscored('abc _')).to.be.true;
    expect(utils.isUnderscored('_abc')).to.be.true;
  })

});
