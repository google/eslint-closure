/**
 * @fileoverview Tests for errorCompare.
 * @suppress {reportUnknownTypes}
 */

goog.module('googlejs.configTester.tests.errorCompareTest');
goog.setTestOnly();

const errorCompare = goog.require('googlejs.configTester.errorCompare');
const types = goog.require('googlejs.configTester.types');

const chai = /** @type {!Chai.Module} */ (require('chai'));

/* global describe it */
const expect = chai.expect;


/**
 * Creates an !ESLint.LintMessage.
 * @param {string} ruleId
 * @param {number} line
 * @param {string=} source
 * @return {!ESLint.LintMessage}
 */
function makeEslintMessage(ruleId, line, source = '<ESLINT_SOURCE>') {
  return {
    ruleId, line, severity: 1, nodeType: 'Identifier', column: 1,
    message: '$ESLINT_MESSAGE', source,
  };
}

function makeEslintResult(filePath, messages) {
  return {
    filePath, messages, errorCount: 1, warningCount: 1,
  };
}

function makeLineErrors(usedRules, expectedRules) {
  return {
    usedRules: new Set(usedRules),
    expectedRules,
  };
}

describe('errorCompare.compareEslintToExpected', () => {
  function compareEslint(results, expected) {
    return function compareEslintWrapper() {
      return errorCompare.compareEslintToExpected(results, expected);
    };
  }

  it('should not throw for no files', () => {
    expect(compareEslint([], {})).not.to.throw(Error);
  });


  it('should throw for missing expected file', () => {
    const eslintResults = [
      makeEslintResult('/PATH', [makeEslintMessage('foo', 3, '/PATH')]),
    ];
    expect(compareEslint(eslintResults, {})).to.throw(Error, '/PATH');
  });


  it('should not throw for matching errors', () => {
    const eslintResults = [
      makeEslintResult('/PATH', [makeEslintMessage('foo', 3, '/PATH')]),
    ];
    const expected = {'/PATH': {
      filePath: '/PATH',
      errorsByLineNumber: {2: makeLineErrors([], ['foo'])},
    }};
    expect(compareEslint(eslintResults, expected)).not.to.throw(Error);
  });
});

describe('errorCompare.compareErrorsForFile', () => {

  function compareFiles(eslintResult, expectedErrorsByFile) {
    return function compareFilesWrapper() {
      return errorCompare.compareErrorsForFile(
          eslintResult, expectedErrorsByFile);
    };
  }

  it('should not throw for no files', () => {
    const lintResult = makeEslintResult('/PATH', []);
    expect(compareFiles(lintResult, {})).not.to.throw(Error);
  });

  it('should throw when no expected errors are found for the same file', () => {
    const lintResult = makeEslintResult('/PATH', [
      makeEslintMessage('foo', 2, '/PATH'),
    ]);
    const expectedErrorsByFile = {
      '/OTHERPATH': {
        filePath: '/OTHERPATH',
        errorsByLineNumber: {},
      },
    };
    expect(compareFiles(lintResult, expectedErrorsByFile)).to.throw(Error);
  });

  it('should not throw when expected errors match', () => {
    const lintResult = makeEslintResult('/PATH', [
      makeEslintMessage('foo', 2, '/PATH'),
    ]);
    const expectedErrorsByFile = {
      '/PATH': {
        filePath: '/PATH',
        errorsByLineNumber: {1: makeLineErrors([], ['foo'])},
      },
    };
    expect(compareFiles(lintResult, expectedErrorsByFile)).not.to.throw(Error);
  });

  it("should throw when there's an unused expected error", () => {
    const lintResult = makeEslintResult('/PATH', [
      makeEslintMessage('foo', 2, '/PATH'),
    ]);
    const expectedErrorsByFile = {
      '/PATH': {
        filePath: '/PATH',
        errorsByLineNumber: {1: makeLineErrors([], ['foo', 'bar'])},
      },
    };
    expect(compareFiles(lintResult, expectedErrorsByFile))
        .to.throw(Error, 'bar');
  });

  it("should throw when there's an unused eslint error", () => {
    const lintResult = makeEslintResult('/PATH', [
      makeEslintMessage('foo', 2, '/PATH'),
      makeEslintMessage('bar', 2, '/PATH'),
    ]);
    const expectedErrorsByFile = {
      '/PATH': {
        filePath: '/PATH',
        errorsByLineNumber: {1: makeLineErrors([], ['foo'])},
      },
    };
    expect(compareFiles(lintResult, expectedErrorsByFile))
        .to.throw(Error, 'bar');
  });
});

describe('errorCompare.verifyEslintErrorsUsed', () => {

  /**
   * @param {string} ruleId
   * @param {line} line
   * @param {!Object<number, !types.LineErrors>} errorsByLineNumber
   * @return {function():void}
   */
  function verifyEslintAll(ruleId, line, errorsByLineNumber) {
    const eslintMessage = makeEslintMessage(ruleId, line);
    const expectedErrors = {
      filePath: '/FAKE_PATH',
      errorsByLineNumber,
    };
    return function verifyEslintAllWrapper() {
      return errorCompare.verifyEslintErrorsUsed(eslintMessage, expectedErrors);
    };
  }

  /**
   * @param {string} ruleId
   * @param {!Array<string>} expectedRules
   * @return {function():void}
   */
  function verifyEslintSingleLine(ruleId, expectedRules) {
    const line = 1;
    return verifyEslintAll(ruleId, line + 1, {
      [line]: {usedRules: new Set(), expectedRules},
    });
  }

  it('should not throw when a matching expected error is found', () => {
    expect(verifyEslintSingleLine('foo', ['foo'])).not.to.throw(Error);
  });

  it('should not throw when a matching expected error is found', () => {
    expect(verifyEslintSingleLine('foo', ['bar', 'foo'])).not.to.throw(Error);
  });

  it('should throw when no matching expected error is found', () => {
    expect(verifyEslintSingleLine('foo', [])).to.throw(Error, 'foo');
  });

  it('should throw when no matching expected error is found', () => {
    expect(verifyEslintSingleLine('foo', ['bar'])).to.throw(Error, 'foo');
  });

  it('should throw when matching expected error is on a different line', () => {
    expect(verifyEslintAll('foo', 2, {
      5: {usedRules: new Set(), expectedRules: ['foo']},
    }));
  });
});


describe('errorCompare.verifyExpectedErrorsUsed', () => {
  /**
   * @param {!Object<number, !types.LineErrors>} errorsByLineNumber
   * @return {function():void}
   */
  function verifyExpectedAll(errorsByLineNumber) {
    const expectedErrors = {
      filePath: '/FAKE_PATH',
      errorsByLineNumber,
    };
    return function verifyExpectedAllWrapper() {
      return errorCompare.verifyExpectedErrorsUsed(expectedErrors);
    };
  }

  /**
   * @param {!Set<string>} usedRules
   * @param {!Array<string>} expectedRules
   * @return {function():void}
   */
  function verifyExpectedSingleLine(usedRules, expectedRules) {
    return verifyExpectedAll({
      1: {usedRules: new Set(usedRules), expectedRules},
    });
  }

  it('should not throw for no errors', () => {
    expect(verifyExpectedSingleLine([], [])).not.to.throw(Error);
  });

  it('should throw for one unused expected error', () => {
    expect(verifyExpectedSingleLine([], ['fooRule']))
        .to.throw(Error, 'fooRule');
  });

  it('should throw for two missing expected errors', () => {
    expect(verifyExpectedSingleLine([], ['foo', 'bar']))
        .to.throw(Error, 'foo, bar');
  });

  it('should not throw one used expected error', () => {
    expect(verifyExpectedSingleLine(['foo'], ['foo'])).not.to.throw(Error);
  });

  it('should throw one used expected error', () => {
    expect(verifyExpectedSingleLine(['foo'], ['foo'])).not.to.throw(Error);
  });

  it('should throw for one unused expected error on 2nd line', () => {
    expect(verifyExpectedAll({
      1: {usedRules: new Set(['foo']), expectedRules: ['foo']},
      2: {usedRules: new Set([]), expectedRules: ['bar']},
    })).to.throw(Error, 'bar');
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
