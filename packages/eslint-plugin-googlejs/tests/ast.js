/**
 * @fileoverview Tests for ast.
 */

/* global describe it */

goog.module('googlejs.tests.ast');
goog.setTestOnly('googlejs.tests.ast');

const ast = goog.require('googlejs.ast');

const chai = /** @type {!Chai.Module} */ (require('chai'));
const espree = /** @type {!Espree.Module} */ (require('espree'));

const expect = chai.expect;

const DEFAULT_CONFIG = {
  ecmaVersion: 6,
  comment: true,
  tokens: true,
  range: true,
  loc: true,
};

describe('matchStringLiteral', () => {
  const parseMatchString = (sourceCode) => {
    const program = espree.parse(sourceCode, DEFAULT_CONFIG);
    // We only pass in expression statements.
    const exprStmt = /** @type {!AST.ExpressionStatement} */ (program.body[0]);
    const literal = exprStmt.expression;
    return ast.matchStringLiteral(literal);
  };

  it('should match string literals', () => {
    // console.log(parseMatchString(`'foo';`));
    expect(parseMatchString(`'foo';`)).to.eql({});
    expect(parseMatchString(`"foo";`)).to.eql({});
  });

  it('should not match non-string literals', () => {
    expect(parseMatchString(`null;`)).to.equal(false);
    expect(parseMatchString(`undefined;`)).to.equal(false);
    expect(parseMatchString(`1;`)).to.equal(false);
    expect(parseMatchString(`[];`)).to.equal(false);
    expect(parseMatchString(`{};`)).to.equal(false);
  });
});

describe('matchExtractBareGoogRequire', () => {
  const parseMatchRequire = (sourceCode) => {
    return ast.matchExtractBareGoogRequire(
        espree.parse(sourceCode, DEFAULT_CONFIG).body[0]);
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
    expect(parseMatchRequire('var a = goog.require("foo")')).to.equal(false);
    expect(parseMatchRequire('var a = goog.require("foo.bar")'))
        .to.equal(false);
  });
});

