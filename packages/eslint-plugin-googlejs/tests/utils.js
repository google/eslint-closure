/**
 * @fileoverview Tests for utils.
 */

/* global describe it */
goog.module('googlejs.tests.utils');
goog.setTestOnly('googlejs.tests.utils');

const utils = goog.require('googlejs.utils');
const {UnderscoreForm} = goog.require('googlejs.types');

const expect = require('chai').expect;

describe('isUnderscored', () => {
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
  });
});

describe('categorizeUnderscoredIdentifier', () => {

  const categorize = utils.categorizeUnderscoredIdentifier;
  it('should correctly categorize strings with no underscores', () => {
    expect(categorize('')).to.equal(UnderscoreForm.NO_UNDERSCORE);
    expect(categorize('a')).to.equal(UnderscoreForm.NO_UNDERSCORE);
    expect(categorize('a b')).to.equal(UnderscoreForm.NO_UNDERSCORE);

    expect(categorize('_')).to.not.equal(UnderscoreForm.NO_UNDERSCORE);
    expect(categorize('a_')).to.not.equal(UnderscoreForm.NO_UNDERSCORE);
    expect(categorize('_a')).to.not.equal(UnderscoreForm.NO_UNDERSCORE);
  });


  it('should correctly categorize strings with leading underscores', () => {
    expect(categorize('_a')).to.equal(UnderscoreForm.LEADING);
    // Leading wins over trailing.
    expect(categorize('_a_')).to.equal(UnderscoreForm.LEADING);
    expect(categorize('__a')).to.equal(UnderscoreForm.LEADING);
    expect(categorize('_ a')).to.equal(UnderscoreForm.LEADING);
    expect(categorize('_a')).to.equal(UnderscoreForm.LEADING);
    expect(categorize('_a b')).to.equal(UnderscoreForm.LEADING);

    expect(categorize(' _')).to.not.equal(UnderscoreForm.LEADING);
    expect(categorize(' __')).to.not.equal(UnderscoreForm.LEADING);
    expect(categorize('a_ b')).to.not.equal(UnderscoreForm.LEADING);
  });

  it('should correctly categorize strings that are CONSTANT_STRINGS', () => {
    expect(categorize('A')).to.equal(UnderscoreForm.CONSTANT);
    expect(categorize('AB')).to.equal(UnderscoreForm.CONSTANT);
    expect(categorize('ABC')).to.equal(UnderscoreForm.CONSTANT);
    expect(categorize('A_')).to.equal(UnderscoreForm.CONSTANT);
    expect(categorize('__A')).to.equal(UnderscoreForm.CONSTANT);
    expect(categorize('_A_')).to.equal(UnderscoreForm.CONSTANT);
    expect(categorize('__AB_')).to.equal(UnderscoreForm.CONSTANT);
    // Not sure about these, but I don't think it matters much for our purposes.
    expect(categorize('_')).to.equal(UnderscoreForm.CONSTANT);
    expect(categorize('__')).to.equal(UnderscoreForm.CONSTANT);

    expect(categorize('a_')).to.not.equal(UnderscoreForm.CONSTANT);
    expect(categorize('a')).to.not.equal(UnderscoreForm.CONSTANT);
    expect(categorize('b_')).to.not.equal(UnderscoreForm.CONSTANT);
  });

  it('should correctly categorize strings that have an opt_ prefix', () => {
    expect(categorize('opt__')).to.equal(UnderscoreForm.OPT_PREFIX);
    expect(categorize('opt_a')).to.equal(UnderscoreForm.OPT_PREFIX);
    expect(categorize('opt_bcd')).to.equal(UnderscoreForm.OPT_PREFIX);
    expect(categorize('opt_b_cd')).to.equal(UnderscoreForm.OPT_PREFIX);
    expect(categorize('opt_b_c_d')).to.equal(UnderscoreForm.OPT_PREFIX);

    expect(categorize('opt')).to.not.equal(UnderscoreForm.OPT_PREFIX);
    expect(categorize('pt_')).to.not.equal(UnderscoreForm.OPT_PREFIX);
    expect(categorize('aopt_')).to.not.equal(UnderscoreForm.OPT_PREFIX);
    expect(categorize('_opt_')).to.not.equal(UnderscoreForm.OPT_PREFIX);
    expect(categorize('opt_')).to.not.equal(UnderscoreForm.OPT_PREFIX);
  });

  it('should correctly categorize strings with a trailing underscore', () => {
    expect(categorize('a_')).to.equal(UnderscoreForm.TRAILING);
    expect(categorize('a_')).to.equal(UnderscoreForm.TRAILING);
    expect(categorize('a__')).to.equal(UnderscoreForm.TRAILING);
    expect(categorize('ab__')).to.equal(UnderscoreForm.TRAILING);
    expect(categorize('a__')).to.equal(UnderscoreForm.TRAILING);

    expect(categorize(' _')).to.not.equal(UnderscoreForm.TRAILING);
    expect(categorize(' __')).to.not.equal(UnderscoreForm.TRAILING);
    expect(categorize('_b_')).to.not.equal(UnderscoreForm.TRAILING);
    expect(categorize('B_')).to.not.equal(UnderscoreForm.TRAILING);
  });

  it('should correctly categorize strings that are var_args', () => {
    expect(categorize('var_args')).to.equal(UnderscoreForm.VAR_ARGS);

    expect(categorize('var_args_')).to.not.equal(UnderscoreForm.VAR_ARGS);
    expect(categorize('varargs')).to.not.equal(UnderscoreForm.VAR_ARGS);
    expect(categorize('_var_args')).to.not.equal(UnderscoreForm.VAR_ARGS);
    expect(categorize('var_argss')).to.not.equal(UnderscoreForm.VAR_ARGS);
    expect(categorize('ar_args')).to.not.equal(UnderscoreForm.VAR_ARGS);
    expect(categorize('var_arg')).to.not.equal(UnderscoreForm.VAR_ARGS);
  });

  it('should correctly categorize strings with a middle underscore', () => {
    expect(categorize('a_b')).to.equal(UnderscoreForm.MIDDLE);
    expect(categorize('a__b')).to.equal(UnderscoreForm.MIDDLE);
    expect(categorize('a_b_c')).to.equal(UnderscoreForm.MIDDLE);
    expect(categorize('abc_d')).to.equal(UnderscoreForm.MIDDLE);
    expect(categorize('a_b_c_d_e')).to.equal(UnderscoreForm.MIDDLE);

    expect(categorize(' _')).to.not.equal(UnderscoreForm.MIDDLE);
    expect(categorize('_a_b')).to.not.equal(UnderscoreForm.MIDDLE);
    expect(categorize('a__b_')).to.not.equal(UnderscoreForm.MIDDLE);
    expect(categorize('A_B_C')).to.not.equal(UnderscoreForm.MIDDLE);
    expect(categorize('abcd')).to.not.equal(UnderscoreForm.MIDDLE);
    expect(categorize('opt_a_b_c_d_e')).to.not.equal(UnderscoreForm.MIDDLE);
    expect(categorize('var_args')).to.not.equal(UnderscoreForm.MIDDLE);
    expect(categorize(' __')).to.not.equal(UnderscoreForm.MIDDLE);
    expect(categorize('')).to.not.equal(UnderscoreForm.MIDDLE);
  });

});
