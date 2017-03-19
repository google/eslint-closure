/**
 * @fileoverview Tests for astMatcher.
 * @suppress {reportUnknownTypes}
 */

/* global describe it */

goog.module('eslintClosure.tests.astMatcher');

const astMatcher = goog.require('eslintClosure.astMatcher');

const chai = /** @type {!Chai.Module} */ (require('chai'));

const expect = chai.expect;

describe('astMatcher.matchesAST', () => {
  const matchesAST = astMatcher.matchesAST;

  it('should correctly match simple ASTs', () => {
    expect(matchesAST({})({})).to.eql({});
    expect(matchesAST({})({a: 1})).to.eql({});
    expect(matchesAST({a: 1})({a: 1})).to.eql({});
    expect(matchesAST({a: 1})({a: 1, b: 2})).to.eql({});
    expect(matchesAST({b: 2})({a: 1, b: 2})).to.eql({});
    expect(matchesAST({a: 1, b: 2})({a: 1, b: 2})).to.eql({});
    expect(matchesAST({b: []})({a: 1, b: []})).to.eql({});
    expect(matchesAST({a: 1})({a: 1, b: {}})).to.eql({});
    expect(matchesAST({a: {b: 2}})({a: {b: 2}, c: {}})).to.eql({});
    expect(matchesAST({a: {b: 2}, c: {}})({a: {b: 2}, c: {}})).to.eql({});
  });

  it('should return false when not matching', () => {
    expect(matchesAST({a: 1})({})).to.equal(false);
    expect(matchesAST({a: 2})({a: 1})).to.equal(false);
    expect(matchesAST({a: 1, b: 2})({a: 1})).to.equal(false);
    expect(matchesAST({a: {}})({a: 1, b: 2})).to.equal(false);
    expect(matchesAST({b: 2, c: 3})({a: 1, b: 2})).to.equal(false);
    expect(matchesAST({a: 1, b: 3})({a: 1, b: 2})).to.equal(false);
    expect(matchesAST({b: [2]})({a: 1, b: []})).to.equal(false);
    expect(matchesAST({a: 1, b: {c: 3}})({a: 1, b: {}})).to.equal(false);
    expect(matchesAST({a: {b: 2, c: 3}})({a: {b: 2}, c: {}})).to.equal(false);
    expect(matchesAST({a: {b: [2]}})({a: {b: 2}, c: {}})).to.equal(false);
  });

});

describe('astMatcher.isASTMatch', () => {
  const isASTMatch = astMatcher.isASTMatch;
  const extractAST = astMatcher.extractAST;

  it('should correctly match simple ASTs', () => {
    expect(isASTMatch({}, {})).to.eql({});
    expect(isASTMatch({a: 1}, {})).to.eql({});
    expect(isASTMatch({a: 1}, {a: 1})).to.eql({});
    expect(isASTMatch({a: 1, b: 2}, {a: 1})).to.eql({});
    expect(isASTMatch({a: 1, b: 2}, {b: 2})).to.eql({});
    expect(isASTMatch({a: 1, b: 2}, {a: 1, b: 2})).to.eql({});
    expect(isASTMatch({a: 1, b: []}, {b: []})).to.eql({});
    expect(isASTMatch({a: 1, b: {}}, {a: 1})).to.eql({});
    expect(isASTMatch({a: {b: 2}, c: {}}, {a: {b: 2}})).to.eql({});
    expect(isASTMatch({a: {b: 2}, c: {}}, {a: {b: 2}, c: {}})).to.eql({});
  });

  it('should return extracted fields when matching', () => {
    expect(isASTMatch({a: 1}, {a: extractAST('d')})).to.eql({d: 1});
    expect(isASTMatch({a: 1, b: 2}, {a: extractAST('c'), b: extractAST('d')}))
        .to.eql({c: 1, d: 2});
    expect(isASTMatch({a: {b: {c: 3}}}, {a: extractAST('f', {b: {c: 3}})}))
        .to.eql({f: {b: {c: 3}}});
    expect(isASTMatch({a: {b: {c: 3, d: 4}}},
                      {a: extractAST('f', {b: {c: 3}})}))
        .to.eql({f: {b: {c: 3, d: 4}}});
    expect(isASTMatch(
        {a: {b: {c: 3, d: 4}}},
        {a: extractAST('f', {b: {c: extractAST('g')}})}))
        .to.eql({f: {b: {c: 3, d: 4}}, g: 3});
  });

  it('should return false when not matching', () => {
    expect(isASTMatch({}, {a: 1})).to.equal(false);
    expect(isASTMatch({a: 1}, {a: 2})).to.equal(false);
    expect(isASTMatch({a: 1}, {a: 1, b: 2})).to.equal(false);
    expect(isASTMatch({a: 1, b: 2}, {a: {}})).to.equal(false);
    expect(isASTMatch({a: 1, b: 2}, {b: 2, c: 3})).to.equal(false);
    expect(isASTMatch({a: 1, b: 2}, {a: 1, b: 3})).to.equal(false);
    expect(isASTMatch({a: 1, b: []}, {b: [2]})).to.equal(false);
    expect(isASTMatch({a: 1, b: {}}, {a: 1, b: {c: 3}})).to.equal(false);
    expect(isASTMatch({a: {b: 2}, c: {}}, {a: {b: 2, c: 3}})).to.equal(false);
    expect(isASTMatch({a: {b: 2}, c: {}}, {a: {b: [2]}})).to.equal(false);
  });
});


describe('astMatcher.extractAST', () => {
  const extractAST = astMatcher.extractAST;

  it('should return an ast with no matcher', () => {
    expect(extractAST('a')({})).to.eql({a: {}});
    expect(extractAST('b')({c: 2})).to.eql({b: {c: 2}});
    expect(extractAST('b')({c: []})).to.eql({b: {c: []}});
  });

  it('should return an ast when an object literal matcher matches', () => {
    expect(extractAST('a', {})({})).to.eql({a: {}});
    expect(extractAST('b', {c: 3})({c: 3})).to.eql({b: {c: 3}});
    expect(extractAST('c', {a: 1})({a: 1})).to.eql({c: {a: 1}});
    expect(extractAST('c', {a: 1})({a: 1, b: 2})).to.eql({c: {a: 1, b: 2}});
    expect(extractAST('c', {b: 2})({a: 1, b: 2})).to.eql({c: {a: 1, b: 2}});
    expect(extractAST('c', {a: 1, b: 2})({a: 1, b: 2}))
        .to.eql({c: {a: 1, b: 2}});
    expect(extractAST('c', {b: []})({a: 1, b: []})).to.eql({c: {a: 1, b: []}});
    expect(extractAST('c', {a: 1})({a: 1, b: {}})).to.eql({c: {a: 1, b: {}}});
  });

  it("should return false when object literal matcher doesn't match", () => {
    expect(extractAST('a', {b: 2})({})).to.equal(false);
    expect(extractAST('b', {c: 4})({c: 3})).to.equal(false);
    expect(extractAST('c', {a: 2})({a: 1})).to.equal(false);
    expect(extractAST('c', {a: 1, c: 3})({a: 1, b: 2})).to.equal(false);
    expect(extractAST('c', {b: []})({a: 1, b: 2})).to.equal(false);
    expect(extractAST('c', {a: 1, b: {}})({a: 1, b: 2})).to.equal(false);
    expect(extractAST('c', {d: []})({a: 1, b: []})).to.equal(false);
    expect(extractAST('c', {a: 'a'})({a: 1, b: {}})).to.equal(false);
  });

  it('should return an ast when a function matcher matches', () => {
    expect(extractAST('a', () => true)({})).to.eql({a: {}});
    expect(extractAST('b', (ast) => ast['c'] == 3)({c: 3})).to.eql({b: {c: 3}});
    expect(extractAST('c', extractAST('d', {a: 1}))({a: 1}))
        .to.eql({c: {a: 1}, d: {a: 1}});
  });

  it('should return false when a function matcher fails', () => {
    expect(extractAST('a', () => false)({})).to.equal(false);
    expect(extractAST('b', (ast) => ast['c'] == 5)({c: 3})).to.equal(false);
    expect(extractAST('c', extractAST('d', {b: 1}))({a: 1})).to.equal(false);
  });
});

describe('astMatcher.matchesASTLength', () => {
  const matchesASTLength = astMatcher.matchesASTLength;
  const extractAST = astMatcher.extractAST;

  it('should return an empty object when matching', () => {
    expect(matchesASTLength([])([])).to.eql({});
    expect(matchesASTLength([{a: 1}])([{a: 1}])).to.eql({});
    expect(matchesASTLength([{a: 1}])([{a: 1, b: 2}])).to.eql({});
  });

  it('should return an extracted objects when matching', () => {
    expect(matchesASTLength([extractAST('a')])([{}])).to.eql({a: {}});
    expect(matchesASTLength([{a: extractAST('a')}])([{a: 1}])).to.eql({a: 1});
    expect(matchesASTLength([extractAST('b')])([{a: 1, b: 2}]))
        .to.eql({b: {a: 1, b: 2}});
  });

  it('should not match arrays with different lengths', () => {
    expect(matchesASTLength([])([1])).to.equal(false);
    expect(matchesASTLength([{a: 1}])([{a: 1}, {b: 2}])).to.equal(false);
    expect(matchesASTLength([{a: 1}, {b: 2}])([{a: 1}])).to.equal(false);
  });
});
