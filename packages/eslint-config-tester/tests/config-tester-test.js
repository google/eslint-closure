/**
 * @fileoverview Tests for config-tester.
 * @suppress {reportUnknownTypes}
 */

goog.module('eslintClosure.configTester.tests.configTesterTest');
goog.setTestOnly();

const configTester = goog.require('eslintClosure.configTester.runner');
const googSet = goog.require('goog.structs.Set');
const types = goog.require('eslintClosure.configTester.types');

const chai = /** @type {!Chai.Module} */ (require('chai'));

/* global describe it */
const expect = chai.expect;

function makeLineErrors(eslintRules, expectedRules, filePath = '/PATH',
                        line = 3) {
  return {
    eslintRules: new googSet(eslintRules),
    expectedRules: new googSet(expectedRules),
    filePath,
    line,
  };
}

function makeExpectedErrors(errorsByLineNumber, filePath = '/PATH') {
  return {
    filePath,
    errorsByLineNumber,
  };
}

function makeEslintResult(messages, filePath = '/PATH') {
  return {
    filePath,
    messages,
    errorCount: 7,
    warningCount: 9,
  };
}

function makeEslintMessage(ruleId, line) {
  return {
    ruleId,
    line,
    severity: 1,
    nodeType: 'Identifier',
    column: 77,
    message: 'FAKE MESSAGE',
    source: 'FAKE SOURCE',
  };
}

describe('configTester.addAllExpectedErrors', () => {
  const addExpected = configTester.addAllExpectedErrors;

  it('should do nothing adding empty things', () => {
    expect(addExpected({}, [])).to.eql({});
  });

  it('should add one error to empty object', () => {
    const errorsByFilename = {};
    const error1 = makeExpectedErrors({1: makeLineErrors(['foo'], ['foo'])});
    const allExpectedErrors = [error1];
    expect(addExpected(errorsByFilename, allExpectedErrors)).to.eql({
      '/PATH': error1,
    });
  });

  it('should add many errors to existing object', () => {
    const errorsByFilename = {};
    const error1 = makeExpectedErrors({
      1: makeLineErrors(['foo'], ['foo']),
    }, '/ORIG');
    const error2 = makeExpectedErrors({
      3: makeLineErrors(['foo'], ['foo']),
      5: makeLineErrors(['foo'], ['foo']),
    });
    const allExpectedErrors = [error1, error2];
    expect(addExpected(errorsByFilename, allExpectedErrors)).to.eql({
      '/ORIG': error1,
      '/PATH': error2,
    });
  });
});

describe('configTester.parseExpectedErrorsInString', () => {
  const parse = configTester.parseExpectedErrorsInString;
  it('should handle an empty string', () => {
    const content = ``;
    expect(parse(content)).to.eql({});
  });

  it('should parse an error on first line', () => {
    const content = `// ERROR: foo`;
    const filePath = 'myFile';
    expect(parse(content, filePath)).to.eql({
      2: makeLineErrors([], ['foo'], filePath, 2),
    });
  });

  it('should parse an error at the end of the line', () => {
    const content = `var a = 1; // ERROR: foo`;
    const filePath = 'myFile';
    expect(parse(content, filePath)).to.eql({
      1: makeLineErrors([], ['foo'], filePath, 1),
    });
  });

  it('should parse an error within JSDOC', () => {
    const content = `/**
 * @param {number} foo ERROR: foo
 */`;
    const filePath = 'myFile';
    expect(parse(content, filePath)).to.eql({
      2: makeLineErrors([], ['foo'], filePath, 2),
    });
  });

  it('should parse an error with whitespace', () => {
    const content = `\n   // ERROR:   foo`;
    const filePath = 'myFile';
    expect(parse(content, filePath)).to.eql({
      3: makeLineErrors([], ['foo'], filePath, 3),
    });
  });

  it('should parse multiple errors', () => {
    const content = `// ERROR: foo, bar, baz`;
    const filePath = 'myFile';
    expect(parse(content, filePath)).to.eql({
      2: makeLineErrors([], ['foo', 'bar', 'baz'], filePath, 2),
    });
  });

  it('should parse multiple errors on multiple lines', () => {
    const content = `// ERROR: foo, bar, baz
function() {
  // ERROR: qux
  return 2;
}

// ERROR: bat, baz
`;
    const filePath = 'myFile';
    expect(parse(content, filePath)).to.eql({
      2: makeLineErrors([], ['foo', 'bar', 'baz'], filePath, 2),
      4: makeLineErrors([], ['qux'], filePath, 4),
      8: makeLineErrors([], ['bat', 'baz'], filePath, 8),
    });
  });
});

describe('configTester.addAllEslintErrors', () => {
  const addEslint = configTester.addAllEslintErrors;

  it('should do nothing adding empty things', () => {
    expect(addEslint({}, [])).to.eql({});
  });

  it('should add one error to empty object', () => {
    const errorsByFilename = {};
    const error1 = makeEslintResult([makeEslintMessage('foo', 2)]);
    const eslintResults = [error1];
    expect(addEslint(errorsByFilename, eslintResults)).to.eql({
      '/PATH': makeExpectedErrors({
        2: makeLineErrors(['foo'], [], '/PATH', 2),
      }, '/PATH'),
    });
  });

  it('should add many errors to the empty object', () => {
    const errorsByFilename = {};
    const error1 = makeEslintResult([makeEslintMessage('foo', 2)]);
    const error2 = makeEslintResult(
        [makeEslintMessage('qux', 4), makeEslintMessage('bar', 4)],
        '/FOO'
    );
    const eslintResults = [error1, error2];
    expect(addEslint(errorsByFilename, eslintResults)).to.eql({
      '/PATH': makeExpectedErrors({
        2: makeLineErrors(['foo'], [], '/PATH', 2),
      }, '/PATH'),
      '/FOO': makeExpectedErrors({
        4: makeLineErrors(['qux', 'bar'], [], '/FOO', 4),
      }, '/FOO'),
    });
  });

  it('should add many errors to the existing object', () => {
    const errorsByFilename = {
      '/PATH': makeExpectedErrors({
        2: makeLineErrors([], ['foo'], '/PATH', 2),
      }, '/PATH'),
    };
    const error1 = makeEslintResult([makeEslintMessage('foo', 2)]);
    const error2 = makeEslintResult(
        [makeEslintMessage('qux', 4), makeEslintMessage('bar', 4)],
        '/FOO'
    );
    const eslintResults = [error1, error2];
    expect(addEslint(errorsByFilename, eslintResults)).to.eql({
      '/PATH': makeExpectedErrors({
        2: makeLineErrors(['foo'], ['foo'], '/PATH', 2),
      }, '/PATH'),
      '/FOO': makeExpectedErrors({
        4: makeLineErrors(['qux', 'bar'], [], '/FOO', 4),
      }, '/FOO'),
    });
  });

});
