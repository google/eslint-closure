
/**
 * @fileoverview An extern for selected portions of lodash
 * https://github.com/lodash/lodash
 * @externs
 */

/** @const */
const Lodash = {};

/** The overall lodash module.
 * @record
 */
Lodash.Module = function() {};

/**
 * This method is like _.isMatch except that it accepts customizer which is
 * invoked to compare values. If customizer returns undefined, comparisons are
 * handled by the method instead. The customizer is invoked with five arguments:
 * (objValue, srcValue, index|key, object, source).
 * @param {!Object} object The object to inspect.
 * @param {!Object} source The object of property values to match.
 * @param {!Lodash.isMatchWithCustomizer} customizer The function to customize
 *     comparisons.
 * @return {boolean} Returns `true` if `object` is a match, else `false`.
 */
Lodash.Module.prototype.isMatchWith = function(object, source, customizer) {};

/**
 * Function used with `isMatchWith` to compare values.
 * @param {*} value
 * @param {*} other
 * @param {(number|string)=} indexOrKey
 * @param {!Object=} object
 * @param {!Object=} src
 */
Lodash.Module.prototype.isMatchWithCustomizer = function(value, other, indexOrKey, object,
                                        src) {};
