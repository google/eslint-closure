
/**
 * @fileoverview An extern for the doctrine, a JSDoc parser at
 * https://github.com/eslint/doctrine
 * @externs
 */

/* eslint no-unused-vars: "off", max-len: ["warn", 90] */

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
 * @type {(boolean|undefined)}
 */
Doctrine.ParseOptions.prototype.unwrap;
/**
 * An array of tags to return. When specified, Doctrine returns only tags in
 * this array. For example, if tags is ["param"], then only @param tags will be
 * returned. Default: null.
 * @type{(!Array<string>|undefined)}
 */
Doctrine.ParseOptions.prototype.tags;
/**
 * Set to true to keep parsing even when syntax errors occur. Default: false.
 * @type {(boolean|undefined)}
 */
Doctrine.ParseOptions.prototype.recoverable;
/**
 * Set to true to allow optional parameters to be specified in brackets (@param
 * {string} [foo]). Default: false.
 * @type {(boolean|undefined)}
 */
Doctrine.ParseOptions.prototype.sloppy;
/**
 * Set to true to add lineNumber to each node, specifying the line on which the
 * node is found in the source. Default: false.
 * @type {(boolean|undefined)}
 */
Doctrine.ParseOptions.prototype.lineNumbers;

/** @record */ Doctrine.DocComment = function() {};
/** @type {string} */ Doctrine.DocComment.prototype.description;
/** @type {!Array<!Doctrine.Tag>} */ Doctrine.DocComment.prototype.tags;

/** @record */ Doctrine.Tag = function() {};
/** @type {string} */ Doctrine.Tag.prototype.title;
/** @type {string} */ Doctrine.Tag.prototype.description;
/** @type {!Doctrine.TagType} */ Doctrine.Tag.prototype.type;
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
Doctrine.TagType;

/**
 * JSDoc tag types that modify another type via an expression field.
 * @typedef {(
 *     !Doctrine.ParameterType |
 *     !Doctrine.RestType |
 *     !Doctrine.NonNullableType |
 *     !Doctrine.OptionalType |
 *     !Doctrine.NullableType
 * )}
 */
Doctrine.UnaryTagType;

/** @interface */ Doctrine.Typeable = function() {};
/** @type {string} */ Doctrine.Typeable.prototype.type;

/** @record @extends {Doctrine.Typeable} */ Doctrine.NullableLiteral = function() {};
/** @record @extends {Doctrine.Typeable} */ Doctrine.AllLiteral = function() {};
/** @record @extends {Doctrine.Typeable} */ Doctrine.NullLiteral = function() {};
/** @record @extends {Doctrine.Typeable} */ Doctrine.UndefinedLiteral = function() {};
/** @record @extends {Doctrine.Typeable} */ Doctrine.VoidLiteral = function() {};

/** @record @extends {Doctrine.Typeable} */ Doctrine.StringLiteralType = function() {};
/** @type {string} */ Doctrine.StringLiteralType.prototype.value;

/** @record @extends {Doctrine.Typeable} */ Doctrine.NumericLiteralType = function() {};
/** @type {number} */ Doctrine.NumericLiteralType.prototype.value;

/** @record @extends {Doctrine.Typeable} */ Doctrine.NameExpression = function() {};
/** @type {string} */ Doctrine.NameExpression.prototype.name;

/** @record @extends {Doctrine.Typeable} */ Doctrine.ArrayType = function() {};
/** @type {!Array<!Doctrine.TagType>} */ Doctrine.ArrayType.prototype.elements;

/** @record @extends {Doctrine.Typeable} */ Doctrine.RecordType = function() {};
/** @type {!Array<!Doctrine.FieldType>} */ Doctrine.RecordType.prototype.fields;

/** @record @extends {Doctrine.Typeable} */ Doctrine.FieldType = function() {};
/** @type {string} */ Doctrine.FieldType.prototype.key;
/** @type {?Doctrine.TagType} */ Doctrine.FieldType.prototype.value;

/** @record @extends {Doctrine.Typeable} */ Doctrine.FunctionType = function() {};
/** @type {!Array<!Doctrine.ParameterType>} */ Doctrine.FunctionType.prototype.params;
/** @type {!Doctrine.TagType} */ Doctrine.FunctionType.prototype.result;
/** @type {(!Doctrine.TagType|undefined)} */ Doctrine.FunctionType.prototype.this;
/** @type {(boolean|undefined)} */ Doctrine.FunctionType.prototype.new;

/** @record @extends {Doctrine.Typeable} */ Doctrine.ParameterType = function() {};
/** @type {string} */ Doctrine.ParameterType.prototype.name;
/** @type {!Doctrine.TagType} */ Doctrine.ParameterType.prototype.expression;

/** @record @extends {Doctrine.Typeable} */ Doctrine.RestType = function() {};
/** @type {!Doctrine.TagType} */ Doctrine.RestType.prototype.expression;

/** @record @extends {Doctrine.Typeable} */ Doctrine.NonNullableType = function() {};
/** @type {!Doctrine.TagType} */ Doctrine.NonNullableType.prototype.expression;
/** @type {boolean} */ Doctrine.NonNullableType.prototype.prefix;

/** @record @extends {Doctrine.Typeable} */ Doctrine.OptionalType = function() {};
/** @type {!Doctrine.TagType} */ Doctrine.OptionalType.prototype.expression;

/** @record @extends {Doctrine.Typeable} */ Doctrine.NullableType = function() {};
/** @type {!Doctrine.TagType} */ Doctrine.NullableType.prototype.expression;
/** @type {boolean} */ Doctrine.NullableType.prototype.prefix;

/** @record @extends {Doctrine.Typeable} */ Doctrine.TypeApplication = function() {};
/** @type {!Array<!Doctrine.TagType>} */ Doctrine.TypeApplication.prototype.applications;
/** @type {!Doctrine.TagType} */ Doctrine.TypeApplication.prototype.expression;

/** @record @extends {Doctrine.Typeable} */ Doctrine.UnionType = function() {};
/** @type {!Array<!Doctrine.TagType>} */ Doctrine.UnionType.prototype.elements;
