/**
 * @fileoverview
 * @suppress {reportUnknownTypes}
 */
const closureLintPlugin = /** @const {!ESLint.Config} */ (
    require('eslint-plugin-closure'));
const closureConfigBase = /** @const {!ESLint.Config} */ (
    require('eslint-config-closure-base'));
const closureConfigEs5 = /** @const {!ESLint.Config} */ (
    require('eslint-config-closure-es5'));
const closureConfigEs6 = /** @const {!ESLint.Config} */ (
    require('eslint-config-closure-es6'));

/** @type {!CM.Doc} */
let EDITOR;
const CSS_CLASS_WARNING = 'editor-warning';
const CSS_CLASS_ERROR = 'editor-error';

/**
 * Creates a new ESLint config by merging a and b.  b overwrites a.
 * @param {!ESLint.Config} a
 * @param {!ESLint.Config} b
 * @return {!ESLint.Config}
 */
function mergeRules(a, b) {
  const combinedRule = {
    rules: {},
    parserOptions: {},
    settings: {},
    env: {},
    global: {},
  };
  Object.assign(combinedRule.rules,
                a.rules || {}, b.rules || {});
  Object.assign(combinedRule.parserOptions,
                a.parserOptions || {}, b.parserOptions || {});
  Object.assign(combinedRule.settings,
                a.settings || {}, b.settings || {});
  Object.assign(combinedRule.env,
                a.env || {}, b.env || {});
  Object.assign(combinedRule.global,
                a.global || {}, b.global || {});
  combinedRule.parser = b.parser || a.parser;
  return combinedRule;
}

/** @const {!ESLint.Config} */
const BASE_OPTIONS = closureConfigBase;
/** @const {!ESLint.Config} */
const ES5_OPTIONS = mergeRules(BASE_OPTIONS, closureConfigEs5);
/** @const {!ESLint.Config} */
const ES6_OPTIONS = mergeRules(BASE_OPTIONS, closureConfigEs6);
/** @type {!ESLint.Config} */
let OPTIONS = ES6_OPTIONS;

/**
 * Switches between ES5 and ES6 ESLint configs.
 * @param {string} configKey
 * @throws {Error}
 */
function switchConfig(configKey) {
  const es5Button = document.getElementById('es5Button');
  const es6Button = document.getElementById('es6Button');
  if (!es5Button || !es6Button) {
    throw new Error('Can\'t find buttons');
  }

  const buttonHighlight = 'mdl-button--accent';
  switch (configKey) {
    case 'es5':
      OPTIONS = ES5_OPTIONS;
      es5Button.classList.add(buttonHighlight);
      es6Button.classList.remove(buttonHighlight);
      break;

    case 'es6':
      OPTIONS = ES6_OPTIONS;
      es6Button.classList.add(buttonHighlight);
      es5Button.classList.remove(buttonHighlight);
      break;

    default:
      throw new Error('Unrecoginized config key, use es5 or es6.');
  }
  // verify();
}
window['switchConfig'] = switchConfig;

/**
 * Debounces a function.
 * @param {!Function} func
 * @param {number} wait
 * @param {boolean=} immediate
 * @return {!Function}
 * @suppress {newCheckTypes,reportUnknownTypes}
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Makes a div container for ESLint results.
 * @param {!ESLint.LintMessage} options
 * @return {!HTMLDivElement}
 */
function makeResultNode(options) {
  const result = /** @type {!HTMLDivElement} */ (document.createElement('div'));
  const classList = result.classList;

  classList.add('alert');

  if (options.fatal) {
    classList.add('alert-danger');
  }


  switch (options.severity) {
    case 1:
      classList.add('alert-warning');
      break;
    case 2:
      classList.add('alert-danger');
      break;
    default:
      classList.add('alert-success');
  }

  // result.onclick = null;
  // (function(EDITOR, options) {
  //   EDITOR.onGotoLine(
  //       options.line - 1, options.column - 1, options.column - 1);
  // }).bind(null, EDITOR, options);

  result.innerHTML = `${options.line}:${options.column} - ${options.message} ` +
      `(${options.ruleId})`;
  result.setAttribute('title', options.message);

  return result;
}

/**
 * Removes all warning and error marks from the editor.
 * @suppress {newCheckTypes,reportUnknownTypes}
 */
function removeWarningsErrors() {
  EDITOR.getAllMarks().forEach(mark => mark.clear());
}

/**
 * Returns the CSS class for eslintMessage's severity
 * @param {!ESLint.LintMessage} eslintMessage
 * @return {string}
 */
function messageSeverityCssClass(eslintMessage) {
  if (eslintMessage.severity == 2) {
    return CSS_CLASS_ERROR;
  } else {
    return CSS_CLASS_WARNING;
  }
}

/**
 * Add all ESLint warnings and errors to editor.
 * @param {!Array<!ESLint.LintMessage>} eslintMessages
 */
function addWarningsErrors(eslintMessages) {
  eslintMessages.forEach((message) => {
    // ESLint is 1 based, CodeMirror is 0 based.
    // TODO: handle cases wh
    const line = message.line - 1;
    const startColumn = message.column - 1;
    const endColumn = startColumn + 1;
    const className = messageSeverityCssClass(message);
    // TODO: add description on hover
    const description = `${message.message} (${message.ruleId})`;

    const markStart = {line, ch: startColumn};
    const markEnd = {line, ch: endColumn};
    const markOptions = {className};

    EDITOR.markText(markStart, markEnd, markOptions);
  });
}

/**
 * Adds all ESLint warnings and errors as divs next to the editor.
 * @param {!Array<!ESLint.LintMessage>} results
 */
function displayResults(results) {
  const resultsNode = /** @type {!HTMLDivElement} */ (
      document.getElementById('results'));
  if (!resultsNode) {
    throw new Error('Can\'t find div#results.');
  }

  const nodes = Array.from(resultsNode.childNodes);
  nodes.forEach(resultsNode.removeChild.bind(resultsNode));

  if (results.length === 0) {
    const resultNode = makeResultNode({
      message: 'Lint-free!', severity: -1, line: -1, column: -1,
      source: 'HOORAY', ruleId: 'lint-free', nodeType: 'lint-free',
    });
    resultsNode.appendChild(resultNode);
  } else {
    results.forEach(function(result) {
      const resultNode = makeResultNode(result);
      resultsNode.appendChild(resultNode);
    });
  }

  removeWarningsErrors();
  addWarningsErrors(results);
}

/**
 * Initializes ESLint.
 */
function setupEslint() {

  // ESLint is added manually by using their browserify config in the Makefile.
  // It's difficult to use Webpack to bundle ESLint ourselves because of the use
  // of fs module and because the way that rules are exposed confuses Webpack.

  /** @const {!ESLint.Linter} */
  const linter = /** @type {!ESLint.Linter} */ (window['eslint']);

  /** @const {!CM.Object} */
  const CodeMirror = /** @type {!CM.Object} */ (window['CodeMirror']);

  const editorTextArea = /** @type {!HTMLTextAreaElement} */ (
      document.getElementById('editor'));


  EDITOR = /** @type {!CM.Doc} */ (CodeMirror.fromTextArea(editorTextArea, {
    mode: 'javascript',
    lineNumbers: true,
  }));

  const prefixedClosureRules = {};
  Object.keys(closureLintPlugin.rules).forEach(ruleId => {
    const prefixedRuleId = 'closure/' + ruleId;
    prefixedClosureRules[prefixedRuleId ] = closureLintPlugin.rules[ruleId];
  });

  linter.defineRules(prefixedClosureRules);

  const verify = debounce(function() {
    const content = EDITOR.getValue();
    removeWarningsErrors();
    const results = linter.verify(content, OPTIONS);
    displayResults(results);
  }, 500);

  verify();

  EDITOR.on('change', verify);
}

document.addEventListener('DOMContentLoaded', setupEslint);
