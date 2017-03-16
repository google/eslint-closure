/**
 * @fileoverview Externs needed for node.
 * @externs
 */


/** @const */
const NodeJS = {};

/** @record */ NodeJS.fs = function() {};

/**
 * @param {string} filename
 * @param {function(?Error, !Uint8Array):void} callback
 * @this {undefined}
 * @return {void}
 */
NodeJS.fs.prototype.readFile = function(filename, callback) {};

/**
 * @param {string} file
 * @param {({encoding:string}|undefined)} options
 * @this {undefined}
 * @return {string}
 */
NodeJS.fs.prototype.readFileSync = function(file, options) {};

/** @record */ NodeJS.glob = function() {};
/** @type {function(string):!Array<string>} */
NodeJS.glob.prototype.sync = function(pattern) {};


/** @record */ NodeJS.path = function() {};

/**
 * @param {string} path
 * @return {string}
 */
NodeJS.path.prototype.resolve = function(path) {};
