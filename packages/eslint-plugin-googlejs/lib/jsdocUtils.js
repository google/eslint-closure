/**
 * @fileoverview Utilities for working with Doctrine tags and types.
 */
goog.module('googlejs.jsdocUtils');

/**
 * Returns true if the tagType is a JSDoc literal.
 * @param {!Doctrine.TagType} tagType
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
 */
function isTerminal(tagType) {
  return isLiteral(tagType) ||
      tagType.type === 'NameExpression';
}

/**
 * Applies the visitor function recursively in an pre-order traversal down all
 * child elements of tagType.
 * @param {!Doctrine.TagType} tagType
 * @param {function(!Doctrine.TagType)} visitor
 */
function traverseJSDocTagTypes(tagType, visitor) {
  visitor(tagType);
  if (isTerminal(tagType)) return;
  switch (tagType.type) {
    case 'ArrayType':
      /** @type {!Doctrine.ArrayType} */ (tagType).elements
          .forEach(tag => traverseJSDocTagTypes(tag, visitor));
      break;
    case 'RecordType':
      /** @type {!Doctrine.RecordType} */ (tagType).fields
          .forEach(tag => traverseJSDocTagTypes(tag, visitor));
      break;
    case 'FunctionType': {
      const t = /** @type {!Doctrine.FunctionType} */ (tagType);
      t.params.forEach(tag => traverseJSDocTagTypes(tag, visitor));
      if (t.result) traverseJSDocTagTypes(t.result, visitor);
      if (t.this) traverseJSDocTagTypes(t.this, visitor);
      break;
    }
    case 'FieldType': {
      const t = /** @type {!Doctrine.FieldType} */ (tagType);
      if (t.value) {
        traverseJSDocTagTypes(t.value, visitor);
      }
      break;
    }
    case 'ParameterType':
    case 'RestType':
    case 'NonNullableType':
    case 'OptionalType':
    case 'NullableType':
      traverseJSDocTagTypes(
          /** @type {!Doctrine.UnaryTagType} */ (tagType).expression, visitor);
      break;
    case 'TypeApplication': {
      const t = /** @type {!Doctrine.TypeApplication} */ (tagType);
      traverseJSDocTagTypes(t.expression, visitor);
      t.applications.forEach(tag => traverseJSDocTagTypes(tag, visitor));
      break;
    }
    case 'UnionType':
      /** @type {!Doctrine.UnionType} */ (tagType).elements
          .forEach(tag => traverseJSDocTagTypes(tag, visitor));
      break;
    default:
      throw new Error('Unrecoginized tag type.');
  }
}

exports = {
  isLiteral,
  traverseJSDocTagTypes,
};
