/**
 * @fileoverview Tests for ast-info.js.
 */

/* global describe it */
goog.module('googlejs.tests.astInfo');
goog.setTestOnly('googlejs.tests.astInfo');

const astInfo = goog.require('googlejs.astInfo');

const chai = /** @type {!Chai.Module} */ (require('chai'));
const eslint = /** @type {!ESLint.Module} */ (require('eslint'));

const expect = chai.expect;
const linter = eslint.linter;

describe('getFullyQualifedName', () => {

  const getFullName = (code) => {
    const filename = 'test.js';
    const eslintOptions = {
      rules: {},
    };
    let fullName;
    linter.reset();
    linter.once('Identifier', (node) => {
      fullName = astInfo.getFullyQualifedName(node);
    });
    linter.verify(code, eslintOptions, filename, true);
    return fullName;
  };

  it('should get the outer most member expression property name', () => {
    expect(getFullName(`foo;`)).to.equal('foo');
    expect(getFullName(`foo.bar;`)).to.equal('foo.bar');
    expect(getFullName(`foo.bar.baz`)).to.equal('foo.bar.baz');
    expect(getFullName(`foo.bar.baz.qux`)).to.equal('foo.bar.baz.qux');

    expect(getFullName(`foo();`)).to.equal('foo');
    expect(getFullName(`foo.bar();`)).to.equal('foo.bar');
    expect(getFullName(`foo.bar.baz()`)).to.equal('foo.bar.baz');
    expect(getFullName(`foo.bar.baz.qux()`)).to.equal('foo.bar.baz.qux');
  });
});
