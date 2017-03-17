/**
 * @fileoverview An extern file for Mocha.
 * @externs
 */

/* eslint no-unused-vars: "off" */

/**
 * @final @struct @constructor
 */
const MochaJS = function() {};


/**
 * @final @struct @constructor
 */
Mocha.Suite = function() {};

/** @type {function(!Mocha.Suite, string)} */
Mocha.prototype.Suite.prototype.create = function(suite, description) {};

/** @type {function(!Mocha.Suite):!Mocha.Suite} */
Mocha.prototype.Suite.prototype.addSuite = function(suite, description) {};

/** @type {function(!Mocha.Test):!Mocha.Suite} */
Mocha.prototype.Suite.prototype.addTest = function(Test) {};

/**
 * @param {string} title
 * @param {function():void} fn
 * @final @struct @constructor
 */
Mocha.prototype.Test = function(title, fn) {};
/**
 * @param {string} description
 * @param {function()} spec
 * @return {!MochaJS.ContextDefinition}
 * @constructor
 */
let describe = function(description, spec) {};

/**
 * @param {string} description
 * @param {function()} spec
 * @return {!Mocha.ContextDefinition}
 * @constructor
 */
let xdescribe = function(description, spec) {};

/**
 * @param {string} description
 * @param {!Mocha.ActionFunction} spec
 * @return {!Mocha.TestDefinition}
 * @constructor
 */
let it = function(description, spec) {};

/**
 * @param {string} description
 * @param {!Mocha.ActionFunction} spec
 * @return {!Mocha.TestDefinition}
 * @constructor
 */
let xit = function(description, spec) {};

/** @record */
Mocha.ContextDefinition = function() {};
/**
 * @param {string} description
 * @param {function()} spec
 * @return {void}
 */
Mocha.ContextDefinition.prototype.only = (description, spec) => {};
/**
 * @param {string} description
 * @param {function()} spec
 * @return {void}
 */
Mocha.ContextDefinition.prototype.skip = (description, spec) => {};
/**
 * @param {number} ms
 * @return {void}
 */
Mocha.ContextDefinition.prototype.timeout = (ms) => {};

/** @record */
Mocha.TestDefinition = function() {};

/**
 * @param {string} expectation
 * @param {!Mocha.ActionFunction=} assertion
 * @return {void}
 */
Mocha.TestDefinition.prototype.only = (expectation, assertion) => {};

/**
 * @param {string} expectation
 * @param {!Mocha.ActionFunction=} assertion
 * @return {void}
 */
Mocha.TestDefinition.prototype.skip = (expectation, assertion) => {};

/**
 * @param {number} ms
 * @return {void}
 */
Mocha.TestDefinition.prototype.timeout = (ms) => {};

/** @type {string} */
Mocha.TestDefinition.prototype.state;

/**
 * @param {!Mocha.ActionFunction} action
 * @return {void}
 */
const setup = (action) => {};

/**
 * @param {!Mocha.ActionFunction} action
 * @return {void}
 */
const teardown = (action) => {};
/**
 * @param {!Mocha.ActionFunction} action
 * @return {void}
 */
const suiteSetup = (action) => {};
/**
 * @param {!Mocha.ActionFunction} action
 * @return {void}
 */
const suiteTeardown = (action) => {};
/**
 * @param {!Mocha.ActionFunction} action
 * @param {string=} description
 * @return {void}
 */
const before = (action, description) => {};

/**
 * @param {!Mocha.ActionFunction} action
 * @param {string=} description
 * @return {void}
 */
const after = (action, description) => {};

/**
 * @param {!Mocha.ActionFunction} action
 * @param {string=} description
 * @return {void}
 */
const beforeEach = (action, description) => {};

/**
 * @param {!Mocha.ActionFunction} action
 * @param {string=} description
 * @return {void}
 */
const afterEach = (action, description) => {};

/**
 * @param {*?} error
 * @return {*}
 * @constructor
 */
Mocha.Done = function(error) {};

/** @typedef {function(!Mocha.Done):*} */
Mocha.ActionFunction;
