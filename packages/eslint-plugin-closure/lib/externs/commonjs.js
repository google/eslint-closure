
/**
 * @fileoverview An extern file for commonjs modules.  We take this approach
 * because we don't want to typecheck all node_modules.  I only care about the
 * provided externs file.  This works because we're not outputting or minifying
 * anything.  We only want typechecking.
 * @externs
 */

/* eslint no-unused-vars: "off" */

/** @type {!Object} */
let module = {};

/** @type {!Object<string, *>} */
module.exports;

/**
 * @param {string} src
 * @return {!Object}
 */
function require(src) {}
