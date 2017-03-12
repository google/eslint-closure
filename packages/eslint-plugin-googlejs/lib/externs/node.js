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
 * @typedef {function(string, function(?Error, !Array<string>))}
 */
NodeJS.glob;


/** @record */ NodeJS.path = function() {};

/**
 * @param {string} path
 * @return {string}
 */
NodeJS.path.prototype.resolve = function(path) {};
