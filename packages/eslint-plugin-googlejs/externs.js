/**
 * Configuration object for the `verify` API. A JS representation of the
 * eslintrc files.
 * @record
 */
const ESLintConfig = function() {};

/** @type {!Object} */
ESLintConfig.prototype.rules;

/** @type {string} */
ESLintConfig.prototype.parser;

/** @type {Object} */
ESLintConfig.prototype.parserOptions;

/** @type {Object} */
ESLintConfig.prototype.settings;

/** @type {Object} */
ESLintConfig.prototype.env;

/** @type {Object} */
ESLintConfig.prototype.global;



/**
 * Acts as an abstraction layer between rules and the main eslint object.
 * @record
 */
const RuleContext = function() {};

/** @type {string} ruleId The ID of the rule using this object. */
RuleContext.prototype.ruleId;

/** @type {!ESLintConfig} eslint The eslint object. */
RuleContext.prototype.eslint;

/** @type {number} severity The configured severity level of the rule. */
RuleContext.prototype.severity;

/**
 * @type {!Array<!Object>} options The configuration information to be added to the rule.
 */
RuleContext.prototype.options;

/**
 * @type {!Object} settings The configuration settings passed from the config
 *      file.
 */
RuleContext.prototype.settings;

/**
 * @type {!Object} parserOptions The parserOptions settings passed from the
 *     config file.
 */
RuleContext.prototype.parserOptions;

/** @type {!Object} parserPath The parser setting passed from the config file. */
RuleContext.prototype.parserPath;

/** @type {!Object} */
RuleContext.prototype.meta;

/**
 * Passthrough to eslint.getSourceCode().
 * @returns {SourceCode} The SourceCode object for the code.
 */
RuleContext.prototype.getSourceCode = function() {};

/**
 * Passthrough to eslint.report() that automatically assigns the rule ID and
 * severity.
 * @param {!ASTNode|!MessageDescriptor} nodeOrDescriptor The AST node related to
 *      the message or a message descriptor.
 * @param {!Object} location The location of the error.
 * @param {string} message The message to display to the user.
 * @param {Object=} opts Optional template data which produces a formatted
 *     message with symbols being replaced by this object's values.
 * @returns {void}
 */
RuleContext.prototype.report = function(nodeOrDescriptor, location, message,
                                        opts) {};

/**
 * @record
 */
const SourceCode = function() {};

/**
 * An error message description.
 * @record
 */
const MessageDescriptor = function() {};

/**
 * The type of node.
 * @type {string}
 */
MessageDescriptor.prototype.nodeType;

/**
 * The location of the problem.
 * @type {!Location}
 */
MessageDescriptor.prototype.loc;

/**
 * The problem message.
 * @type {string}
 */
MessageDescriptor.prototype.message;

/**
 * Optional data to use to fill in placeholders in the message.
 * @type {Object}
 */
MessageDescriptor.prototype.data;

/**
 * The function to call that creates a fix command.
 * @return {void}
 */
MessageDescriptor.prototype.fix = function() {};

/**
 * Acts as an abstraction layer between rules and the main eslint object.
 * @record
 */
const ASTNode = function() {};


/**
 * Acts as an abstraction layer between rules and the main eslint object.
 * @record
 */
const ESLintRule = function() {};

