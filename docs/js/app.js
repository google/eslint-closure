goog.module('closureLint.docs.app');

const TagName = goog.require('goog.dom.TagName');
const asserts = goog.require('goog.asserts');

const closureLintPlugin = require('eslint-plugin-closure');
const closureConfigBase = require('eslint-config-closure-base');
const closureConfigEs5 = require('eslint-config-closure-es5');
const closureConfigEs6 = require('eslint-config-closure-es6');
const merge = /** @type {function(!Object, ...!Object):!Object} */ (require('lodash.merge'));

// ESLint is added manually by using their browserify config in the Makefile.
// It's difficult to use Webpack to bundle ESLint ourselves because of the use
// of fs module and because the way that rules are exposed confuses Webpack.
const eslint = /** @type {!ESLint.Linter} */ (window['eslint']);

/** @type {!CM.Doc} */
let EDITOR;
const CSS_CLASS_WARNING = 'editor-warning';
const CSS_CLASS_ERROR = 'editor-error';

/**
 * Clones an Object by round-tripping through JSON.
 * @param {!Object<T>} obj
 * @return {!Object<T>}
 * @template T
 */
function clone(obj) {
  return /** @type {!Object<T>} */ (JSON.parse(JSON.stringify(obj)));
}

const BASE_OPTIONS = /** @type {!ESLint.Config} */ (closureConfigBase);
const ES5_OPTIONS = /** @type {!ESLint.Config} */ (
    merge(clone(BASE_OPTIONS), closureConfigEs5));
const ES6_OPTIONS = /** @type {!ESLint.Config} */ (
    merge(clone(BASE_OPTIONS), closureConfigEs6));
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
  asserts.assertInstanceOf(es5Button, TagName.BUTTON);
  asserts.assertInstanceOf(es6Button, TagName.BUTTON);

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
 * @param {boolean} immediate
 * @return {!Function}
 * @suppress {newCheckTypes}
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
  const result = document.createElement('div');
  const classList = result.classList;

  classList.add('alert');

  if (options.fatal) {
    classList.add('alert-danger');
  }

  if (options.hasOwnProperty('severity')) {
    if (options.severity === 1) {
      classList.add('alert-warning');
    } else if (options.severity === 2) {
      classList.add('alert-danger');
    }
  } else {
    classList.add('alert-success');
  }

  if (options.hasOwnProperty('column') &&
      options.hasOwnProperty('line') &&
      options.hasOwnProperty('message')) {

    // TODO: Add goto error
    result.onclick = null;
        // (function(EDITOR, options) {
        //   EDITOR.onGotoLine(
        //       options.line - 1, options.column - 1, options.column - 1);
        // }).bind(null, EDITOR, options);

    result.innerHTML = options.line + ':' + options.column + ' - ' +
        options.message + ' (<a href="http://eslint.org/docs/rules/' +
        options.ruleId + '">' + options.ruleId + '</a>)';
    result.setAttribute('title', options.message);
  } else if (options.hasOwnProperty('message')) {
    result.textContent = 'Lint-free!';
  }

  return result;
}

/**
 * Removes all warning and error marks from the editor.
 */
function removeWarningsErrors() {
  EDITOR.getAllMarks().forEach((mark) => {
    mark.clear();
  });
}

/**
 * Returns the CSS class for eslintMessage's severity
 * @param {!ESLint.LintMessage} eslintMessage
 * @return {string}
 */
function messageSeverityCssClass(eslintMessage) {
  if (eslintMessage.severty == 2) {
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
  const resultsNode = document.getElementById('results');

  const nodes = Array.from(resultsNode.childNodes);
  nodes.forEach(resultsNode.removeChild.bind(resultsNode));

  if (results.length === 0) {
    const resultNode = makeResultNode({message: 'Lint-free!'});
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

  const CodeMirror = /** @type {!CM.Object} */ (window['CodeMirror']);

  const EDITOR_TEXT_AREA_ELEMENT = /** @type {!HTMLTextAreaElement} */ (
      document.getElementById('editor'));

  EDITOR = CodeMirror.fromTextArea(EDITOR_TEXT_AREA_ELEMENT, {
    mode: 'javascript',
    lineNumbers: true,
  });

  const prefixedKeys = Object.keys(closureLintPlugin.rules)
        .reduce((newObj, key) => {
          const prefixedKey = 'closure/' + key;
          newObj[prefixedKey] = closureLintPlugin.rules[key];
          return newObj;
        }, {});
  eslint.defineRules(prefixedKeys);

  const verify = debounce(function() {
    const content = EDITOR.getValue();
    removeWarningsErrors();
    console.log('verifying', content);
    const results = eslint.verify(content, OPTIONS);
    console.log(results);
    displayResults(results);
  }, 500);

  verify();

  EDITOR.on('change', verify);
}

document.addEventListener('DOMContentLoaded', setupEslint);
