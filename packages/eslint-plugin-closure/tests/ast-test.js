/**
 * @fileoverview Tests for ast.
 */

/* global describe it */

goog.module('eslintClosure.tests.ast');

const ast = goog.require('eslintClosure.ast');
const testUtils = goog.require('eslintClosure.testUtils');

const chai = /** @type {!Chai.Module} */ (require('chai'));

const expect = chai.expect;

describe('matchStringLiteral', () => {
  const parseMatchString = testUtils.eslintVerifier(
      'Literal', ast.matchStringLiteral);

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

describe('matchExtractDirective', () => {
  const directiveMatch = testUtils.eslintVerifier(
      'ExpressionStatement', ast.matchExtractDirective);

  it('should match and extract string literal directives', () => {
    expect(directiveMatch('"foo";')).to.eql({directive: 'foo'});
    expect(directiveMatch('"foo bar";')).to.eql({directive: 'foo bar'});
  });

  it('should not match strings used in expressions', () => {
    expect(directiveMatch('foo("str")')).to.equal(false);
    expect(directiveMatch('"foo".foreach((s) => s)')).to.equal(false);
    expect(directiveMatch('var a = "bar"')).to.equal(undefined);
  });

  it('should not match non string literals', () => {
    expect(directiveMatch('1')).to.equal(false);
    expect(directiveMatch('null')).to.equal(false);
    expect(directiveMatch('true')).to.equal(false);
    expect(directiveMatch('false')).to.equal(false);
    expect(directiveMatch('function foo() {return 2}')).to.equal(undefined);
  });
});

describe('matchExtractStringLiteral', () => {
  const literalMatchDefault = testUtils.eslintVerifier(
      'Literal', ast.matchExtractStringLiteral);

  const literalMatch = testUtils.eslintVerifier(
      'Literal',
      (node) => ast.matchExtractStringLiteral(node, 'NAME'));

  it('should match and extract string literals with a default property name',
     () => {
       expect(literalMatchDefault('"foo";')).to.eql({literal: 'foo'});
       expect(literalMatchDefault('"foo bar";')).to.eql({literal: 'foo bar'});
     });

  it('should match and extract string literals with a given property name',
     () => {
       expect(literalMatch('"foo";')).to.eql({NAME: 'foo'});
       expect(literalMatch('"foo bar";')).to.eql({NAME: 'foo bar'});
     });

  it('should not match non string literals', () => {
    expect(literalMatchDefault('1')).to.equal(false);
    expect(literalMatchDefault('null')).to.equal(false);
    expect(literalMatchDefault('true')).to.equal(false);
    expect(literalMatchDefault('false')).to.equal(false);
    expect(literalMatchDefault('function foo() {return 2}')).to.equal(false);
  });
});


describe('matchExtractBareGoogRequire', () => {
  const parseMatchRequire = testUtils.eslintVerifier(
      'ExpressionStatement', ast.matchExtractBareGoogRequire);

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

  const matchProvide = testUtils.eslintVerifier(
      'ExpressionStatement', ast.matchExtractGoogProvide);

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


describe('getFullyQualifedName', () => {

  const getFullName = testUtils.eslintVerifier(
      'Identifier',
      (node) =>
        ast.getFullyQualifedName(/** @type {!AST.Identifier} */ (node)));
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

