/**
 * @fileoverview Externs needed for node.
 * @externs
 */

/** @record @extends {IThenable} */
const Bluebird = function() {};


/**
 * @param {function(this:undefined, TYPE, function(?Error, VALUE):void):void} fn
 * @return {function(TYPE):!Promise<VALUE>}
 * @template TYPE, VALUE
 */
Bluebird.prototype.promisify = function(fn) {};

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @param {!Iterable<VALUE>} iterable
 * @return {!Promise<!Array<RESULT>>}
 * @template VALUE
 * @template RESULT := mapunion(VALUE, (V) =>
 *     cond(isUnknown(V),
 *         unknown(),
 *         cond(isTemplatized(V) && sub(rawTypeOf(V), 'IThenable'),
 *             templateTypeOf(V, 0),
 *             cond(sub(V, 'Thenable'), unknown(), V))))
 * =:
 */
Bluebird.prototype.all = function(iterable) {};
