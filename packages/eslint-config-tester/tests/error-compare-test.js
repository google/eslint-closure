// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Tests for errorCompare.
 * @suppress {reportUnknownTypes}
 */

goog.module('eslintClosure.configTester.tests.errorCompareTest');
goog.setTestOnly();

const errorCompare = goog.require('eslintClosure.configTester.errorCompare');
const googSet = goog.require('goog.structs.Set');
const types = goog.require('eslintClosure.configTester.types');

const chai = /** @type {!Chai.Module} */ (require('chai'));

/* global describe it */
const expect = chai.expect;

function makeLineErrors(eslintRules, expectedRules, filePath = 'fake/file/path',
                        line = 3) {
  return {
    eslintRules: new googSet(eslintRules),
    expectedRules: new googSet(expectedRules),
    filePath,
    line,
  };
}

function makeExpectedErrors(errorsByLineNumber, filePath = '/fake/file') {
  return {
    filePath,
    errorsByLineNumber,
  };
}

describe('errorCompare.compareEslintToExpected', () => {
  function compareEslint(expectedErrorsByFile) {
    return function compareEslintWrapper() {
      return errorCompare.compareEslintToExpected(expectedErrorsByFile);
    };
  }

  it('should not throw for no files', () => {
    expect(compareEslint({})).not.to.throw(Error);
  });


  it('should not throw for matching errors', () => {
    const errors = {
      'path/foo': makeExpectedErrors({
        2: makeLineErrors(['bar', 'baz'], ['bar', 'baz']),
      }),
    };
    expect(compareEslint(errors)).not.to.throw(Error, '/PATH');
  });

  it('should not throw for matching errors multiple files', () => {
    const errors = {
      'path/foo': makeExpectedErrors({
        2: makeLineErrors(['bar', 'baz'], ['bar', 'baz']),
      }),
      'path/bar': makeExpectedErrors({
        2: makeLineErrors(['bar', 'baz'], ['bar', 'baz']),
        4: makeLineErrors(['bar', 'baz'], ['bar', 'baz']),
      }),
    };
    expect(compareEslint(errors)).not.to.throw(Error, '/PATH');
  });

  it('should throw for unmatched errors', () => {
    const errors = {
      'fake/file/path': makeExpectedErrors({
        2: makeLineErrors(['baz'], ['bar', 'baz']),
      }),
    };
    expect(compareEslint(errors)).to.throw(Error, 'fake/file/path');
  });

});

describe('errorCompare.compareErrorsForFile', () => {
  function compareFiles(errorsByLineNumber) {
    return function compareFilesWrapper() {
      return errorCompare.compareErrorsForFile(
          makeExpectedErrors(errorsByLineNumber));
    };
  }

  it('should not throw for no files', () => {
    expect(compareFiles({})).not.to.throw(Error);
  });

  it('should not throw when expected errors match', () => {
    const errorsByLine = {1: makeLineErrors(['foo'], ['foo'])};
    expect(compareFiles(errorsByLine)).not.to.throw(Error);
  });

  it('should not throw when expected errors match on 2 lines', () => {
    const errorsByLine = {
      1: makeLineErrors(['foo'], ['foo']),
      3: makeLineErrors(['bar', 'baz'], ['bar', 'baz']),
    };
    expect(compareFiles(errorsByLine)).not.to.throw(Error);
  });

  it("should throw when there's an unused expected error", () => {
    const errorsByLine = {1: makeLineErrors([], ['bar'])};
    expect(compareFiles(errorsByLine)).to.throw(Error, 'bar');
  });

  it("should throw when there's an unused eslint error", () => {
    const errorsByLine = {1: makeLineErrors(['bar'], [])};
    expect(compareFiles(errorsByLine)).to.throw(Error, 'bar');
  });
  it('should throw when errors don\'t match on multiple lines', () => {
    const errorsByLine = {
      1: makeLineErrors(['foo'], ['foo']),
      3: makeLineErrors(['bar', 'baz'], ['bar']),
    };
    expect(compareFiles(errorsByLine)).to.throw(Error);
  });

});

describe('errorCompare.verifyEslintErrorsUsed', () => {
  function verifyEslint(eslintRules, expectedRules) {
    const lineErrors = makeLineErrors(eslintRules, expectedRules);
    return function verifyEslintAllWrapper() {
      return errorCompare.verifyEslintErrors(lineErrors);
    };
  }

  it('should not throw when a matching expected error is found', () => {
    expect(verifyEslint(['foo'], ['foo'])).not.to.throw(Error);
  });

  it('should not throw when a matching expected error is found', () => {
    expect(verifyEslint(['foo'], ['bar', 'foo'])).not.to.throw(Error);
  });

  it('should throw when no matching expected error is found', () => {
    expect(verifyEslint(['foo'], [])).to.throw(Error, 'foo');
  });

  it('should throw when no matching expected error is found', () => {
    expect(verifyEslint(['foo'], ['bar'])).to.throw(Error, 'foo');
  });
});


describe('errorCompare.verifyExpectedErrors', () => {
  function verifyExpected(eslintRules, expectedRules) {
    const lineErrors = makeLineErrors(eslintRules, expectedRules);
    return function verifyExpectedAllWrapper() {
      return errorCompare.verifyExpectedErrors(lineErrors);
    };
  }

  it('should not throw for no errors', () => {
    expect(verifyExpected([], [])).not.to.throw(Error);
  });

  it('should throw for one unused expected error', () => {
    expect(verifyExpected([], ['fooRule']))
        .to.throw(Error, 'fooRule');
  });

  it('should throw for two missing expected errors', () => {
    expect(verifyExpected([], ['foo', 'bar']))
        .to.throw(Error, 'foo, bar');
  });

  it('should not throw one used expected error', () => {
    expect(verifyExpected(['foo'], ['foo'])).not.to.throw(Error);
  });

  it('should throw one used expected error', () => {
    expect(verifyExpected(['foo'], ['foo'])).not.to.throw(Error);
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
        .to.eql('/foo:2 - EXPLANATION');
  });
});
