/**
 * @fileoverview Utilities for working with Doctrine tags and types.
 */
goog.module('googlejs.jsdocUtils');

const array = goog.require('goog.array');
const astMatcher = goog.require('googlejs.astMatcher');

const doctrine = /** @type {!Doctrine.Module} */ (require('doctrine'));

/**
 * Returns true if the tagType is a JSDoc literal.
 * @param {!Doctrine.TagType} tagType
 * @return {boolean}
 */
function isLiteral(tagType) {
  return tagType.type === 'NullableLiteral' ||
      tagType.type === 'AllLiteral' ||
      tagType.type === 'NullLiteral' ||
      tagType.type === 'UndefinedLiteral' ||
      tagType.type === 'VoidLiteral' ||
      tagType.type === 'StringLiteralType' ||
      tagType.type === 'NumericLiteralType';
}

/**
 * Returns true if tagType is a terminal tag.
 * @param {!Doctrine.TagType} tagType
 * @return {boolean}
 */
function isTerminal(tagType) {
  return isLiteral(tagType) ||
      tagType.type === 'NameExpression';
}

/**
 * Returns true if the tag type is void.
 * @param {!Doctrine.TagType} tagType
 * @return {boolean}
 */
function isVoid(tagType) {
  const isVoidLiteral = tagType.type == 'VoidLiteral';
  const isVoidNameExpression = tagType.type == 'NameExpression' &&
        /** @type {!Doctrine.NameExpression} */ (tagType).name == 'void';
  return isVoidLiteral || isVoidNameExpression;
}

/**
 * Returns true if a JSDoc comment has type information.
 * @param {!Doctrine.DocComment} jsdocComment
 * @return {boolean}
 */
function hasTypeInformation(jsdocComment) {
  const typeInfoTags = [
    'type', 'typedef', 'record', 'const', 'private', 'package', 'protected',
    'public', 'export'];
  const isTypeInfo = (/** !Doctrine.Tag */ tag) =>
        array.contains(typeInfoTags, tag.title);
  return jsdocComment.tags.some(isTypeInfo);
}

/**
 * Parses a comment string and returns a JSDoc AST.
 * @param {string} jsdocString
 * @return {!Doctrine.DocComment}
 * @throws {Error}
 */
function parseComment(jsdocString) {
  try {
    return doctrine.parse(jsdocString, {
      strict: true,
      unwrap: true,
      sloppy: true,
    });
  } catch (ex) {
    if (ex instanceof Error && /braces/i.test(ex.message)) {
      throw new Error('JSDoc type missing brace.');
    } else {
      throw new Error('JSDoc syntax error.');
    }
  }
}

/**
 * Applies the visitor function recursively in an pre-order traversal down all
 * child elements of tagType.
 * @param {!Doctrine.TagType} tagType
 * @param {function(!Doctrine.TagType)} visitor
 * @return {void}
 */
function traverseTags(tagType, visitor) {
  visitor(tagType);
  if (isTerminal(tagType)) return;
  switch (tagType.type) {
    case 'ArrayType':
      /** @type {!Doctrine.ArrayType} */ (tagType).elements
          .forEach(tag => traverseTags(tag, visitor));
      break;
    case 'RecordType':
      /** @type {!Doctrine.RecordType} */ (tagType).fields
          .forEach(tag => traverseTags(tag, visitor));
      break;
    case 'FunctionType': {
      const t = /** @type {!Doctrine.FunctionType} */ (tagType);
      if (t.this) traverseTags(t.this, visitor);
      t.params.forEach(tag => traverseTags(tag, visitor));
      if (t.result) traverseTags(t.result, visitor);
      break;
    }
    case 'FieldType': {
      const t = /** @type {!Doctrine.FieldType} */ (tagType);
      if (t.value) {
        traverseTags(t.value, visitor);
      }
      break;
    }
    case 'ParameterType':
    case 'RestType':
    case 'NonNullableType':
    case 'OptionalType':
    case 'NullableType':
      traverseTags(
          /** @type {!Doctrine.UnaryTagType} */ (tagType).expression, visitor);
      break;
    case 'TypeApplication': {
      const t = /** @type {!Doctrine.TypeApplication} */ (tagType);
      traverseTags(t.expression, visitor);
      t.applications.forEach(tag => traverseTags(tag, visitor));
      break;
    }
    case 'UnionType':
      /** @type {!Doctrine.UnionType} */ (tagType).elements
          .forEach(tag => traverseTags(tag, visitor));
      break;
    default:
      throw new Error(`Unrecoginized tag type: ${tagType}.`);
  }
}

/**
 * Returns true if the given comment is a JSDoc comment.
 * @param {!AST.CommentToken} commentToken
 * @return {boolean}
 */
function isJSDocComment(commentToken) {
  return commentToken.type === 'Block' && commentToken.value.charAt(0) === '*';
}

/**
 * Returns true if the variable is initialized with a function or class
 * expression.
 * @param {!AST.Node} node
 * @return {boolean}
 * @private
 */
function isVariableFunctionOrClassExpression_(node) {
  const functionClassTypes =
        ['FunctionExpression', 'ArrowFunctionExpression', 'ClassExpression'];

  /**
   * @param {?AST.Node} subNode
   * @return {boolean}
   */
  const isFunctionOrClass = (subNode) =>
      !!subNode && functionClassTypes.indexOf(subNode.type) !== -1;

  // Must be a boolean because we didn't extract any variables.
  const variableHasFunctionOrClass = /** @type {boolean} */ (
      astMatcher.isASTMatch(node, {
        type: 'VariableDeclaration',
        declarations: [{
          type: 'VariableDeclarator',
          // Init can be null for uninitialized variables.
          init: isFunctionOrClass,
        }],
      }));

  return variableHasFunctionOrClass;
}

/**
 * Gets the associated JSDoc comment for a node or null if none exists.
 *
 * A variable declaration with a function or class expression initializer will
 * not have a JSDoc comment.  Instead, the JSDoc comment is associated with
 * the function or class expression.
 * @param {!AST.Node} node
 * @return {?AST.CommentToken}
 */
function getJSDocComment(node) {
  if (!node.leadingComments || node.leadingComments.length == 0) {
    return null;
  }

  if (isVariableFunctionOrClassExpression_(node)) {
    // The JSDoc comments belongs to the function or class expression, not the
    // variable declaration.
    return null;
  }

  /** @type {?AST.CommentToken} */
  const closestDocComment = /** @type {(AST.CommentToken|undefined)} */
      (node.leadingComments.filter(isJSDocComment).reverse().pop()) || null;

  return closestDocComment;
}

exports = {
  getJSDocComment,
  hasTypeInformation,
  isLiteral,
  isVoid,
  isJSDocComment,
  parseComment,
  traverseTags,
};
