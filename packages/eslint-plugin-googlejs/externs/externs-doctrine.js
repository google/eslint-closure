
/**
 * @fileoverview An extern for the doctrine, a JSDoc parser at
 * https://github.com/eslint/doctrine
 * @externs
 */

/** @const */
const Doctrine = {};

/** @record */ Doctrine.Module = function() {};
/**
 * @param {string} comment
 * @param {!Doctrine.ParseOptions} options
 * @return {!Doctrine.DocComment}
 */
Doctrine.Module.prototype.parse = function(comment, options) {};

/** @record */
Doctrine.ParseOptions = function() {};
/**
 * Set to true to delete the leading /**, any * that begins a line, and the
 * trailing * / from the source text. Default: false.
 * @type {boolean}
 */
Doctrine.ParseOptions.prototype.unwrap;
/**
 * An array of tags to return. When specified, Doctrine returns only tags in
 * this array. For example, if tags is ["param"], then only @param tags will be
 * returned. Default: null.
 * @type{?Array<string>}
 */
Doctrine.ParseOptions.prototype.tags;
/**
 * Set to true to keep parsing even when syntax errors occur. Default: false.
 * @type {boolean}
 */
Doctrine.ParseOptions.prototype.recoverable;
/**
 * Set to true to allow optional parameters to be specified in brackets (@param
 * {string} [foo]). Default: false.
 * @type {boolean}
 */
Doctrine.ParseOptions.prototype.sloppy;
/**
 * Set to true to add lineNumber to each node, specifying the line on which the
 * node is found in the source. Default: false.
 * @type {boolean}
 */
Doctrine.ParseOptions.prototype.lineNumbers;

/** @record */ Doctrine.DocComment = function() {};
/** @type {string} */ Doctrine.DocComment.prototype.description;
/** @type {!Array<!Doctrine.Tag>} */ Doctrine.DocComment.prototype.tags;

/** @record */ Doctrine.Tag = function() {};
/** @type {string} */ Doctrine.Tag.prototype.title;
/** @type {string} */ Doctrine.Tag.prototype.description;
/** @type {!Doctrine.Node} */ Doctrine.Tag.prototype.type;
/** @type {string} */ Doctrine.Tag.prototype.name;

/**
  * @typedef {(
  *     !Doctrine.NullableLiteral |
  *     !Doctrine.AllLiteral |
  *     !Doctrine.NullLiteral |
  *     !Doctrine.UndefinedLiteral |
  *     !Doctrine.VoidLiteral |
  *     !Doctrine.UnionType |
  *     !Doctrine.ArrayType |
  *     !Doctrine.RecordType |
  *     !Doctrine.FieldType |
  *     !Doctrine.FunctionType |
  *     !Doctrine.ParameterType |
  *     !Doctrine.RestType |
  *     !Doctrine.NonNullableType |
  *     !Doctrine.OptionalType |
  *     !Doctrine.NullableType |
  *     !Doctrine.NameExpression |
  *     !Doctrine.TypeApplication |
  *     !Doctrine.StringLiteralType |
  *     !Doctrine.NumericLiteralType
  * )}
 */
Doctrine.Node;

/** @record */ Doctrine.NullableLiteral = function() {};
/** @type {string} */ Doctrine.NullableLiteral.prototype.type;

/** @record */ Doctrine.AllLiteral = function() {};
/** @type {string} */ Doctrine.AllLiteral.prototype.type;

/** @record */ Doctrine.NullLiteral = function() {};
/** @type {string} */ Doctrine.NullLiteral.prototype.type;

/** @record */ Doctrine.UndefinedLiteral = function() {};
/** @type {string} */ Doctrine.UndefinedLiteral.prototype.type;

/** @record */ Doctrine.VoidLiteral = function() {};
/** @type {string} */ Doctrine.VoidLiteral.prototype.type;

/** @record */ Doctrine.ArrayType = function() {};
/** @type {string} */ Doctrine.ArrayType.prototype.type;

/** @record */ Doctrine.RecordType = function() {};
/** @type {string} */ Doctrine.RecordType.prototype.type;
/** @type {!Doctrine.FieldType} */ Doctrine.RecordType.prototype.fields;

/** @record */ Doctrine.FieldType = function() {};
/** @type {string} */ Doctrine.FieldType.prototype.type;
/** @type {string} */ Doctrine.FieldType.prototype.key;
/** @type {string} */ Doctrine.FieldType.prototype.value;

/** @record */ Doctrine.FunctionType = function() {};
/** @type {string} */ Doctrine.FunctionType.prototype.type;
/** @type {!Array<!Doctrine.ParameterType>} */ Doctrine.FunctionType.prototype.params;
/** @type {!Doctrine.Node} */ Doctrine.FunctionType.prototype.result;
/** @type {(!Doctrine.Node|undefined)} */ Doctrine.FunctionType.prototype.this;
/** @type {(boolean|undefined)} */ Doctrine.FunctionType.prototype.new;

/** @record */ Doctrine.ParameterType = function() {};
/** @type {string} */ Doctrine.ParameterType.prototype.type;
/** @type {string} */ Doctrine.ParameterType.prototype.name;
/** @type {!Doctrine.Node} */ Doctrine.ParameterType.prototype.expression;

/** @record */ Doctrine.RestType = function() {};
/** @type {string} */ Doctrine.RestType.prototype.type;
/** @type {!Doctrine.Node} */ Doctrine.RestType.prototype.Expression;

/** @record */ Doctrine.NonNullableType = function() {};
/** @type {string} */ Doctrine.NonNullableType.prototype.type;
/** @type {!Doctrine.Node} */ Doctrine.NonNullableType.prototype.expression;
/** @type {boolean} */ Doctrine.NonNullableType.prototype.prefix;

/** @record */ Doctrine.OptionalType = function() {};
/** @type {string} */ Doctrine.OptionalType.prototype.type;
/** @type {!Doctrine.Node} */ Doctrine.OptionalType.prototype.expression;

/** @record */ Doctrine.NullableType = function() {};
/** @type {string} */ Doctrine.NullableType.prototype.type;
/** @type {!Doctrine.Node} */ Doctrine.NullableType.prototype.expression;
/** @type {boolean} */ Doctrine.NullableType.prototype.prefix;

/** @record */ Doctrine.NameExpression = function() {};
/** @type {string} */ Doctrine.NameExpression.prototype.type;
/** @type {string} */ Doctrine.NameExpression.prototype.name;

/** @record */ Doctrine.StringLiteralType = function() {};
/** @type {string} */ Doctrine.StringLiteralType.prototype.type;
/** @type {string} */ Doctrine.StringLiteralType.prototype.value;

/** @record */ Doctrine.NumericLiteralType = function() {};
/** @type {string} */ Doctrine.NumericLiteralType.prototype.type;
/** @type {number} */ Doctrine.NumericLiteralType.prototype.value;

/** @record */ Doctrine.TypeApplication = function() {};
/** @type {string} */ Doctrine.TypeApplication.prototype.type;
/** @type {!Doctrine.Node} */ Doctrine.TypeApplication.prototype.expression;

/** @record */ Doctrine.UnionType = function() {};
/** @type {string} */ Doctrine.UnionType.prototype.type;
/** @type {!Array<!Doctrine.Type>} */ Doctrine.UnionType.prototype.elements;
