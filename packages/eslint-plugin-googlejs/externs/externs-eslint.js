/**
 * @fileoverview An extern file for ESLint at https://github.com/eslint/eslint.
 * @externs
 */

/* eslint no-unused-vars: "off" */

/** @const */
const ESLint = {};

/**
 * The overall ESLint module.
 * @record
 */
ESLint.Module = function() {};

/** @type {!ESLint.Linter} */
ESLint.Module.prototype.linter;

/** @type {!Object} */
ESLint.Module.prototype.CLIEngine;

/** @type {function(new:ESLint.RuleTester)} */
ESLint.Module.prototype.RuleTester;

/** @type {!ESLint.SourceCode} */
ESLint.Module.prototype.SourceCode;

/**
 * The ESLint linter.
 * @record
 * @extends {ESLint.SourceCodeCommon}
 * @extends {ESLint.APICommon}
 */
ESLint.Linter = function() {};

/**
 * Resets the internal state of the object.
 * @return {void}
 */
ESLint.Linter.prototype.reset = function() {};

// NOTE: ESLint.Linter is an instance of NodeJS events.EventEmitter.  The only
// method that is used is `on`, so we just implement that instead of everything.
/**
 * Adds the listener function to the end of the listeners array for the event
 * named eventName.
 * @param {string} eventName
 * @param {!Function} listener
 */
ESLint.Linter.prototype.on = function(eventName, listener) {};

/**
 * Verifies the text against the rules specified by the second argument.
 * @param {string|!ESLint.SourceCode} textOrSourceCode The text to parse or a
 *     SourceCode object.
 * @param {!ESLint.Config} config An ESLintConfig instance to configure
 *     everything.
 * @param {(string|!Object)=} filenameOrOptions The optional filename of the
 *     file being checked.  If this is not set, the filename will default to
 *     '<input>' in the rule context. If an object, then it has "filename",
 *     "saveState", and "allowInlineConfig" properties.
 * @param {boolean=} saveState Indicates if the state from the last run should
 *     be saved.  Mostly useful for testing purposes.
 * @return {!Array<!Object>} The results as an array of messages.
 */
ESLint.Linter.prototype.verify = function(
    textOrSourceCode, config, filenameOrOptions, saveState) {};

/**
 * Gets the source code for the given node.
 * @param {!AST.Locatable} node The AST node to get the text for.
 * @param {number=} beforeCount The number of characters before the node to
 *     retrieve.
 * @param {number=} afterCount The number of characters after the node to
 *     retrieve.
 * @return {string} The text representing the AST node.
 */
ESLint.Linter.prototype.getSource = function(node, beforeCount, afterCount) {};

/**
 * Gets the entire source text split into an array of lines.
 * @return {!Array<string>} The source text as an array of lines.
 */
ESLint.Linter.prototype.getSourceLines = function() {};

/**
 * Reports a message from one of the rules.
 * @param {string} ruleId The ID of the rule causing the message.
 * @param {number} severity The severity level of the rule as configured.
 * @param {!AST.Locatable} node The AST node that the message relates to.
 * @param {!ESLint.Location} location An object containing the error line and
 *      column numbers. If location is not provided the node's start location
 *      will be used.
 * @param {string} message The actual message.
 * @param {!Object=} opts Optional template data which produces a formatted
 *     message with symbols being replaced by this object's values.
 * @param {!ESLint.FixFunction=} fix A fix command description.
 * @param {!Object=} meta Metadata of the rule
 * @return {void}
 */
ESLint.Linter.prototype.report = function(
    ruleId, severity, node, location, message, opts, fix, meta) {};

/**
 * Defines many new linting rules.
 * @param {Object<string, !ESLint.RuleDefinition>} rulesToDefine map from unique
 *     rule identifier to rule
 * @return {void}
 */
ESLint.Linter.prototype.defineRules = function(rulesToDefine) {};

/**
 * Gets the default eslint configuration.
 * @return {!Object} Object mapping rule IDs to their default configurations
 */
ESLint.Linter.prototype.defaults = function() {};

/**
 * The ESLint RuleTester.
 * @final @struct @constructor
 */
ESLint.RuleTester = function() {};

/**
 * Define a rule for one particular run of tests.
 * @param {string} name The name of the rule to define.
 * @param {!ESLint.RuleDefinition} rule The rule definition.
 * @return {void}
 */
ESLint.RuleTester.prototype.defineRule = function(name, rule) {};

/**
 * Adds a new rule test to execute.
 * @param {string} ruleName The name of the rule to run.
 * @param {!ESLint.RuleDefinition} rule The rule to test.
 * @param {Object} test The collection of tests to run.
 * @return {void}
 */
ESLint.RuleTester.prototype.run = function(ruleName, rule, test) {};

/**
 * Configuration object for the `verify` API. A JS representation of the
 * eslintrc files.
 * @record
 */
ESLint.Config = function() {};

/** @type {!Object} */
ESLint.Config.prototype.rules;

/** @type {(string|undefined)} */
ESLint.Config.prototype.parser;

/** @type {(!Object|undefined)} */
ESLint.Config.prototype.parserOptions;

/** @type {(!Object|undefined)} */
ESLint.Config.prototype.settings;

/** @type {(!Object|undefined)} */
ESLint.Config.prototype.env;

/** @type {(!Object|undefined)} */
ESLint.Config.prototype.global;

/**
 * An ESLint rule.
 * @record
 */
ESLint.RuleDefinition = function() {};

/** @type {!ESLint.RuleMeta} */
ESLint.RuleDefinition.prototype.meta;

/** @type {function(!ESLint.RuleContext): !ESLint.VisitorMapping} */
ESLint.RuleDefinition.prototype.create;

/** @typedef {(ESLint.NodeVisitorMapping|ESLint.CodePathMapping)} */
ESLint.VisitorMapping;

/**
 * @typedef {!Object<(!AST.NodeType|!ESLint.NodeExit), function(!AST.Node)>}
 */
ESLint.NodeVisitorMapping;

/**
 * @typedef {!Object<(!ESLint.CodePathEvent), function(...*)>}
 */
ESLint.CodePathMapping;

/**
 * The metadata for an ESLint rule.
 * @record
 */
ESLint.RuleMeta = function() {};

/** @type {!ESLint.RuleDocs} */
ESLint.RuleMeta.prototype.docs;

/** @type {(!ESLint.FixableRuleType|string|undefined)} */
ESLint.RuleMeta.prototype.fixable;

/** @type {!Array<!Object<?,?>>} */
ESLint.RuleMeta.prototype.schema;

/**
 * A description of a rule.
 * @record
 */
ESLint.RuleDocs = function() {};

/** @type {string} */
ESLint.RuleDocs.prototype.description;

// TODO: why can't we use string literals in the code and have jscompiler figure
// out that it maps to the enum below.
/** @type {string} */
ESLint.RuleDocs.prototype.category;

/** @type {boolean} */
ESLint.RuleDocs.prototype.recommended;

/** @enum {string} */
ESLint.RuleCategory = {
  POSSIBLE_ERRORS: 'Possible Errors',
  BEST_PRACTICES: 'Best Practices',
  STRICT_MODE: 'Strict Mode',
  VARIABLES: 'Variables',
  NODEJS_AND_COMMONJS: 'Node.js and CommonJS',
  STYLISTIC_ISSUES: 'Stylistic Issues',
  ECMASCRIPT_6: 'ECMAScript 6',
  DEPRECATED: 'Deprecated',
  REMOVED: 'Removed',
};

/** @enum {string} */
ESLint.FixableRuleType = {
  CODE: 'code',
  WHITESPACE: 'whitespace',
};

/**
 * Options for an ESLint Rule.
 * @typedef {!Array<*>}
 */
ESLint.RuleOptions;

/**
 * Common functions on both ESLint.Linter and ESLint.RuleContext.
 * @record
 */
ESLint.APICommon = function() {};

/**
 * Gets the SourceCode object representing the parsed source.
 * @return {!ESLint.SourceCode} The SourceCode object for the code.
 */
ESLint.APICommon.prototype.getSourceCode = function() {};

/**
 * Records that a particular variable has been used in code.
 * @param {string} name The name of the variable to mark as used
 * @return {boolean} True if the variable was found and marked as used, false
 *      if not.
 */
ESLint.APICommon.prototype.markVariableAsUsed = function(name) {};

/**
 * Gets the filename for the currently parsed source.
 * @return {string} The filename associated with the source being parsed.
 *     Defaults to "<input>" if no filename info is present.
 */
ESLint.APICommon.prototype.getFilename = function() {};

/**
 * Gets the scope for the current node.
 * @return {!Escope.Scope} An object representing the current node's scope.
 */
ESLint.APICommon.prototype.getScope = function() {};

/**
 * Gets nodes that are ancestors of current node.
 * @return {!Array<!AST.Node>} Array of objects representing ancestors.
 */
ESLint.APICommon.prototype.getAncestors = function() {};

/**
 * Gets variables that are declared by a specified node.
 *
 * The variables are its `defs[].node` or `defs[].parent` is same as the
 * specified node.  Specifically, below:
 *
 * - `VariableDeclaration` - variables of its all declarators.
 * - `VariableDeclarator` - variables.
 * - `FunctionDeclaration`/`FunctionExpression` - its function name and
 *   parameters.
 * - `ArrowFunctionExpression` - its parameters.
 * - `ClassDeclaration`/`ClassExpression` - its class name.
 * - `CatchClause` - variables of its exception.
 * - `ImportDeclaration` - variables of  its all specifiers.
 * - `ImportSpecifier`/`ImportDefaultSpecifier`/`ImportNamespaceSpecifier` - a
 *   variable.
 * - others - always an empty array.
 *
 * @param {!AST.Node} node A node to get.
 * @return {!Array<!Escope.Variable>} Variables that are declared by the node.
 */
ESLint.APICommon.prototype.getDeclaredVariables = function(node) {};

/**
 * Acts as an abstraction layer between rules and the main eslint object.
 * @record
 * @extends {ESLint.APICommon}
 */
ESLint.RuleContext = function() {};

/** @type {string} The ID of the rule using this object. */
ESLint.RuleContext.prototype.ruleId;

/** @type {!ESLint.Config} The eslint object. */
ESLint.RuleContext.prototype.eslint;

/** @type {number} The configured severity level of the rule. */
ESLint.RuleContext.prototype.severity;

/**
 * @type {!ESLint.RuleOptions} The configuration information to be added
 *     to the rule.
 */
ESLint.RuleContext.prototype.options;

/**
 * @type {!Object} The configuration settings passed from the config
 *      file.
 */
ESLint.RuleContext.prototype.settings;

/**
 * @type {!Object} The parserOptions settings passed from the
 *     config file.
 */
ESLint.RuleContext.prototype.parserOptions;

/**
 * @type {!Object} The parser setting passed from the config file.
 */
ESLint.RuleContext.prototype.parserPath;

/** @type {!Object} */
ESLint.RuleContext.prototype.meta;

// NOTE: This function is intentionally limited to a MessageDescriptor.  There's
// an old version that supports positional arguments.
/**
 * Passthrough to eslint.report() that automatically assigns the rule ID and
 * severity.
 * @param {!ESLint.MessageDescriptor} descriptor The AST node related to the
 *      message or a message descriptor.
 * @return {void}
 */
ESLint.RuleContext.prototype.report = function(descriptor) {};

/**
 * Represents parsed source code.  These methods are available on both
 * ESLint.Linter and ESLint.SourceCode.
 * @record
 */
ESLint.SourceCodeCommon = function() {};

/**
 * Retrieves an array containing all comments in the source code.
 * @return {!Array<!AST.Node>} An array of comment nodes.
 */
ESLint.SourceCodeCommon.prototype.getAllComments = function() {};

/**
 * Gets all comments for the given node.
 * @param {!AST.Locatable} node The AST node to get the comments for.
 * @return {Object} The list of comments indexed by their position.
 * @public
 */
ESLint.SourceCodeCommon.prototype.getComments = function(node) {};

/**
 * Retrieves the JSDoc comment for a given node.
 * @param {!AST.Locatable} node The AST node to get the comment for.
 * @return {?AST.CommentToken} The BlockComment node containing the JSDoc for
 *      the given node or null if not found.
 * @public
 */
ESLint.SourceCodeCommon.prototype.getJSDocComment = function(node) {};

/**
 * Gets the deepest node containing a range index.
 * @param {number} index Range index of the desired node.
 * @return {!AST.Node} The node if found or null if not found.
 */
ESLint.SourceCodeCommon.prototype.getNodeByRangeIndex = function(index) {};

/**
 * Gets a number of tokens that precede a given node or token in the token
 * stream.
 * @param {!AST.Locatable} node The AST node or token.
 * @param {number=} beforeCount The number of tokens before the node or
 *     token to retrieve.
 * @return {!Array<!AST.Token>} Array of objects representing tokens.
 */
ESLint.SourceCodeCommon.prototype.getTokensBefore = function(
    node, beforeCount) {};

/**
 * Gets the token that precedes a given node or token in the token stream.
 * @param {!AST.Locatable} node The AST node or token.
 * @param {number=} skip A number of tokens to skip before the given node or
 *     token.
 * @return {!AST.Token} An object representing the token.
 */
ESLint.SourceCodeCommon.prototype.getTokenBefore = function(node, skip) {};

/**
 * Gets a number of tokens that follow a given node or token in the token
 * stream.
 * @param {!AST.Locatable} node The AST node or token.
 * @param {number=} afterCount The number of tokens after the node or token
 *     to retrieve.
 * @return {!Array<!AST.Token>} Array of objects representing tokens.
 */
ESLint.SourceCodeCommon.prototype.getTokensAfter = function(node, afterCount) {
};

/**
 * Gets the token that follows a given node or token in the token stream.
 * @param {!AST.Locatable} node The AST node or token.
 * @param {number=} skip A number of tokens to skip after the given node or
 *     token.
 * @return {!AST.Token} An object representing the token.
 */
ESLint.SourceCodeCommon.prototype.getTokenAfter = function(node, skip) {};

/**
 * Gets all tokens that are related to the given node.
 * @param {!AST.Locatable} node The AST node.
 * @param {number=} beforeCount The number of tokens before the node to
 *     retrieve.
 * @param {number=} afterCount The number of tokens after the node to retrieve.
 * @return {!Array<!AST.Token>} Array of objects representing tokens.
 */
ESLint.SourceCodeCommon.prototype.getTokens = function(
    node, beforeCount, afterCount) {};

/**
 * Gets the first `count` tokens of the given node's token stream.
 * @param {!AST.Locatable} node The AST node.
 * @param {number=} count The number of tokens of the node to retrieve.
 * @return {!Array<!AST.Token>} Array of objects representing tokens.
 */
ESLint.SourceCodeCommon.prototype.getFirstTokens = function(node, count) {};

/**
 * Gets the first token of the given node's token stream.
 * @param {!AST.Locatable} node The AST node.
 * @param {number=} skip A number of tokens to skip.
 * @return {!AST.Token} An object representing the token.
 */
ESLint.SourceCodeCommon.prototype.getFirstToken = function(node, skip) {};

/**
 * Gets the last `count` tokens of the given node.
 * @param {!AST.Locatable} node The AST node.
 * @param {number=} count The number of tokens of the node to retrieve.
 * @return {!Array<!AST.Token>} Array of objects representing tokens.
 */
ESLint.SourceCodeCommon.prototype.getLastTokens = function(node, count) {};

/**
 * Gets the last token of the given node's token stream.
 * @param {!AST.Locatable} node The AST node.
 * @param {number=} skip A number of tokens to skip.
 * @return {!AST.Token} An object representing the token.
 */
ESLint.SourceCodeCommon.prototype.getLastToken = function(node, skip) {};

/**
 * Gets all of the tokens between two non-overlapping nodes.
 * @param {!AST.Locatable} left Node before the desired token range.
 * @param {!AST.Locatable} right Node after the desired token range.
 * @param {number=} padding Number of extra tokens on either side of center.
 * @return {!Array<!AST.Token>} Tokens between left and right plus padding.
 */
ESLint.SourceCodeCommon.prototype.getTokensBetween = function(
    left, right, padding) {};

/**
 * Gets the token starting at the specified index.
 * @param {number=} startIndex Index of the start of the token's range.
 * @return {!AST.Token} The token starting at index, or null if no such
 *     token.
 */
ESLint.SourceCodeCommon.prototype.getTokenByRangeStart = function(startIndex) {
};


/**
 * Represents parsed source code.
 * @record
 * @extends {ESLint.SourceCodeCommon}
 */
ESLint.SourceCode = function() {};

/**
 * Gets the source code for the given node.
 * @param {!AST.Locatable} node The AST node to get the text for.
 * @param {number=} beforeCount The number of characters before the node to
 *     retrieve.
 * @param {number=} afterCount The number of characters after the node to
 *     retrieve.
 * @return {string} The text representing the AST node.
 */
ESLint.SourceCode.prototype.getText = function(
    node, beforeCount, afterCount) {};

/**
 * Gets the entire source text split into an array of lines.
 * @return {!Array<string>} The source text as an array of lines.
 */
ESLint.SourceCode.prototype.getLines = function() {};
/**
 * Determines if two tokens have at least one whitespace character
 * between them. This completely disregards comments in making the
 * determination, so comments count as zero-length substrings.
 * @param {!AST.Locatable} first The token to check after.
 * @param {!AST.Locatable} second The token to check before.
 * @return {boolean} True if there is only space between tokens, false
 *  if there is anything other than whitespace between tokens.
 */
ESLint.SourceCode.prototype.isSpaceBetweenTokens = function(first, second) {};

/**
 * Gets the token or commentthat precedes a given node or token in the token
 * stream.
 * @param {!AST.Locatable} node The AST node or token.
 * @param {number=} skip A number of tokens to skip before the given node or
 *     token.
 * @return {!AST.Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenOrCommentBefore = function(node, skip) {};


/**
 * Gets the token or comment that follows a given node or token in the token
 * stream.
 * @param {!AST.Locatable} node The AST node or token.
 * @param {number=} skip A number of tokens to skip after the given node or
 *     token.
 * @return {!AST.Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenOrCommentAfter = function(node, skip) {};

/**
 * The source location information of a node.
 * @record
 */
ESLint.Location = function() {};

/** @type {!AST.Position} */
ESLint.Location.prototype.start;

/** @type {(!AST.Position|undefined)} */
ESLint.Location.prototype.end;

/**
 * An error message description with at least a loc object.
 * @typedef {{
 *   node: (!AST.Locatable|undefined),
 *   loc: !ESLint.Location,
 *   message: (string|undefined),
 *   data: (!Object|undefined),
 *   fix: (ESLint.FixFunction|undefined)
 * }}
 */
ESLint.MessageDescriptorWithLoc;


/**
 * An error message description with at least a node object.
 * @typedef {{
 *   node: !AST.Locatable,
 *   loc: (!ESLint.Location|undefined),
 *   message: (string|undefined),
 *   data: (!Object|undefined),
 *   fix: (ESLint.FixFunction|undefined)
 * }}
 */
ESLint.MessageDescriptorWithNode;

/**
 * An error message description.
 * @typedef {(ESLint.MessageDescriptorWithLoc|ESLint.MessageDescriptorWithNode)}
 */
ESLint.MessageDescriptor;

/** @typedef {{range: !Array<number>, text: string}} */
ESLint.FixCommand;

/** @typedef {function(!ESLint.Fixer):!ESLint.FixCommand} */
ESLint.FixFunction;

/** @record */
ESLint.Fixer = function() {};

/**
 * @param {!AST.Locatable} nodeOrToken
 * @param {string} text
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.insertTextAfter = function(nodeOrToken, text) {};

/**
 * @param {!Array<number>} range
 * @param {string} text
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.insertTextAfterRange = function(range, text) {};

/**
 * @param {!AST.Locatable} nodeOrToken
 * @param {string} text
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.insertTextBefore = function(nodeOrToken, text) {};

/**
 * @param {!Array<number>} range
 * @param {string} text
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.insertTextBeforeRange = function(range, text) {};

/**
 * @param {!AST.Locatable} nodeOrToken
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.remove = function(nodeOrToken) {};

/**
 * @param {!Array<number>} range
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.removeRange = function(range) {};

/**
 * @param {!AST.Locatable} nodeOrToken
 * @param {string} text
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.replaceText = function(nodeOrToken, text) {};

/**
 * @param {!Array<number>} range
 * @param {string} text
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.replaceTextRange = function(range, text) {};



/**
 * Special Node type that ESLint will process when going back up the tree.
 * @enum {string}
 */
ESLint.NodeExit = {
  NODE_EXIT: 'Node:exit',
  IDENTIFIER_EXIT: 'Identifier:exit',
  LITERAL_EXIT: 'Literal:exit',
  REG_EXP_LITERAL_EXIT: 'RegExpLiteral:exit',
  PROGRAM_EXIT: 'Program:exit',
  FUNCTION_EXIT: 'Function:exit',
  STATEMENT_EXIT: 'Statement:exit',
  EXPRESSION_STATEMENT_EXIT: 'ExpressionStatement:exit',
  BLOCK_STATEMENT_EXIT: 'BlockStatement:exit',
  EMPTY_STATEMENT_EXIT: 'EmptyStatement:exit',
  DEBUGGER_STATEMENT_EXIT: 'DebuggerStatement:exit',
  WITH_STATEMENT_EXIT: 'WithStatement:exit',
  RETURN_STATEMENT_EXIT: 'ReturnStatement:exit',
  LABELED_STATEMENT_EXIT: 'LabeledStatement:exit',
  BREAK_STATEMENT_EXIT: 'BreakStatement:exit',
  CONTINUE_STATEMENT_EXIT: 'ContinueStatement:exit',
  IF_STATEMENT_EXIT: 'IfStatement:exit',
  SWITCH_STATEMENT_EXIT: 'SwitchStatement:exit',
  SWITCH_CASE_EXIT: 'SwitchCase:exit',
  THROW_STATEMENT_EXIT: 'ThrowStatement:exit',
  TRY_STATEMENT_EXIT: 'TryStatement:exit',
  CATCH_CLAUSE_EXIT: 'CatchClause:exit',
  WHILE_STATEMENT_EXIT: 'WhileStatement:exit',
  DO_WHILE_STATEMENT_EXIT: 'DoWhileStatement:exit',
  FOR_STATEMENT_EXIT: 'ForStatement:exit',
  FOR_IN_STATEMENT_EXIT: 'ForInStatement:exit',
  DECLARATION_EXIT: 'Declaration:exit',
  FUNCTION_DECLARATION_EXIT: 'FunctionDeclaration:exit',
  VARIABLE_DECLARATION_EXIT: 'VariableDeclaration:exit',
  VARIABLE_DECLARATOR_EXIT: 'VariableDeclarator:exit',
  EXPRESSION_EXIT: 'Expression:exit',
  THIS_EXPRESSION_EXIT: 'ThisExpression:exit',
  ARRAY_EXPRESSION_EXIT: 'ArrayExpression:exit',
  OBJECT_EXPRESSION_EXIT: 'ObjectExpression:exit',
  PROPERTY_EXIT: 'Property:exit',
  FUNCTION_EXPRESSION_EXIT: 'FunctionExpression:exit',
  UNARY_EXPRESSION_EXIT: 'UnaryExpression:exit',
  UPDATE_EXPRESSION_EXIT: 'UpdateExpression:exit',
  BINARY_EXPRESSION_EXIT: 'BinaryExpression:exit',
  ASSIGNMENT_EXPRESSION_EXIT: 'AssignmentExpression:exit',
  LOGICAL_EXPRESSION_EXIT: 'LogicalExpression:exit',
  MEMBER_EXPRESSION_EXIT: 'MemberExpression:exit',
  CONDITIONAL_EXPRESSION_EXIT: 'ConditionalExpression:exit',
  CALL_EXPRESSION_EXIT: 'CallExpression:exit',
  NEW_EXPRESSION_EXIT: 'NewExpression:exit',
  SEQUENCE_EXPRESSION_EXIT: 'SequenceExpression:exit',
  PATTERN_EXIT: 'Pattern:exit',
};

/**
 * Code path events to control when a Rule.create function is run.
 * @enum {string}
 * @see http://eslint.org/docs/developer-guide/code-path-analysis/
 */
ESLint.CodePathEvent = {
  ON_CODE_PATH_START: 'onCodePathStart',
  ON_CODE_PATH_END: 'onCodePathEnd',
  ON_CODE_PATH_SEGMENT_START: 'onCodePathSegmentStart',
  ON_CODE_PATH_SEGMENT_END: 'onCodePathSegmentEnd',
  ON_CODE_PATH_SEGMENT_LOOP: 'onCodePathSegmentLoop',
};

/**
 * The options to configure a CLI engine with.
 * @typedef {{
 *   allowInlineConfig: (boolean|undefined),
 *   baseConfig: (boolean|!Object<string, *>|undefined),
 *   cache: (boolean|undefined),
 *   cacheLocation: (string|undefined),
 *   configFile: (string|undefined),
 *   cwd: (string|undefined),
 *   envs: (!Array<string>|undefined),
 *   extensions: (!Array<string>|undefined),
 *   fix: (boolean|undefined),
 *   globals: (!Array<string>|undefined),
 *   ignore: (boolean|undefined),
 *   ignorePath: (string|undefined),
 *   ignorePattern: (string|undefined),
 *   useEslintrc: (boolean|undefined),
 *   parser: (string|undefined),
 *   parserOptions: (Object|undefined),
 *   plugins: (!Array<string>|undefined),
 *   rules: (!Object<string,*>|undefined),
 *   rulePaths: (!Array<string>|undefined),
 * }}
 */
ESLint.CLIEngineOptions;

/**
 * Creates a new instance of the core CLI engine.
 * @param {!ESLint.CLIEngineOptions} options The options for this instance.
 * @constructor @struct
 */
ESLint.CLIEngine = function(options) {};

/**
 * A linting warning or error.
 * @typedef {{
 *   message: string,
 * }}
 */
ESLint.LintMessage;

/**
 * A linting result.
 * @typedef {{
 *   filePath: string,
 *   messages: !Array<!ESLint.LintMessage>,
 *   errorCount: number,
 *   warningCount: number,
 * }}
 */
ESLint.LintResult;

/**
 * An ESLint formatting function, e.g. stylish, or unix.
 * @param {!Array<!ESLint.LintResult>} results
 * @return {string}
 */
ESLint.ResultsFormatter = function(results) {};

/**
 * Add a plugin by passing it's configuration.
 * @param {string} name Name of the plugin.
 * @param {!Object} pluginobject Plugin configuration object.
 * @return {void}
 */
ESLint.CLIEngine.prototype.addPlugin = function(name, pluginobject) {};

/**
 * Resolves the patterns passed into executeOnFiles() into glob-based patterns
 * for easier handling.
 * @param {!Array<string>} patterns The file patterns passed on the command
 *     line.
 * @return {!Array<string>} The equivalent glob patterns.
 */
ESLint.CLIEngine.prototype.resolveFileGlobPatterns = function(patterns) {};

/**
 * Executes the current configuration on an array of file and directory names.
 * @param {!Array<string>} patterns An array of file and directory names.
 * @return {!ESLint.LintResult} The results for all files that were linted.
 */
ESLint.CLIEngine.prototype.executeOnFiles = function(patterns) {};

/**
 * Executes the current configuration on text.
 * @param {string} text A string of JavaScript code to lint.
 * @param {string} filename An optional string representing the texts filename.
 * @param {boolean} warnIgnored Always warn when a file is ignored.
 * @return {!ESLint.LintResult} The results for the linting.
 */
ESLint.CLIEngine.prototype.executeOnText = function(
    text, filename, warnIgnored) {};

/**
 * Returns a configuration object for the given file based on the CLI options.
 * This is the same logic used by the ESLint CLI executable to determine
 * configuration for each file it processes.
 * @param {string} filePath The path of the file to retrieve a config object
 *     for.
 * @return {!ESLint.Config} A configuration object for the file.
 */
ESLint.CLIEngine.prototype.getConfigForFile = function(filePath) {};

/**
 * Checks if a given path is ignored by ESLint.
 * @param {string} filePath The path of the file to check.
 * @return {boolean} Whether or not the given path is ignored.
 */
ESLint.CLIEngine.prototype.isPathIgnored = function(filePath) {};

/**
 * Returns the formatter representing the given format or null if no formatter
 * with the given name can be found.
 * @param {string=} format The name of the format to load or the path to a
 *     custom formatter.
 * @return {(!ESLint.ResultsFormatter|null)} The formatter function or null if
 *     not found.
 */
ESLint.CLIEngine.prototype.getFormatter = function(format) {};
