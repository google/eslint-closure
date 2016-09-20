/** @fileoverview An extern file for ESLint at https://github.com/eslint/eslint.
 * @externs
 */

/** @const */
const ESLint = {};

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
 * An ESLint ASTNode.
 * @record
 * @extends {Espree.ASTNode}
 */
ESLint.ASTNode = function() {};


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
 * @typedef {!Object<(Espree.NodeType|ESLint.NodeExit),
 *     function(!ESLint.ASTNode)>}
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
 * Acts as an abstraction layer between rules and the main eslint object.
 * @record
 */
ESLint.RuleContext = function() {};

/** @type {string} ruleId The ID of the rule using this object. */
ESLint.RuleContext.prototype.ruleId;

/** @type {!ESLint.Config} eslint The eslint object. */
ESLint.RuleContext.prototype.eslint;

/** @type {number} severity The configured severity level of the rule. */
ESLint.RuleContext.prototype.severity;

/**
 * @type {!ESLint.RuleOptions} options The configuration information to be added
 *     to the rule.
 */
ESLint.RuleContext.prototype.options;

/**
 * @type {!Object} settings The configuration settings passed from the config
 *      file.
 */
ESLint.RuleContext.prototype.settings;

/**
 * @type {!Object} parserOptions The parserOptions settings passed from the
 *     config file.
 */
ESLint.RuleContext.prototype.parserOptions;

/**
 * @type {!Object} parserPath The parser setting passed from the config file.
 */
ESLint.RuleContext.prototype.parserPath;

/** @type {!Object} */
ESLint.RuleContext.prototype.meta;

/**
 * Passthrough to eslint.getSourceCode().
 * @return {!ESLint.SourceCode} The SourceCode object for the code.
 */
ESLint.RuleContext.prototype.getSourceCode = function() {};

// This rule is intentionally limited to a MessageDescriptor.  There's an old
// version that supports positional arguments.
/**
 * Passthrough to eslint.report() that automatically assigns the rule ID and
 * severity.
 * @param {!ESLint.MessageDescriptor} descriptor The AST node related to the
 *      message or a message descriptor.
 * @return {void}
 */
ESLint.RuleContext.prototype.report = function(descriptor) {};

// TODO: add these to Rule context
// "getAncestors",
// "getDeclaredVariables",
// "getFilename",
// "getScope",
// "markVariableAsUsed",


/**
 * Represents parsed source code.
 * @record
 */
ESLint.SourceCode = function() {};

// TODO: add these functions
// getSource
// getSourceLines
// getNodeByRangeIndex

/**
 * Gets the source code for the given node.
 * @param {!Espree.LocatableNode} node The AST node to get the text for.
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
 * @return {Array} The source text as an array of lines.
 */
ESLint.SourceCode.prototype.getLines = function() {};

/**
 * Retrieves an array containing all comments in the source code.
 * @return {Array<ESLint.ASTNode>} An array of comment nodes.
 */
ESLint.SourceCode.prototype.getAllComments = function() {};

/**
 * Gets all comments for the given node.
 * @param {ESLint.ASTNode} node The AST node to get the comments for.
 * @return {Object} The list of comments indexed by their position.
 * @public
 */
ESLint.SourceCode.prototype.getComments = function(node) {};

/**
 * Retrieves the JSDoc comment for a given node.
 * @param {ESLint.ASTNode} node The AST node to get the comment for.
 * @return {ESLint.ASTNode} The BlockComment node containing the JSDoc for the
 *      given node or null if not found.
 * @public
 */
ESLint.SourceCode.prototype.getJSDocComment = function(node) {};

/**
 * Gets the deepest node containing a range index.
 * @param {number} index Range index of the desired node.
 * @return {!ESLint.ASTNode} The node if found or null if not found.
 */
ESLint.SourceCode.prototype.getNodeByRangeIndex = function(index) {};

/**
 * Determines if two tokens have at least one whitespace character
 * between them. This completely disregards comments in making the
 * determination, so comments count as zero-length substrings.
 * @param {!Espree.LocatableNode} first The token to check after.
 * @param {!Espree.LocatableNode} second The token to check before.
 * @return {boolean} True if there is only space between tokens, false
 *  if there is anything other than whitespace between tokens.
 */
ESLint.SourceCode.prototype.isSpaceBetweenTokens = function(first, second) {};

/**
 * Gets a number of tokens that precede a given node or token in the token
 * stream.
 * @param {!Espree.LocatableNode} node The AST node or token.
 * @param {number=} beforeCount The number of tokens before the node or
 *     token to retrieve.
 * @return {!Array<!Espree.Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getTokensBefore = function(node, beforeCount) {};

/**
 * Gets the token that precedes a given node or token in the token stream.
 * @param {!Espree.LocatableNode} node The AST node or token.
 * @param {number=} skip A number of tokens to skip before the given node or
 *     token.
 * @return {!Espree.Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenBefore = function(node, skip) {};

/**
 * Gets a number of tokens that follow a given node or token in the token
 * stream.
 * @param {!Espree.LocatableNode} node The AST node or token.
 * @param {number=} afterCount The number of tokens after the node or token
 *     to retrieve.
 * @return {!Array<!Espree.Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getTokensAfter = function(node, afterCount) {};

/**
 * Gets the token that follows a given node or token in the token stream.
 * @param {!Espree.LocatableNode} node The AST node or token.
 * @param {number=} skip A number of tokens to skip after the given node or
 *     token.
 * @return {!Espree.Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenAfter = function(node, skip) {};

/**
 * Gets all tokens that are related to the given node.
 * @param {!Espree.LocatableNode} node The AST node.
 * @param {number=} beforeCount The number of tokens before the node to
 *     retrieve.
 * @param {number=} afterCount The number of tokens after the node to retrieve.
 * @return {!Array<!Espree.Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getTokens = function(
    node, beforeCount, afterCount) {};

/**
 * Gets the first `count` tokens of the given node's token stream.
 * @param {!Espree.LocatableNode} node The AST node.
 * @param {number=} count The number of tokens of the node to retrieve.
 * @return {!Array<!Espree.Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getFirstTokens = function(node, count) {};

/**
 * Gets the first token of the given node's token stream.
 * @param {!Espree.LocatableNode} node The AST node.
 * @param {number=} skip A number of tokens to skip.
 * @return {!Espree.Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getFirstToken = function(node, skip) {};

/**
 * Gets the last `count` tokens of the given node.
 * @param {!Espree.LocatableNode} node The AST node.
 * @param {number=} count The number of tokens of the node to retrieve.
 * @return {!Array<!Espree.Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getLastTokens = function(node, count) {};

/**
 * Gets the last token of the given node's token stream.
 * @param {!Espree.LocatableNode} node The AST node.
 * @param {number=} skip A number of tokens to skip.
 * @return {!Espree.Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getLastToken = function(node, skip) {};

/**
 * Gets all of the tokens between two non-overlapping nodes.
 * @param {!Espree.LocatableNode} left Node before the desired token range.
 * @param {!Espree.LocatableNode} right Node after the desired token range.
 * @param {number=} padding Number of extra tokens on either side of center.
 * @return {!Array<!Espree.Token>} Tokens between left and right plus padding.
 */
ESLint.SourceCode.prototype.getTokensBetween = function(
    left, right, padding) {};

/**
 * Gets the token starting at the specified index.
 * @param {number=} startIndex Index of the start of the token's range.
 * @return {!Espree.Token} The token starting at index, or null if no such
 *     token.
 */
ESLint.SourceCode.prototype.getTokenByRangeStart = function(startIndex) {};

/**
 * Gets the token or commentthat precedes a given node or token in the token
 * stream.
 * @param {!Espree.LocatableNode} node The AST node or token.
 * @param {number=} skip A number of tokens to skip before the given node or
 *     token.
 * @return {!Espree.Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenOrCommentBefore = function(node, skip) {};


/**
 * Gets the token or comment that follows a given node or token in the token
 * stream.
 * @param {!Espree.LocatableNode} node The AST node or token.
 * @param {number=} skip A number of tokens to skip after the given node or
 *     token.
 * @return {!Espree.Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenOrCommentAfter = function(node, skip) {};


/**
 * An error message description with at least a loc object.
 * @typedef {{
 *   node: (!ESLint.ASTNode|undefined),
 *   loc: !Location,
 *   message: (string|undefined),
 *   data: (!Object|undefined),
 *   fix: (ESLint.FixFunction|undefined)
 * }}
 */
ESLint.MessageDescriptorWithLoc;


/**
 * An error message description with at least a node object.
 * @typedef {{
 *   node: !ESLint.ASTNode,
 *   loc: (!Location|undefined),
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
 * @param {!Espree.LocatableNode} nodeOrToken
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
 * @param {!Espree.LocatableNode} nodeOrToken
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
 * @param {!Espree.LocatableNode} nodeOrToken
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.remove = function(nodeOrToken) {};

/**
 * @param {!Array<number>} range
 * @return {!ESLint.FixCommand}
 */
ESLint.Fixer.prototype.removeRange = function(range) {};

/**
 * @param {!Espree.LocatableNode} nodeOrToken
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
