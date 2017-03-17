/**
 * @fileoverview An extern file for Mocha. Uses MochaJS to not conflict with the
 * common import pattern.
 *    const Mocha = require('mocha');
 * @externs
 */

/* eslint no-unused-vars: "off" */


const MochaJS = {}
/**
 * @type {(!MochaJS|function(new:MochaJS))}
 */
MochaJS.Module;

/** @type {!MochaJS.Suite} */
MochaJS.prototype.Suite;

/**
 * @final @struct @constructor
 */
MochaJS.Suite = function() {};

/** @type {function(!MochaJS.Suite, string)} */
MochaJS.Suite.prototype.create = function(suite, description) {};

/** @type {function(!MochaJS.Suite):!MochaJS.Suite} */
MochaJS.Suite.prototype.addSuite = function(suite) {};

/** @type {function(!MochaJS.Test):!MochaJS.Suite} */
MochaJS.Suite.prototype.addTest = function(Test) {};

/**
 * @param {string} title
 * @param {function():void} fn
 * @final @struct @constructor
 */
MochaJS.Test = function(title, fn) {};
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
 * @return {!MochaJS.ContextDefinition}
 * @constructor
 */
let xdescribe = function(description, spec) {};

/**
 * @param {string} description
 * @param {!MochaJS.ActionFunction} spec
 * @return {!MochaJS.TestDefinition}
 * @constructor
 */
let it = function(description, spec) {};

/**
 * @param {string} description
 * @param {!MochaJS.ActionFunction} spec
 * @return {!MochaJS.TestDefinition}
 * @constructor
 */
let xit = function(description, spec) {};

/** @record */
MochaJS.ContextDefinition = function() {};
/**
 * @param {string} description
 * @param {function()} spec
 * @return {void}
 */
MochaJS.ContextDefinition.prototype.only = (description, spec) => {};
/**
 * @param {string} description
 * @param {function()} spec
 * @return {void}
 */
MochaJS.ContextDefinition.prototype.skip = (description, spec) => {};
/**
 * @param {number} ms
 * @return {void}
 */
MochaJS.ContextDefinition.prototype.timeout = (ms) => {};

/** @record */
MochaJS.TestDefinition = function() {};

/**
 * @param {string} expectation
 * @param {!MochaJS.ActionFunction=} assertion
 * @return {void}
 */
MochaJS.TestDefinition.prototype.only = (expectation, assertion) => {};

/**
 * @param {string} expectation
 * @param {!MochaJS.ActionFunction=} assertion
 * @return {void}
 */
MochaJS.TestDefinition.prototype.skip = (expectation, assertion) => {};

/**
 * @param {number} ms
 * @return {void}
 */
MochaJS.TestDefinition.prototype.timeout = (ms) => {};

/** @type {string} */
MochaJS.TestDefinition.prototype.state;

/**
 * @param {!MochaJS.ActionFunction} action
 * @return {void}
 */
const setup = (action) => {};

/**
 * @param {!MochaJS.ActionFunction} action
 * @return {void}
 */
const teardown = (action) => {};
/**
 * @param {!MochaJS.ActionFunction} action
 * @return {void}
 */
const suiteSetup = (action) => {};
/**
 * @param {!MochaJS.ActionFunction} action
 * @return {void}
 */
const suiteTeardown = (action) => {};
/**
 * @param {!MochaJS.ActionFunction} action
 * @param {string=} description
 * @return {void}
 */
const before = (action, description) => {};

/**
 * @param {!MochaJS.ActionFunction} action
 * @param {string=} description
 * @return {void}
 */
const after = (action, description) => {};

/**
 * @param {!MochaJS.ActionFunction} action
 * @param {string=} description
 * @return {void}
 */
const beforeEach = (action, description) => {};

/**
 * @param {!MochaJS.ActionFunction} action
 * @param {string=} description
 * @return {void}
 */
const afterEach = (action, description) => {};

/**
 * @param {*?} error
 * @return {*}
 * @constructor
 */
MochaJS.Done = function(error) {};

/** @typedef {function(!MochaJS.Done):*} */
MochaJS.ActionFunction;
