/**
 * @fileoverview Tests for jsdoc-utils.
 */

/* global describe it */
goog.module('googlejs.tests.jsdocUtils');
goog.setTestOnly('googlejs.tests.jsdocUtils');

const jsdocUtils = goog.require('googlejs.jsdocUtils');

const chai = /** @type {!Chai.Module} */ (require('chai'));
const expect = chai.expect;

describe('parseComment', () => {
  const parseComment = jsdocUtils.parseComment;
  it('should parse a comment string', () => {
    expect(parseComment('* Empty')).to.include.keys('description', 'tags');
    expect(parseComment('* @return {void}'))
        .to.include.keys('description', 'tags');
  });

  const parseCommentWrapper = (c) => () => jsdocUtils.parseComment(c);
  it('should throw a missing brace error when missing braces', () => {
    expect(parseCommentWrapper('* @param{')).to.throw(/missing brace/);
    expect(parseCommentWrapper('* @return')).to.throw(/missing brace/);
  });

  it('should throw a syntax error on malformed JSDoc', () => {
    expect(parseCommentWrapper('* @return {(number|)}')).to.throw(/syntax error/);
  });
});
