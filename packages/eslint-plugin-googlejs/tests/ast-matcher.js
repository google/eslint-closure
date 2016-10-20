/**
 * @fileoverview Tests for astMatcher.
 */

/* global describe it */

goog.module('googlejs.tests.astMatcher');
goog.setTestOnly('googlejs.tests.astMatcher');

const astMatcher = goog.require('googlejs.astMatcher');

const chai = /** @type {!Chai.Module} */ (require('chai'));

const expect = chai.expect;

const matchesAST = astMatcher.matchesAST;
const isASTMatch = astMatcher.isASTMatch;
const extract = astMatcher.extract;

describe('astMatcher.matchesAST', () => {

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
    expect(isASTMatch({a: 1}, {a: extract('d')})).to.eql({d: 1});
    expect(isASTMatch({a: 1, b: 2}, {a: extract('c'), b: extract('d')}))
        .to.eql({c: 1, d: 2});
    expect(isASTMatch({a: {b: {c: 3}}}, {a: extract('f', {b: {c: 3}})}))
        .to.eql({f: {b: {c: 3}}});
    expect(isASTMatch({a: {b: {c: 3, d: 4}}}, {a: extract('f', {b: {c: 3}})}))
        .to.eql({f: {b: {c: 3, d: 4}}});
    expect(isASTMatch(
        {a: {b: {c: 3, d: 4}}},
        {a: extract('f', {b: {c: extract('g')}})}))
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


describe('astMatcher.extract', () => {

  it('should return an ast with no matcher', () => {
    expect(extract('a')({})).to.eql({a: {}});
    expect(extract('b')({c: 2})).to.eql({b: {c: 2}});
    expect(extract('b')({c: []})).to.eql({b: {c: []}});
  });

  it('should return an ast when an object literal matcher matches', () => {
    expect(extract('a', {})({})).to.eql({a: {}});
    expect(extract('b', {c: 3})({c: 3})).to.eql({b: {c: 3}});
    expect(extract('c', {a: 1})({a: 1})).to.eql({c: {a: 1}});
    expect(extract('c', {a: 1})({a: 1, b: 2})).to.eql({c: {a: 1, b: 2}});
    expect(extract('c', {b: 2})({a: 1, b: 2})).to.eql({c: {a: 1, b: 2}});
    expect(extract('c', {a: 1, b: 2})({a: 1, b: 2})).to.eql({c: {a: 1, b: 2}});
    expect(extract('c', {b: []})({a: 1, b: []})).to.eql({c: {a: 1, b: []}});
    expect(extract('c', {a: 1})({a: 1, b: {}})).to.eql({c: {a: 1, b: {}}});
  });

  it("should return false when object literal matcher doesn't match", () => {
    expect(extract('a', {b: 2})({})).to.equal(false);
    expect(extract('b', {c: 4})({c: 3})).to.equal(false);
    expect(extract('c', {a: 2})({a: 1})).to.equal(false);
    expect(extract('c', {a: 1, c: 3})({a: 1, b: 2})).to.equal(false);
    expect(extract('c', {b: []})({a: 1, b: 2})).to.equal(false);
    expect(extract('c', {a: 1, b: {}})({a: 1, b: 2})).to.equal(false);
    expect(extract('c', {d: []})({a: 1, b: []})).to.equal(false);
    expect(extract('c', {a: 'a'})({a: 1, b: {}})).to.equal(false);
  });

  it('should return an ast when a function matcher matches', () => {
    expect(extract('a', () => true)({})).to.eql({a: {}});
    expect(extract('b', (ast) => ast['c'] == 3)({c: 3})).to.eql({b: {c: 3}});
    expect(extract('c', extract('d', {a: 1}))({a: 1}))
        .to.eql({c: {a: 1}, d: {a: 1}});
  });

  it('should return false when a function matcher fails', () => {
    expect(extract('a', () => false)({})).to.equal(false);
    expect(extract('b', (ast) => ast['c'] == 5)({c: 3})).to.equal(false);
    expect(extract('c', extract('d', {b: 1}))({a: 1})).to.equal(false);
  });
});
