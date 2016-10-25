/**
 * @fileoverview Utilities for working with Doctrine tags and types.
 */
goog.module('googlejs.jsdocUtils');

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
 * Parses a comment string and returns a JSDoc AST.
 * @param {string} jsdocString
 * @return {!Doctrine.DocComment}
 */
function parseComment(jsdocString) {
  try {
    return doctrine.parse(jsdocString, {
      strict: true,
      unwrap: true,
      sloppy: true,
    });
  } catch (ex) {
    if (/braces/i.test(ex.message)) {
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
      throw new Error('Unrecoginized tag type.');
  }
}

exports = {
  isLiteral,
  parseComment,
  traverseTags,
};
