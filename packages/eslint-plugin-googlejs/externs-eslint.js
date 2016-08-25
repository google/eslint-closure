/** @fileoverview An extern file for ESLint at https://github.com/eslint/eslint.
 * @externs
 */

/** @const */
const ESLint = {}

/**
 * Configuration object for the `verify` API. A JS representation of the
 * eslintrc files.
 * @record
 */
ESLint.Config = function() {};

/** @type {!Object} */
ESLint.Config.prototype.rules;

/** @type {string} */
ESLint.Config.prototype.parser;

/** @type {Object} */
ESLint.Config.prototype.parserOptions;

/** @type {Object} */
ESLint.Config.prototype.settings;

/** @type {Object} */
ESLint.Config.prototype.env;

/** @type {Object} */
ESLint.Config.prototype.global;

/**
 * An ESLint rule.
 * @record
 */
ESLint.Rule = function() {};

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
 * @type {!Array<!Object>} options The configuration information to be added to
 *     the rule.
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

/** @type {!Object} parserPath The parser setting passed from the config file. */
ESLint.RuleContext.prototype.parserPath;

/** @type {!Object} */
ESLint.RuleContext.prototype.meta;

/**
 * Passthrough to eslint.getSourceCode().
 * @return {!SourceCode} The SourceCode object for the code.
 */
ESLint.RuleContext.prototype.getSourceCode = function() {};

// This rule is intentionally limited to a MessageDescriptor.  There's an old
// version that supports positional arguments.
/**
 * Passthrough to eslint.report() that automatically assigns the rule ID and
 * severity.
 * @param {!MessageDescriptor} descriptor The AST node related to the message or
 *      a message descriptor.
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
 * @param {ESTree.ASTNode=} node The AST node to get the text for.
 * @param {number=} beforeCount The number of characters before the node to retrieve.
 * @param {number=} afterCount The number of characters after the node to retrieve.
 * @return {string} The text representing the AST node.
 */
ESLint.SourceCode.prototype.getText = function(node, beforeCount, afterCount) {};

/**
 * Gets the entire source text split into an array of lines.
 * @return {Array} The source text as an array of lines.
 */
ESLint.SourceCode.prototype.getLines = function() {};

/**
 * Retrieves an array containing all comments in the source code.
 * @return {Array<ESTree.ASTNode>} An array of comment nodes.
 */
ESLint.SourceCode.prototype.getAllComments = function() {};

/**
 * Gets all comments for the given node.
 * @param {ESTree.ASTNode} node The AST node to get the comments for.
 * @return {Object} The list of comments indexed by their position.
 * @public
 */
ESLint.SourceCode.prototype.getComments = function(node) {};

/**
 * Retrieves the JSDoc comment for a given node.
 * @param {ESTree.ASTNode} node The AST node to get the comment for.
 * @return {ESTree.ASTNode} The BlockComment node containing the JSDoc for the
 *      given node or null if not found.
 * @public
 */
ESLint.SourceCode.prototype.getJSDocComment = function(node) {};

/**
 * Gets the deepest node containing a range index.
 * @param {number} index Range index of the desired node.
 * @return {ESTree.ASTNode} The node if found or null if not found.
 */
ESLint.SourceCode.prototype.getNodeByRangeIndex = function(index) {};

/**
 * Determines if two tokens have at least one whitespace character
 * between them. This completely disregards comments in making the
 * determination, so comments count as zero-length substrings.
 * @param {Token} first The token to check after.
 * @param {Token} second The token to check before.
 * @return {boolean} True if there is only space between tokens, false
 *  if there is anything other than whitespace between tokens.
 */
ESLint.SourceCode.prototype.isSpaceBetweenTokens = function(first, second){};

/**
 * Gets a number of tokens that precede a given node or token in the token
 * stream.
 * @param {(!ESTree.ASTNode|!Token)} node The AST node or token.
 * @param {number=} beforeCount The number of tokens before the node or
 *     token to retrieve.
 * @return {!Array<!Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getTokensBefore = function(node, beforeCount) {};

/**
 * Gets the token that precedes a given node or token in the token stream.
 * @param {(!ESTree.ASTNode|!Token)} node The AST node or token.
 * @param {number=} skip A number of tokens to skip before the given node or
 *     token.
 * @return {!Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenBefore = function(node, skip) {};

/**
 * Gets a number of tokens that follow a given node or token in the token
 * stream.
 * @param {(!ESTree.ASTNode|!Token)} node The AST node or token.
 * @param {number=} afterCount The number of tokens after the node or token
 *     to retrieve.
 * @return {!Array<!Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getTokensAfter = function(node, afterCount) {};

/**
 * Gets the token that follows a given node or token in the token stream.
 * @param {(!ESTree.ASTNode|!Token)} node The AST node or token.
 * @param {number=} skip A number of tokens to skip after the given node or
 *     token.
 * @return {!Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenAfter = function(node, skip) {};

/**
 * Gets all tokens that are related to the given node.
 * @param {!ESTree.ASTNode} node The AST node.
 * @param {number=} beforeCount The number of tokens before the node to retrieve.
 * @param {number=} afterCount The number of tokens after the node to retrieve.
 * @return {!Array<!Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getTokens = function(node, beforeCount, afterCount) {};

/**
 * Gets the first `count` tokens of the given node's token stream.
 * @param {!ESTree.ASTNode} node The AST node.
 * @param {number=} count The number of tokens of the node to retrieve.
 * @return {!Array<!Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getFirstTokens = function(node, count) {};

/**
 * Gets the first token of the given node's token stream.
 * @param {!ESTree.ASTNode} node The AST node.
 * @param {number=} skip A number of tokens to skip.
 * @return {!Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getFirstToken = function(node, skip) {};

/**
 * Gets the last `count` tokens of the given node.
 * @param {!ESTree.ASTNode} node The AST node.
 * @param {number=} count The number of tokens of the node to retrieve.
 * @return {!Array<!Token>} Array of objects representing tokens.
 */
ESLint.SourceCode.prototype.getLastTokens = function(node, count) {};

/**
 * Gets the last token of the given node's token stream.
 * @param {!ESTree.ASTNode} node The AST node.
 * @param {number=} skip A number of tokens to skip.
 * @return {!Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getLastToken = function(node, skip) {};

/**
 * Gets all of the tokens between two non-overlapping nodes.
 * @param {!ESTree.ASTNode} left Node before the desired token range.
 * @param {!ESTree.ASTNode} right Node after the desired token range.
 * @param {number=} padding Number of extra tokens on either side of center.
 * @return {!Array<!Token>} Tokens between left and right plus padding.
 */
ESLint.SourceCode.prototype.getTokensBetween = function(left, right, padding) {};

/**
 * Gets the token starting at the specified index.
 * @param {number=} startIndex Index of the start of the token's range.
 * @return {!Token} The token starting at index, or null if no such token.
 */
ESLint.SourceCode.prototype.getTokenByRangeStart = function(startIndex) {}

/**
 * Gets the token or commentthat precedes a given node or token in the token
 * stream.
 * @param {(!ESTree.ASTNode|!Token)} node The AST node or token.
 * @param {number=} skip A number of tokens to skip before the given node or
 *     token.
 * @return {!Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenOrCommentBefore = function(node, skip) {};


/**
 * Gets the token or comment that follows a given node or token in the token
 * stream.
 * @param {(!ESTree.ASTNode|!Token)} node The AST node or token.
 * @param {number=} skip A number of tokens to skip after the given node or
 *     token.
 * @return {!Token} An object representing the token.
 */
ESLint.SourceCode.prototype.getTokenOrCommentAfter = function(node, skip) {};

/**
 * @record
 */
ESLint.Token = function() {};



/**
 * An error message description with at least a loc object.
 * @typedef {{
 *   node: (!ESTree.ASTNode|undefined),
 *   loc: !Location,
 *   message: (string|undefined),
 *   data: (!Object|undefined),
 *   fix: (function()|undefined),
 * }}
 */
let MessageDescriptorWithLoc;


/**
 * An error message description with at least a node object.
 * @typedef {{
 *   node: !ESTree.ASTNode,
 *   loc: (!Location|undefined),
 *   message: (string|undefined),
 *   data: (!Object|undefined),
 *   fix: (function()|undefined),
 * }}
 */
let MessageDescriptorWithNode;

/**
 * An error message description.
 * @typedef {(MessageDescriptorWithLoc|MessageDescriptorWithNode)}
 */
let MessageDescriptor;


// result.type === "TryStatement"
// result.range
// result.loc.{start,end}.column
// result.generator
// result.value


/**
 * Acts as an abstraction layer between rules and the main eslint object.
 * @record
 */
const ESLintRule = function() {};

