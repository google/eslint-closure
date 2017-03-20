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

if (process.env.NODE_ENV === 'development') {
  require('../index.html')
}

/** @type {!CM.Doc} */
let EDITOR;
const CSS_CLASS_WARNING = 'cm__lint-warning';
const CSS_CLASS_ERROR = 'cm__lint-error';

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
 * @param {!ESLint.LintMessage} msg
 * @return {!HTMLDivElement}
 */
function makeResultNode(msg) {
  const result = /** @type {!HTMLDivElement} */ (document.createElement('li'));
  const classList = result.classList;

  classList.add('mdl-list__item');

  if (msg.fatal) {
    classList.add('lint-result__fatal');
  }

  switch (msg.severity) {
    case 1:
      classList.add('list-result__warning');
      break;
    case 2:
      classList.add('lint-result__error');
      break;
    default:
      classList.add('lint-result__unknown');
  }

  const lintMessage = `<span class="mdl-list__item-primary-content">
${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})</span>`
  result.innerHTML = lintMessage;
  return result;
}

/**
 * Removes all warning and error marks from the editor.
 * @suppress {newCheckTypes,reportUnknownTypes}
 */
function removeWarningsErrors() {
  EDITOR.getAllMarks().forEach(mark => mark.clear());
  EDITOR.clearGutter('cm-gutter-container__error');
  EDITOR.clearGutter('cm-gutter-container__warning');
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
  eslintMessages.forEach((msg) => {
    // NOTE: ESLint is 1 based, CodeMirror is 0 based.
    const startLine = msg.line - 1;
    const startColumn = msg.column - 1;
    const endLine = msg.endLine || startLine;
    const endColumn = msg.endColumn || startColumn + 1;

    const className = messageSeverityCssClass(msg);

    // TODO: add description on hover
    const description = `${msg.msg} (${msg.ruleId})`;

    const markStart = {line: startLine, ch: startColumn};
    const markEnd = {line: endLine, ch: endColumn};
    const markOptions = {className};

    EDITOR.markText(markStart, markEnd, markOptions);

    const gutterContainerName = msg.severity == 2 ?
          'cm-gutter-container__error' :
          'cm-gutter-container__warning';
    const gutterClassName = msg.severity == 2 ? 'cm-gutter__error' :
          'cm-gutter__warning';
    const gutterLineElem =  document.createElement('span');
    gutterLineElem.textContent = '●';
    gutterLineElem.classList.add(gutterClassName);
    EDITOR.setGutterMarker(startLine, gutterContainerName, gutterLineElem);
  });
}

/**
 * Adds all ESLint warnings and errors as divs next to the editor.
 * @param {!Array<!ESLint.LintMessage>} results
 */
function displayResults(results) {
  const resultsNode = /** @type {!HTMLUlElement} */ (
      document.getElementById('results'));
  if (!resultsNode) {
    throw new Error('Can\'t find #results element.');
  }

  const nodes = Array.from(resultsNode.childNodes);
  nodes.forEach(resultsNode.removeChild.bind(resultsNode));

  if (results.length === 0) {
    const resultNode = makeResultNode({
      msg: 'Lint-free!', severity: -1, line: -1, column: -1,
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
 * Returns a function that verifies the content in code mirror with linter.
 * @param {!ESLint.Linter} linter
 * @param {!CM.Doc} codeMirrorDoc
 * @return {function()}
 */
function makeVerifier(linter, codeMirrorDoc) {
  return debounce(() => {
    removeWarningsErrors();
    const content = codeMirrorDoc.getValue();
    const results = linter.verify(content, OPTIONS);
    displayResults(results);
  }, 500);
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
    gutters: ['cm-gutter-container__error', 'cm-gutter-container__warning'],
  }));
  console.log('Setting up editor');

  const prefixedClosureRules = {};
  Object.keys(closureLintPlugin.rules).forEach(ruleId => {
    const prefixedRuleId = 'closure/' + ruleId;
    prefixedClosureRules[prefixedRuleId ] = closureLintPlugin.rules[ruleId];
  });

  linter.defineRules(prefixedClosureRules);

  const verifyCodeMirror = makeVerifier(linter, EDITOR);

  verifyCodeMirror();
  EDITOR.on('change', verifyCodeMirror);
}


document.addEventListener('DOMContentLoaded', setupEslint);
