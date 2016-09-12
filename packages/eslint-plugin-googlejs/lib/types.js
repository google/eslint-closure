goog.module('googlejs.plugin.types');

/**
 * The type of underscore in an identifier.
 * @enum {string}
 * @const
 */
const UnderscoreForm = {
  CONSTANT: 'constant',
  LEADING: 'leading',
  NO_UNDERSCORE: 'no_underscore',
  MIDDLE: 'middle',
  OPT_PREFIX: 'opt_prefix',
  TRAILING: 'trailing',
  VAR_ARGS: 'var_args',
}

exports = {
  /** @const {UnderscoreForm} */
  UnderscoreForm,
}
