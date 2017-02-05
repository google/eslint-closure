/**
 * @fileoverview Tests for jsdoc-utils.
 */

/* global describe it */
goog.module('googlejs.tests.jsdocUtils');

const googObject = goog.require('goog.object');
const jsdocUtils = goog.require('googlejs.jsdocUtils');
const testUtils = goog.require('googlejs.testUtils');

const chai = /** @type {!Chai.Module} */ (require('chai'));

const expect = chai.expect;

// NOTE: We're only testing our wrapper around Doctrine.parse.
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

  // TODO(jschaf): add the other non-closure JSDoc tags like [1, 2] and string
  // literals.
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


describe('isJSDocComment', () => {
  const isJSDoc = (type, value) =>
        jsdocUtils.isJSDocComment(
            // Not strictly true but good enough to test.
            /** @type {!AST.CommentToken} */ ({type, value})
        );
  it('should return true for JSDoc comments', () => {
    expect(isJSDoc('Block', '* foo')).to.equal(true);
    expect(isJSDoc('Block', '** bar')).to.equal(true);
  });

  it('should return false for multi-line comments', () => {
    expect(isJSDoc('Block', ' bar')).to.equal(false);
    expect(isJSDoc('Block', ' * foo')).to.equal(false);
  });

  it('should return false for line comments', () => {
    expect(isJSDoc('Line', '* foo')).to.equal(false);
    expect(isJSDoc('Line', '** bar')).to.equal(false);
  });
});

describe('hasTypeInformation', () => {
  const hasTypes = (comment) => jsdocUtils.hasTypeInformation(
      jsdocUtils.parseComment(comment));

  it('should return true for typed tags', () => {
    expect(hasTypes('/** @type {number} */')).to.eql(true);
    expect(hasTypes('/** @const {number} */')).to.eql(true);
    expect(hasTypes('/** @private {number} */')).to.eql(true);
    expect(hasTypes('/** @package {number} */')).to.eql(true);
    expect(hasTypes('/** @protected {number} */')).to.eql(true);
    expect(hasTypes('/** @public {number} */')).to.eql(true);
    expect(hasTypes('/** @export {number} */')).to.eql(true);
  });

  it('should return false with no tags', () => {
    expect(hasTypes('/** foo */')).to.eql(false);
    expect(hasTypes('/** bar */')).to.eql(false);
  });

  it('should return false with non-typed tags', () => {
    expect(hasTypes('/** @constructor */')).to.eql(false);
    expect(hasTypes('/** @this {number} */')).to.eql(false);
    expect(hasTypes('/** @template T */')).to.eql(false);
  });
});

describe('getJSDocComment', () => {
  const getDoc = testUtils.eslintVerifier(
      'VariableDeclaration',
      (node) => googObject.get(
          jsdocUtils.getJSDocComment(node), 'value', null));

  it('should return null if there are no JSDoc comments', () => {
    expect(getDoc('var a;')).to.equal(null);
    expect(getDoc('let a;')).to.equal(null);
  });

  it('should get JSDoc comments for uninitialized variables', () => {
    expect(getDoc('/** desc */\nvar a;')).to.equal('* desc ');
    expect(getDoc('/** desc */\nlet a;')).to.equal('* desc ');
  });

  it('should get JSDoc comments for simple initialized variables', () => {
    expect(getDoc('/** desc */\nvar b = 2;')).to.equal('* desc ');
    expect(getDoc('/** desc */\nlet c = 3;')).to.equal('* desc ');
    expect(getDoc('/** desc */\nconst d = 4;')).to.equal('* desc ');
  });

  it('should not get JSDoc comments for class expressions', () => {
    expect(getDoc('/** desc */\nvar a = class {};')).to.equal(null);
    expect(getDoc('/** desc */\nlet c = class {};')).to.equal(null);
    expect(getDoc('/** desc */\nconst e = class {};')).to.equal(null);
    expect(getDoc('/** desc */\nconst e = (class {});')).to.equal(null);
  });

  it('should not get JSDoc comments for function expressions', () => {
    expect(getDoc('/** desc */\nvar a = function() {}')).to.equal(null);
    expect(getDoc('/** desc */\nlet c = function() {}')).to.equal(null);
    expect(getDoc('/** desc */\nconst e = function() {}')).to.equal(null);
    expect(getDoc('/** desc */\nconst e = (function() {});')).to.equal(null);
  });

  it('should not get JSDoc comments for arrow function expressions', () => {
    expect(getDoc('/** desc */\nvar b = () => 2;')).to.equal(null);
    expect(getDoc('/** desc */\nlet d = () => 2;')).to.equal(null);
    expect(getDoc('/** desc */\nconst f = () => 2;')).to.equal(null);
    expect(getDoc('/** desc */\nconst f = (() => 2);')).to.equal(null);
  });

  it('should get JSDoc comments for IIFEs', () => {
    expect(getDoc('/** desc */\nvar a = (function() {})()'))
        .to.equal('* desc ');
    expect(getDoc('/** desc */\nvar b = (() => 2)();')).to.equal('* desc ');
    expect(getDoc('/** desc */\nlet c = (function() {})();'))
        .to.equal('* desc ');
    expect(getDoc('/** desc */\nlet d = (() => 2)();')).to.equal('* desc ');
    expect(getDoc('/** desc */\nconst e = (function() {})();'))
        .to.equal('* desc ');
    expect(getDoc('/** desc */\nconst f = (() => 2)();')).to.equal('* desc ');
  });
});
