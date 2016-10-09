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
 * Applies the visitor function recursively down all child elements of
 * tagType.
 * @param {!Doctrine.TagType} tagType
 * @param {function(!Doctrine.TagType)} visitor
 */
function traverseJSDocTagTypes(tagType, visitor) {
  visitor(tagType);
  if (isTerminal(tagType)) return;
  switch (tagType.type) {
    case 'ArrayType':
      tagType.elements.forEach(tag => traverseJSDocTagTypes(tag, visitor));
      break;
    case 'RecordType':
      tagType.fields.forEach(tag => traverseJSDocTagTypes(tag, visitor));
      break;
    case 'FunctionType': {
      const t = /** @type {!Doctrine.FunctionType} */ tagType;
      t.params.forEach(tag => traverseJSDocTagTypes(tag, visitor));
      if (t.result) traverseJSDocTagTypes(t.result);
      if (t.this) traverseJSDocTagTypes(t.this);
      if (t.new) traverseJSDocTagTypes(t.new);
      break;
    }
    case 'FieldType':
      if (tagType.value) traverseJSDocTagTypes(tagType.value, visitor);
      break;
    case 'ParameterType':
      traverseJSDocTagTypes(tagType.expression, visitor);
      break;
    case 'RestType':
      traverseJSDocTagTypes(tagType.expression, visitor);
      break;
    case 'NonNullableType':
      traverseJSDocTagTypes(tagType.expression, visitor);
      break;
    case 'OptionalType':
      traverseJSDocTagTypes(tagType.expression, visitor);
      break;
    case 'NullableType':
      traverseJSDocTagTypes(tagType.expression, visitor);
      break;
    case 'TypeApplication':
      traverseJSDocTagTypes(tagType.expression, visitor);
      tagType.applications.forEach(tag => traverseJSDocTagTypes(tag, visitor));
      break;
    case 'UnionType':
      tagType.elements.forEach(tag => traverseJSDocTagTypes(tag, visitor));
      break;
    default:
      throw new Error('Unrecoginized tag type.');
  }
}

exports = {
  isLiteral,
  traverseJSDocTagTypes,
};
