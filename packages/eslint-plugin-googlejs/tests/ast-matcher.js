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
const matchesLength = astMatcher.matchesLength;

describe('astMatcher.matchesAST', () => {

  it('should correctly match simple ASTs', () => {
    expect(matchesAST({})({})).to.eql({});

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


  it('should return false when not matching', () => {
    expect(isASTMatch({}, {a: 1})).to.equal(false);
    expect(isASTMatch({a: 1}, {a: 2})).to.equal(false);
    expect(isASTMatch({a: 1}, {a: 1, b: 2})).to.equal(false);
    expect(isASTMatch({a: 1, b: 2}, {a: 1})).to.equal(false);
    expect(isASTMatch({a: 1, b: 2}, {b: 2, c: 3})).to.equal(false);
    expect(isASTMatch({a: 1, b: 2}, {a: 1, b: 3})).to.equal(false);
    expect(isASTMatch({a: 1, b: []}, {b: [2]})).to.equal(false);
    expect(isASTMatch({a: 1, b: {}}, {a: 1, b: {c: 3}})).to.equal(false);
    expect(isASTMatch({a: {b: 2}, c: {}}, {a: {b: 2, c: 3}})).to.equal(false);
    expect(isASTMatch({a: {b: 2}, c: {}}, {a: {b: [2]}})).to.equal(false);
  });

});
