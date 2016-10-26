/**
 * @fileoverview Tests for ast.
 */

/* global describe it */

goog.module('googlejs.tests.ast');
goog.setTestOnly('googlejs.tests.ast');

const ast = goog.require('googlejs.ast');

const chai = /** @type {!Chai.Module} */ (require('chai'));
const eslint = /** @type {!ESLint.Module} */ (require('eslint'));

const expect = chai.expect;
const linter = eslint.linter;

describe('matchStringLiteral', () => {

  const parseMatchString = (code) => {
    const filename = 'test.js';
    const eslintOptions = {rules: {}};
    let isMatch;
    linter.reset();
    linter.once('Literal', (node) => {
      isMatch = ast.matchStringLiteral(node);
    });
    linter.verify(code, eslintOptions, filename, true);
    return isMatch;
  };

  it('should match string literals', () => {
    expect(parseMatchString(`'foo';`)).to.eql({});
    expect(parseMatchString(`"foo";`)).to.eql({});
  });

  it('should not match non-string literals', () => {
    // NOTE: undefined is an identifier, not a literal.
    expect(parseMatchString(`null;`)).to.equal(false);
    expect(parseMatchString(`true;`)).to.equal(false);
    expect(parseMatchString(`false;`)).to.equal(false);
  });
});

describe('matchExtractBareGoogRequire', () => {
  const parseMatchRequire = (code) => {
    const filename = 'test.js';
    const eslintOptions = {rules: {}};
    let requireSource;
    linter.reset();
    linter.once('ExpressionStatement', (node) => {
      requireSource = ast.matchExtractBareGoogRequire(node);
    });
    linter.verify(code, eslintOptions, filename, true);
    return requireSource;
  };

  it('should match and extract bare goog.require calls', () => {
    expect(parseMatchRequire('goog.require("foo")')).to.eql({source: 'foo'});
    expect(parseMatchRequire('goog.require("foo.bar")'))
        .to.eql({source: 'foo.bar'});
  });

  it('should not match non string literal goog.require calls', () => {
    expect(parseMatchRequire('goog.require(a)')).to.equal(false);
    expect(parseMatchRequire('goog.require(1)')).to.equal(false);
    expect(parseMatchRequire('goog.require(null)')).to.equal(false);
    expect(parseMatchRequire('goog.require(undefined)')).to.equal(false);
  });

  it('should not match non goog.require calls', () => {
    expect(parseMatchRequire('goo.require("foo")')).to.equal(false);
    expect(parseMatchRequire('require("foo.bar")')).to.equal(false);
    expect(parseMatchRequire('goog.requir("foo.bar")')).to.equal(false);
  });

  it('should not match variable assigned goog.require calls', () => {
    // matchExtractBareGoogRequire never looks at these because they are
    // Expressions, not ExpressionStatements.
    expect(parseMatchRequire('var a = goog.require("foo")'))
        .to.equal(undefined);
    expect(parseMatchRequire('var a = goog.require("foo.bar")'))
        .to.equal(undefined);
  });
});

describe('matchExtractGoogProvide', () => {

  const matchProvide = (code) => {
    const filename = 'test.js';
    const eslintOptions = {rules: {}};
    let provideSource;
    linter.reset();
    linter.once('ExpressionStatement', (node) => {
      provideSource = ast.matchExtractGoogProvide(node);
    });
    linter.verify(code, eslintOptions, filename, true);
    return provideSource;
  };

  it('should match and extract bare goog.provide calls', () => {
    expect(matchProvide('goog.provide("foo")')).to.eql({source: 'foo'});
    expect(matchProvide('goog.provide("foo.bar")'))
        .to.eql({source: 'foo.bar'});
  });

  it('should not match non string literal goog.provide calls', () => {
    expect(matchProvide('goog.provide(a)')).to.equal(false);
    expect(matchProvide('goog.provide(1)')).to.equal(false);
    expect(matchProvide('goog.provide(null)')).to.equal(false);
    expect(matchProvide('goog.provide(undefined)')).to.equal(false);
  });

  it('should not match non goog.provide calls', () => {
    expect(matchProvide('goo.provide("foo")')).to.equal(false);
    expect(matchProvide('provide("foo.bar")')).to.equal(false);
    expect(matchProvide('goog.provid("foo.bar")')).to.equal(false);
  });

  // NOTE: This is illegal in closure code, but leave it in to ensure we aren't
  // parsing it.
  it('should not match variable assigned goog.provide calls', () => {
    expect(matchProvide('var a = goog.provide("foo")')).to.equal(undefined);
    expect(matchProvide('var a = goog.provide("foo.bar")'))
        .to.equal(undefined);
  });
});

