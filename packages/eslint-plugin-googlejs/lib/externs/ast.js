/**
 * @fileoverview An extern for the JavaScript AST.
 * @externs
 */

/** @const */
const AST = {};

/**
 * The source location information of a node.
 * @record
 */
AST.SourceLocation = function() {};

/** @type {(string|null)} */
AST.SourceLocation.prototype.source;

/** @type {!AST.Position} */
AST.SourceLocation.prototype.start;

/** @type {!AST.Position} */
AST.SourceLocation.prototype.end;

/**
 * Each Position object consists of a line number (1-indexed) and a column
 * number (0-indexed).
 * @record
 */
AST.Position = function() {};

/** @type {number} */
AST.Position.prototype.line;

/** @type {number} */
AST.Position.prototype.column;

/**
 * Represents a basic node with positioning information.
 * @record
 */
AST.Locatable = function() {};

/** @type {string} */
AST.Locatable.prototype.type;

/** @type {!Array<number>} */
AST.Locatable.prototype.range;

/** @type {!AST.SourceLocation} */
AST.Locatable.prototype.loc;

/** @type {number} */
AST.Locatable.prototype.start;

/** @type {number} */
AST.Locatable.prototype.end;

/**
 * A JavaScript token such as a keyword or comma.
 * @record
 * @extends {AST.Locatable}
 */
AST.Token = function() {};

/** @type {string} */
AST.Token.prototype.value;

/**
 * A JavaScript token such as a keyword or comma.  This needs to be separate
 * from token, because otherwise we get a cycle.
 * @record
 */
AST.CommentToken = function() {};

/** @type {string} */
AST.CommentToken.prototype.type;

/** @type {!Array<number>} */
AST.CommentToken.prototype.range;

/** @type {!AST.SourceLocation} */
AST.CommentToken.prototype.loc;

/** @type {number} */
AST.CommentToken.prototype.start;

/** @type {number} */
AST.CommentToken.prototype.end;

/** @type {string} */
AST.CommentToken.prototype.value;
/**
 * Token types are re-used from Esprima.
 * @enum {string}
 * @see https://github.com/eslint/AST/blob/master/lib/token-translator.js
 * @see https://github.com/jquery/esprima/blob/master/src/token.ts
 */
AST.TokenType = {
  BOOLEAN: 'Boolean',
  EOF: '<end>',
  IDENTIFIER: 'Identifier',
  KEYWORD: 'Keyword',
  NULL: 'Null',
  NUMERIC: 'Numeric',
  PUNCTUATOR: 'Punctuator',
  STRING: 'String',
  REGULAR_EXPRESSION: 'RegularExpression',
  TEMPLATE: 'Template',
  JSX_IDENTIFIER: 'JSXIdentifier',
  JSX_TEXT: 'JSXText',
};


/**
 * The main AST Node.  Some of the properties really belong to ESLint, but all
 * the ASTNodes below need these properties and it's easier to just define it
 * here.
 * @interface
 * @extends {AST.Locatable}
 * @see https://github.com/estree/estree/blob/master/es5.md#node-objects
 */
AST.Node = function() {};

/**
 * Provided by ESLint.
 * @type {!AST.Node}
 */
AST.Node.prototype.parent;

/** @type {(!Array<!AST.CommentToken>|undefined)} */
AST.Node.prototype.leadingComments;

/** @type {(!Array<!AST.CommentToken>|undefined)} */
AST.Node.prototype.trailingComments;
/**
 * @enum {string}
 * @see https://github.com/eslint/AST/blob/master/lib/visitor-keys.js
 */
AST.NodeType = {
  ARRAY_EXPRESSION: 'ArrayExpression',
  ARRAY_PATTERN: 'ArrayPattern',
  ARROW_FUNCTION_EXPRESSION: 'ArrowFunctionExpression',
  ASSIGNMENT_EXPRESSION: 'AssignmentExpression',
  ASSIGNMENT_PATTERN: 'AssignmentPattern',
  BINARY_EXPRESSION: 'BinaryExpression',
  BLOCK_COMMENT: 'BlockComment',
  BLOCK_STATEMENT: 'BlockStatement',
  BREAK_STATEMENT: 'BreakStatement',
  CALL_EXPRESSION: 'CallExpression',
  CATCH_CLAUSE: 'CatchClause',
  CLASS_BODY: 'ClassBody',
  CLASS_DECLARATION: 'ClassDeclaration',
  CLASS_EXPRESSION: 'ClassExpression',
  CONDITIONAL_EXPRESSION: 'ConditionalExpression',
  CONTINUE_STATEMENT: 'ContinueStatement',
  DEBUGGER_STATEMENT: 'DebuggerStatement',
  DO_WHILE_STATEMENT: 'DoWhileStatement',
  EMPTY_STATEMENT: 'EmptyStatement',
  EXPERIMENTAL_REST_PROPERTY: 'ExperimentalRestProperty',
  EXPERIMENTAL_SPREAD_PROPERTY: 'ExperimentalSpreadProperty',
  EXPORT_ALL_DECLARATION: 'ExportAllDeclaration',
  EXPORT_DEFAULT_DECLARATION: 'ExportDefaultDeclaration',
  EXPORT_NAMED_DECLARATION: 'ExportNamedDeclaration',
  EXPORT_SPECIFIER: 'ExportSpecifier',
  EXPRESSION_STATEMENT: 'ExpressionStatement',
  FOR_IN_STATEMENT: 'ForInStatement',
  FOR_OF_STATEMENT: 'ForOfStatement',
  FOR_STATEMENT: 'ForStatement',
  FUNCTION_DECLARATION: 'FunctionDeclaration',
  FUNCTION_EXPRESSION: 'FunctionExpression',
  IDENTIFIER: 'Identifier',
  IF_STATEMENT: 'IfStatement',
  IMPORT_DECLARATION: 'ImportDeclaration',
  IMPORT_DEFAULT_SPECIFIER: 'ImportDefaultSpecifier',
  IMPORT_NAMESPACE_SPECIFIER: 'ImportNamespaceSpecifier',
  IMPORT_SPECIFIER: 'ImportSpecifier',
  JSX_ATTRIBUTE: 'JSXAttribute',
  JSX_CLOSING_ELEMENT: 'JSXClosingElement',
  JSX_ELEMENT: 'JSXElement',
  JSX_EMPTY_EXPRESSION: 'JSXEmptyExpression',
  JSX_EXPRESSION_CONTAINER: 'JSXExpressionContainer',
  JSX_IDENTIFIER: 'JSXIdentifier',
  JSX_MEMBER_EXPRESSION: 'JSXMemberExpression',
  JSX_NAMESPACED_NAME: 'JSXNamespacedName',
  JSX_OPENING_ELEMENT: 'JSXOpeningElement',
  JSX_SPREAD_ATTRIBUTE: 'JSXSpreadAttribute',
  JSX_TEXT: 'JSXText',
  LABELED_STATEMENT: 'LabeledStatement',
  LINE_COMMENT: 'LineComment',
  LITERAL: 'Literal',
  LOGICAL_EXPRESSION: 'LogicalExpression',
  MEMBER_EXPRESSION: 'MemberExpression',
  META_PROPERTY: 'MetaProperty',
  METHOD_DEFINITION: 'MethodDefinition',
  NEW_EXPRESSION: 'NewExpression',
  OBJECT_EXPRESSION: 'ObjectExpression',
  OBJECT_PATTERN: 'ObjectPattern',
  PROGRAM: 'Program',
  PROPERTY: 'Property',
  REST_ELEMENT: 'RestElement',
  RETURN_STATEMENT: 'ReturnStatement',
  SEQUENCE_EXPRESSION: 'SequenceExpression',
  SPREAD_ELEMENT: 'SpreadElement',
  SUPER: 'Super',
  SWITCH_CASE: 'SwitchCase',
  SWITCH_STATEMENT: 'SwitchStatement',
  TAGGED_TEMPLATE_EXPRESSION: 'TaggedTemplateExpression',
  TEMPLATE_ELEMENT: 'TemplateElement',
  TEMPLATE_LITERAL: 'TemplateLiteral',
  THIS_EXPRESSION: 'ThisExpression',
  THROW_STATEMENT: 'ThrowStatement',
  TRY_STATEMENT: 'TryStatement',
  UNARY_EXPRESSION: 'UnaryExpression',
  UPDATE_EXPRESSION: 'UpdateExpression',
  VARIABLE_DECLARATION: 'VariableDeclaration',
  VARIABLE_DECLARATOR: 'VariableDeclarator',
  WHILE_STATEMENT: 'WhileStatement',
  WITH_STATEMENT: 'WithStatement',
  YIELD_EXPRESSION: 'YieldExpression',
};

/** @typedef {!AST.Expression | !AST.SpreadElement} */
AST.ArgumentListElement;

/** @typedef {!AST.Expression | !AST.SpreadElement} */
AST.ArrayExpressionElement;

/** @typedef {(
 *      !AST.AssignmentPattern |
 *      !AST.BindingIdentifier |
 *      !AST.BindingPattern |
 *      !AST.RestElement
 *  )}
 */
AST.ArrayPatternElement;

/** @typedef {!AST.ArrayPattern | !AST.ObjectPattern} */
AST.BindingPattern;

/** @typedef {!AST.Identifier} */
AST.BindingIdentifier;

/** @typedef {(
 *      !AST.ClassDeclaration |
 *      !AST.ExportDeclaration |
 *      !AST.FunctionDeclaration |
 *      !AST.ImportDeclaration |
 *      !AST.VariableDeclaration
 *  )}
 */
AST.Declaration;

/** @typedef {(
 *      !AST.ExportAllDeclaration |
 *      !AST.ExportDefaultDeclaration |
 *      !AST.ExportNamedDeclaration
 *  )}
 */
AST.ExportDeclaration;

/**
 * @typedef {(
 *      !AST.ArrayExpression |
 *      !AST.ArrowFunctionExpression |
 *      !AST.AssignmentExpression |
 *      !AST.BinaryExpression |
 *      !AST.CallExpression |
 *      !AST.ClassExpression |
 *      !AST.ComputedMemberExpression |
 *      !AST.ConditionalExpression |
 *      !AST.Identifier |
 *      !AST.FunctionExpression |
 *      !AST.Literal |
 *      !AST.MemberExpression |
 *      !AST.NewExpression |
 *      !AST.ObjectExpression |
 *      !AST.RegexLiteral |
 *      !AST.SequenceExpression |
 *      !AST.StaticMemberExpression |
 *      !AST.TaggedTemplateExpression |
 *      !AST.ThisExpression |
 *      !AST.UnaryExpression |
 *      !AST.UpdateExpression |
 *      !AST.YieldExpression
 *  )}
 */
AST.Expression;

/** @typedef {(
 *      !AST.AssignmentPattern |
 *      !AST.BindingIdentifier |
 *      !AST.BindingPattern
 *  )}
 */
AST.FunctionParameter;

/**
 * All function types.
 * @typedef {(
 *      !AST.ArrowFunctionExpression|
 *      !AST.FunctionDeclaration|
 *      !AST.FunctionExpression
 * )}
 */
AST.AnyFunctionNode;

/** @typedef {(
 *      !AST.ImportDefaultSpecifier |
 *      !AST.ImportNamespaceSpecifier |
 *      !AST.ImportSpecifier
 *  )}
 */
AST.ImportDeclarationSpecifier;

/** @typedef {(
 *      !AST.BreakStatement |
 *      !AST.ContinueStatement |
 *      !AST.DebuggerStatement |
 *      !AST.DoWhileStatement |
 *      !AST.EmptyStatement |
 *      !AST.ExpressionStatement |
 *      !AST.Directive |
 *      !AST.ForStatement |
 *      !AST.ForInStatement |
 *      !AST.ForOfStatement |
 *      !AST.FunctionDeclaration |
 *      !AST.IfStatement |
 *      !AST.ReturnStatement |
 *      !AST.SwitchStatement |
 *      !AST.ThrowStatement |
 *      !AST.TryStatement |
 *      !AST.VariableDeclaration |
 *      !AST.WhileStatement |
 *      !AST.WithStatement
 *  )}
 */
AST.Statement;


/**
 * Nodes that have a `body` field that is either a `BlockStatement` or a single
 * node.  For example:
 *
 *     `while (condition) foo();`   // body is a CallExpression
 *     `while (condition) {foo();}` // body is a BlockStatement
 *
 * @typedef {(
 *     !AST.DoWhileStatement|
 *     !AST.ForStatement|
 *     !AST.ForInStatement|
 *     !AST.ForOfStatement|
 *     !AST.WhileStatement|
 *     !AST.WithStatement
 * )}
 */
AST.OptionallyBodiedNode;

/** @typedef {!AST.Identifier | !AST.Literal} */
AST.PropertyKey;

/** @typedef {(
 *      !AST.AssignmentPattern |
 *      !AST.BindingIdentifier |
 *      !AST.BindingPattern |
 *      !AST.FunctionExpression
 *  )}
 */
AST.PropertyValue;

/** @typedef {!AST.Declaration | !AST.Statement} */
AST.StatementListItem;


/** @record @extends {AST.Node} */
AST.ArrayExpression = function() {};

/** @type {!Array<!AST.ArrayExpressionElement>} */
AST.ArrayExpression.prototype.elements;

/** @record @extends {AST.Node} */
AST.ArrayPattern = function() {};

/** @type {!Array<!AST.ArrayPatternElement>} */
AST.ArrayPattern.prototype.elements;


/** @record @extends {AST.Node} */
AST.ArrowFunctionExpression = function() {};

/** @type {!AST.Identifier} */
AST.ArrowFunctionExpression.prototype.id;

/** @type {!Array<!AST.FunctionParameter>} */
AST.ArrowFunctionExpression.prototype.params;

/** @type {(!AST.BlockStatement | !AST.Expression)} */
AST.ArrowFunctionExpression.prototype.body;

/** @type {boolean} */
AST.ArrowFunctionExpression.prototype.generator;

/** @type {boolean} */
AST.ArrowFunctionExpression.prototype.expression;


/** @record @extends {AST.Node} */
AST.AssignmentExpression = function() {};

/** @type {string} */
AST.AssignmentExpression.prototype.operator;

/** @type {!AST.Expression} */
AST.AssignmentExpression.prototype.left;

/** @type {!AST.Expression} */
AST.AssignmentExpression.prototype.right;


/** @record @extends {AST.Node} */
AST.AssignmentPattern = function() {};

/** @type {(!AST.BindingIdentifier | !AST.BindingPattern)} */
AST.AssignmentPattern.prototype.left;

/** @type {!AST.Expression} */
AST.AssignmentPattern.prototype.right;


/** @record @extends {AST.Node} */
AST.BinaryExpression = function() {};

/** @type {string} */
AST.BinaryExpression.prototype.operator;

/** @type {!AST.Expression} */
AST.BinaryExpression.prototype.left;

/** @type {!AST.Expression} */
AST.BinaryExpression.prototype.right;


/** @record @extends {AST.Node} */
AST.BlockStatement = function() {};

/** @type {!Array<!AST.Statement>} */
AST.BlockStatement.prototype.body;


/** @record @extends {AST.CommentToken} */
AST.BlockComment = function() {};


/** @record @extends {AST.Node} */
AST.BreakStatement = function() {};

/** @type {!AST.Identifier} */
AST.BreakStatement.prototype.label;


/** @record @extends {AST.Node} */
AST.CallExpression = function() {};

/** @type {!AST.Expression} */
AST.CallExpression.prototype.callee;

/** @type {!Array<!AST.ArgumentListElement>} */
AST.CallExpression.prototype.arguments;


/** @record @extends {AST.Node} */
AST.CatchClause = function() {};

/** @type {(!AST.BindingIdentifier | !AST.BindingPattern)} */
AST.CatchClause.prototype.param;

/** @type {!AST.BlockStatement} */
AST.CatchClause.prototype.body;


/** @record @extends {AST.Node} */
AST.ClassBody = function() {};

/** @type {!Array<!AST.Property>} */
AST.ClassBody.prototype.body;


/** @record @extends {AST.Node} */
AST.ClassDeclaration = function() {};

/** @type {!AST.Identifier} */
AST.ClassDeclaration.prototype.id;

/** @type {!AST.Identifier} */
AST.ClassDeclaration.prototype.superClass;

/** @type {!AST.ClassBody} */
AST.ClassDeclaration.prototype.body;


/** @record @extends {AST.Node} */
AST.ClassExpression = function() {};

/** @type {!AST.Identifier} */
AST.ClassExpression.prototype.id;

/** @type {!AST.Identifier} */
AST.ClassExpression.prototype.superClass;

/** @type {!AST.ClassBody} */
AST.ClassExpression.prototype.body;


/** @record @extends {AST.Node} */
AST.ComputedMemberExpression = function() {};

/** @type {boolean} */
AST.ComputedMemberExpression.prototype.computed;

/** @type {!AST.Expression} */
AST.ComputedMemberExpression.prototype.object;

/** @type {!AST.Expression} */
AST.ComputedMemberExpression.prototype.property;


/** @record @extends {AST.Node} */
AST.ConditionalExpression = function() {};

/** @type {!AST.Expression} */
AST.ConditionalExpression.prototype.test;

/** @type {!AST.Expression} */
AST.ConditionalExpression.prototype.consequent;

/** @type {!AST.Expression} */
AST.ConditionalExpression.prototype.alternate;


/** @record @extends {AST.Node} */
AST.ContinueStatement = function() {};
/** @type {!AST.Identifier} */
AST.ContinueStatement.prototype.label;


/** @record @extends {AST.Node} */
AST.DebuggerStatement = function() {};


/** @record @extends {AST.Node} */
AST.Directive = function() {};

/** @type {!AST.Expression} */
AST.Directive.prototype.expression;

/** @type {string} */
AST.Directive.prototype.directive;


/** @record @extends {AST.Node} */
AST.DoWhileStatement = function() {};

/** @type {!AST.Statement} */
AST.DoWhileStatement.prototype.body;

/** @type {!AST.Expression} */
AST.DoWhileStatement.prototype.test;


/** @record @extends {AST.Node} */
AST.EmptyStatement = function() {};


/** @record @extends {AST.Node} */
AST.ExportAllDeclaration = function() {};

/** @type {!AST.Literal} */
AST.ExportAllDeclaration.prototype.source;


/** @record @extends {AST.Node} */
AST.ExportDefaultDeclaration = function() {};

/** @type {(
 *      !AST.BindingIdentifier |
 *      !AST.BindingPattern |
 *      !AST.ClassDeclaration |
 *      !AST.Expression |
 *      !AST.FunctionDeclaration
 * )}
 */
AST.ExportDefaultDeclaration.prototype.declaration;


/** @record @extends {AST.Node} */
AST.ExportNamedDeclaration = function() {};

/** @type {(
 *      !AST.ClassDeclaration |
 *      !Function |
 *      !AST.VariableDeclaration
 *  )}
 */
AST.ExportNamedDeclaration.prototype.declaration;

/** @type {!Array<!AST.ExportSpecifier>} */
AST.ExportNamedDeclaration.prototype.specifiers;

/** @type {!AST.Literal} */
AST.ExportNamedDeclaration.prototype.source;


/** @record @extends {AST.Node} */
AST.ExportSpecifier = function() {};

/** @type {!AST.Identifier} */
AST.ExportSpecifier.prototype.exported;

/** @type {!AST.Identifier} */
AST.ExportSpecifier.prototype.local;


/** @record @extends {AST.Node} */
AST.ExpressionStatement = function() {};

/** @type {!AST.Expression} */
AST.ExpressionStatement.prototype.expression;


/** @record @extends {AST.Node} */
AST.ForInStatement = function() {};

/** @type {!AST.Expression} */
AST.ForInStatement.prototype.left;

/** @type {!AST.Expression} */
AST.ForInStatement.prototype.right;

/** @type {!AST.Statement} */
AST.ForInStatement.prototype.body;

/** @type {boolean} */
AST.ForInStatement.prototype.each;


/** @record @extends {AST.Node} */
AST.ForOfStatement = function() {};

/** @type {!AST.Expression} */
AST.ForOfStatement.prototype.left;

/** @type {!AST.Expression} */
AST.ForOfStatement.prototype.right;

/** @type {!AST.Statement} */
AST.ForOfStatement.prototype.body;


/** @record @extends {AST.Node} */
AST.ForStatement = function() {};

/** @type {!AST.Expression} */
AST.ForStatement.prototype.init;

/** @type {!AST.Expression} */
AST.ForStatement.prototype.test;

/** @type {!AST.Expression} */
AST.ForStatement.prototype.update;

/** @type {!AST.Statement} */
AST.ForStatement.prototype.body;


/** @record @extends {AST.Node} */
AST.FunctionDeclaration = function() {};

/** @type {!AST.Identifier} */
AST.FunctionDeclaration.prototype.id;

/** @type {!Array<!AST.FunctionParameter>} */
AST.FunctionDeclaration.prototype.params;

/** @type {!AST.BlockStatement} */
AST.FunctionDeclaration.prototype.body;

/** @type {boolean} */
AST.FunctionDeclaration.prototype.generator;

/** @type {boolean} */
AST.FunctionDeclaration.prototype.expression;


/** @record @extends {AST.Node} */
AST.FunctionExpression = function() {};

/** @type {!AST.Identifier} */
AST.FunctionExpression.prototype.id;

/** @type {!Array<!AST.FunctionParameter>} */
AST.FunctionExpression.prototype.params;

/** @type {!AST.BlockStatement} */
AST.FunctionExpression.prototype.body;

/** @type {boolean} */
AST.FunctionExpression.prototype.generator;

/** @type {boolean} */
AST.FunctionExpression.prototype.expression;


/** @record @extends {AST.Node} */
AST.Identifier = function() {};

/** @type {string} */
AST.Identifier.prototype.name;


/** @record @extends {AST.Node} */
AST.IfStatement = function() {};

/** @type {!AST.Expression} */
AST.IfStatement.prototype.test;

/** @type {!AST.Statement} */
AST.IfStatement.prototype.consequent;

/** @type {?AST.Statement} */
AST.IfStatement.prototype.alternate;


/** @record @extends {AST.Node} */
AST.ImportDeclaration = function() {};

/** @type {!Array<!AST.ImportDeclarationSpecifier>} */
AST.ImportDeclaration.prototype.specifiers;

/** @type {!AST.Literal} */
AST.ImportDeclaration.prototype.source;


/** @record @extends {AST.Node} */
AST.ImportDefaultSpecifier = function() {};

/** @type {!AST.Identifier} */
AST.ImportDefaultSpecifier.prototype.local;


/** @record @extends {AST.Node} */
AST.ImportNamespaceSpecifier = function() {};

/** @type {!AST.Identifier} */
AST.ImportNamespaceSpecifier.prototype.local;


/** @record @extends {AST.Node} */
AST.ImportSpecifier = function() {};

/** @type {!AST.Identifier} */
AST.ImportSpecifier.prototype.local;

/** @type {!AST.Identifier} */
AST.ImportSpecifier.prototype.imported;


/** @record @extends {AST.Node} */
AST.LabeledStatement = function() {};

/** @type {!AST.Identifier} */
AST.LabeledStatement.prototype.label;

/** @type {!AST.Statement} */
AST.LabeledStatement.prototype.body;


/** @record @extends {AST.CommentToken} */
AST.LineComment = function() {};

/** @record @extends {AST.Node} */
AST.Literal = function() {};

/** @type {(boolean | number | string)} */
AST.Literal.prototype.value;

/** @type {string} */
AST.Literal.prototype.raw;


/** @record @extends {AST.Node} */
AST.LogicalExpression = function() {};

/** @type {string} */
AST.LogicalExpression.prototype.operator;

/** @type {!AST.Expression} */
AST.LogicalExpression.prototype.left;

/** @type {!AST.Expression} */
AST.LogicalExpression.prototype.right;


/** @record @extends {AST.Node} */
AST.MemberExpression = function() {};

/** @type {boolean} */
AST.MemberExpression.prototype.computed;

/** @type {!AST.Expression} */
AST.MemberExpression.prototype.object;

/** @type {!AST.Expression} */
AST.MemberExpression.prototype.property;


/** @record @extends {AST.Node} */
AST.MetaProperty = function() {};

/** @type {!AST.Identifier} */
AST.MetaProperty.prototype.meta;

/** @type {!AST.Identifier} */
AST.MetaProperty.prototype.property;


/** @record @extends {AST.Node} */
AST.MethodDefinition = function() {};

/** @type {!AST.Expression} */
AST.MethodDefinition.prototype.key;

/** @type {boolean} */
AST.MethodDefinition.prototype.computed;

/** @type {!AST.FunctionExpression} */
AST.MethodDefinition.prototype.value;

/** @type {string} */
AST.MethodDefinition.prototype.kind;

/** @type {boolean} */
AST.MethodDefinition.prototype.static;


/** @record @extends {AST.Node} */
AST.NewExpression = function() {};

/** @type {!AST.Expression} */
AST.NewExpression.prototype.callee;

/** @type {!Array<!AST.ArgumentListElement>} */
AST.NewExpression.prototype.arguments;


/** @record @extends {AST.Node} */
AST.ObjectExpression = function() {};

/** @type {!Array<!AST.Property>} */
AST.ObjectExpression.prototype.properties;


/** @record @extends {AST.Node} */
AST.ObjectPattern = function() {};

/** @type {!Array<!AST.Property>} */
AST.ObjectPattern.prototype.properties;


/** @record @extends {AST.Node} */
AST.Program = function() {};

/** @type {!Array<!AST.StatementListItem>} */
AST.Program.prototype.body;

/** @type {string} */
AST.Program.prototype.sourceType;


/** @record @extends {AST.Node} */
AST.Property = function() {};

/** @type {!AST.PropertyKey} */
AST.Property.prototype.key;

/** @type {boolean} */
AST.Property.prototype.computed;

/** @type {!AST.PropertyValue} */
AST.Property.prototype.value;

/** @type {string} */
AST.Property.prototype.kind;

/** @type {boolean} */
AST.Property.prototype.method;

/** @type {boolean} */
AST.Property.prototype.shorthand;

/** @record @extends {AST.Node} */
AST.RegexLiteral = function() {};

/** @type {string} */
AST.RegexLiteral.prototype.value;

/** @type {string} */
AST.RegexLiteral.prototype.raw;

/** @type {*} */
AST.RegexLiteral.prototype.regex;


/** @record @extends {AST.Node} */
AST.RestElement = function() {};

/** @type {!AST.Identifier} */
AST.RestElement.prototype.argument;


/** @record @extends {AST.Node} */
AST.ReturnStatement = function() {};

/** @type {!AST.Expression} */
AST.ReturnStatement.prototype.argument;


/** @record @extends {AST.Node} */
AST.SequenceExpression = function() {};

/** @type {!Array<!AST.Expression>} */
AST.SequenceExpression.prototype.expressions;


/** @record @extends {AST.Node} */
AST.SpreadElement = function() {};

/** @type {!AST.Expression} */
AST.SpreadElement.prototype.argument;


/** @record @extends {AST.Node} */
AST.StaticMemberExpression = function() {};

/** @type {boolean} */
AST.StaticMemberExpression.prototype.computed;

/** @type {!AST.Expression} */
AST.StaticMemberExpression.prototype.object;

/** @type {!AST.Expression} */
AST.StaticMemberExpression.prototype.property;


/** @record @extends {AST.Node} */
AST.Super = function() {};


/** @record @extends {AST.Node} */
AST.SwitchCase = function() {};

/** @type {!AST.Expression} */
AST.SwitchCase.prototype.test;

/** @type {!Array<!AST.Statement>} */
AST.SwitchCase.prototype.consequent;


/** @record @extends {AST.Node} */
AST.SwitchStatement = function() {};

/** @type {!AST.Expression} */
AST.SwitchStatement.prototype.discriminant;

/** @type {!Array<!AST.SwitchCase>} */
AST.SwitchStatement.prototype.cases;


/** @record @extends {AST.Node} */
AST.TaggedTemplateExpression = function() {};

/** @type {!AST.Expression} */
AST.TaggedTemplateExpression.prototype.tag;

/** @type {!AST.TemplateLiteral} */
AST.TaggedTemplateExpression.prototype.quasi;


/** @record @extends {AST.Node} */
AST.TemplateElement = function() {};

/** @type {{cooked: string, raw: string}} */
AST.TemplateElement.prototype.value;

/** @type {boolean} */
AST.TemplateElement.prototype.tail;


/** @record @extends {AST.Node} */
AST.TemplateLiteral = function() {};

/** @type {!Array<!AST.TemplateElement>} */
AST.TemplateLiteral.prototype.quasis;

/** @type {!Array<!AST.Expression>} */
AST.TemplateLiteral.prototype.expressions;


/** @record @extends {AST.Node} */
AST.ThisExpression = function() {};


/** @record @extends {AST.Node} */
AST.ThrowStatement = function() {};

/** @type {!AST.Expression} */
AST.ThrowStatement.prototype.argument;


/** @record @extends {AST.Node} */
AST.TryStatement = function() {};

/** @type {!AST.BlockStatement} */
AST.TryStatement.prototype.block;

/** @type {!AST.CatchClause} */
AST.TryStatement.prototype.handler;

/** @type {!AST.BlockStatement} */
AST.TryStatement.prototype.finalizer;


/** @record @extends {AST.Node} */
AST.UnaryExpression = function() {};

/** @type {string} */
AST.UnaryExpression.prototype.operator;

/** @type {!AST.Expression} */
AST.UnaryExpression.prototype.argument;

/** @type {boolean} */
AST.UnaryExpression.prototype.prefix;


/** @record @extends {AST.Node} */
AST.UpdateExpression = function() {};

/** @type {string} */
AST.UpdateExpression.prototype.operator;

/** @type {!AST.Expression} */
AST.UpdateExpression.prototype.argument;

/** @type {boolean} */
AST.UpdateExpression.prototype.prefix;


/** @record @extends {AST.Node} */
AST.VariableDeclaration = function() {};

/** @type {!Array<!AST.VariableDeclarator>} */
AST.VariableDeclaration.prototype.declarations;

/** @type {string} */
AST.VariableDeclaration.prototype.kind;


/** @record @extends {AST.Node} */
AST.VariableDeclarator = function() {};

/** @type {(!AST.BindingIdentifier | !AST.BindingPattern)} */
AST.VariableDeclarator.prototype.id;

/** @type {?AST.Expression} */
AST.VariableDeclarator.prototype.init;

/** @type {!AST.VariableDeclaration} */
AST.VariableDeclarator.prototype.parent;

/** @record @extends {AST.Node} */
AST.WhileStatement = function() {};

/** @type {!AST.Expression} */
AST.WhileStatement.prototype.test;

/** @type {!AST.Statement} */
AST.WhileStatement.prototype.body;


/** @record @extends {AST.Node} */
AST.WithStatement = function() {};

/** @type {!AST.Expression} */
AST.WithStatement.prototype.object;

/** @type {!AST.Statement} */
AST.WithStatement.prototype.body;


/** @record @extends {AST.Node} */
AST.YieldExpression = function() {};

/** @type {!AST.Expression} */
AST.YieldExpression.prototype.argument;

/** @type {boolean} */
AST.YieldExpression.prototype.delegate;
