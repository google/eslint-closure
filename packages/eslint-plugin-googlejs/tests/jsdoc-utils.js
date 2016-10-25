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
    expect(parseCommentWrapper('* @return {(number|)}'))
        .to.throw(/syntax error/);
  });
});

describe('traverseTags', () => {
  /**
   * Parses commentString and return an array of all of the types of tags in the
   * string in a pre-order traversal.
   * @param {string} commentString
   * @return {!Array<string>}
   */
  const collect = (commentString) => {
    const collectedTags = [];
    const jsdocAST = jsdocUtils.parseComment(commentString);
    const collectTagTypes = (tag) => {
      let name = tag.type;
      if (tag.type === 'NameExpression') {
        name = tag.name;
      } else if (tag.type === 'FieldType') {
        name = tag.key;
      } else if (tag.type === 'ParameterType') {
        name = tag.name;
      }
      collectedTags.push(name);
    };

    jsdocAST.tags.forEach(
        (tag) => jsdocUtils.traverseTags(tag.type, collectTagTypes));
    return collectedTags;
  };

  it('should traverse all tags', () => {
    expect(collect('')).to.eql([]);
    expect(collect('* ')).to.eql([]);
    expect(collect('@return {*}')).to.eql(['AllLiteral']);
    // TODO(jschaf): I think this should return VoidLiteral instead of a
    // NameExpression.
    expect(collect('@return {void}')).to.eql(['void']);
    expect(collect('@return {null}')).to.eql(['NullLiteral']);
    expect(collect('@return {undefined}')).to.eql(['UndefinedLiteral']);
    expect(collect('@return {{foo: bar}}')).to.eql([
      'RecordType', 'foo', 'bar']);
    expect(collect('@return {{foo: Array<string>}}')).to.eql([
      'RecordType', 'foo', 'TypeApplication', 'Array', 'string']);
    expect(collect('@return {string}')).to.eql(['string']);
    expect(collect('@return {!string}')).to.eql(['NonNullableType', 'string']);
    expect(collect('@return {?string}')).to.eql(['NullableType', 'string']);
    expect(collect('@param {string=} foo')).to.eql(['OptionalType', 'string']);
    expect(collect('@param {...string} foo')).to.eql(['RestType', 'string']);
    expect(collect('@type {(string|number)}')).to.eql([
      'UnionType', 'string', 'number']);
    expect(collect('@return {Array<string>}'))
        .to.eql(['TypeApplication', 'Array', 'string']);
    expect(collect('@return {Object<string, string>}'))
        .to.eql(['TypeApplication', 'Object', 'string', 'string']);
    expect(collect('@return {?Object<string, string>}')).to.eql(
        ['NullableType', 'TypeApplication', 'Object', 'string', 'string']);
    expect(collect('@type {function(a: string)}')).to.eql([
      'FunctionType', 'a', 'string']);
    expect(collect('@type {function(a: string):number}')).to.eql([
      'FunctionType', 'a', 'string', 'number']);
    expect(collect('@type {function(this: boolean, a: string):number}')).to.eql(
        ['FunctionType', 'boolean', 'a', 'string', 'number']);
    expect(collect('@type {function(new: boolean, a: string):number}')).to.eql(
        ['FunctionType', 'boolean', 'a', 'string', 'number']);
  });

});
