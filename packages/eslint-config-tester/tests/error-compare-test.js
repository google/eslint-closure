/**
 * @fileoverview Tests for errorCompare.
 * @suppress {reportUnknownTypes}
 */

goog.module('googlejs.configTester.tests.errorCompareTest');
goog.setTestOnly();

const types = goog.require('googlejs.configTester.types');

/* global describe it */

const errorCompare = goog.require('googlejs.configTester.errorCompare');

const chai = /** @type {!Chai.Module} */ (require('chai'));

const expect = chai.expect;

describe('errorCompare.compareEslintToExpected', () => {
  const compare = errorCompare.compareEslintToExpected;
  it('should correctly match simple ASTs', () => {
  });
});


describe('errorCompare.verifyExpectedErrorsUsed', () => {

  /**
   * @param {!Object<number, !types.LineErrors>} errorsByLineNumber
   * @return {function():void}
   */
  function verify(errorsByLineNumber) {
    const expectedErrors = {
      filePath: '/FAKE_PATH',
      errorsByLineNumber,
    };
    return () => errorCompare.verifyExpectedErrorsUsed(expectedErrors);
  }

  it('should not throw for no errors', () => {
    expect(verify({})).not.to.throw(Error);
  });

  it('should throw for one unused error', () => {
    expect(verify({1: ['fooRule']})).to.throw(Error, 'fooRule');
  });

  it('should throw and show missing rule IDs', () => {
    expect(verify({1: ['foo', 'bar']})).to.throw(Error, 'foo, bar');
  });


  it('should not throw one used rule', () => {
    expect(verify({1: ['foo']}, ['foo'])).not.to.throw(Error);
  });
});

describe('errorCompare.makeErrorMessage', () => {
  const makeMessage = errorCompare.makeErrorMessage;

  it('should create error messages', () => {
    const message = {
      filePath: '/foo',
      line: 2,
      ruleId: 'RULE',
    };
    expect(makeMessage(message, 'EXPLANATION'))
        .to.eql('/foo:2 (RULE) - EXPLANATION');
  });
});
