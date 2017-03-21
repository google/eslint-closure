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
  require('../index.html');
}

/** @type {!CM.Doc} */
let EDITOR;
const CSS_CLASS_WARNING = 'cm__lint-warning';
const CSS_CLASS_ERROR = 'cm__lint-error';
const GUTTER_NAME = 'cm-gutter-container';
const SINGLE_COLUMN_RULES = {
  'closure/indent': true,
  'dot-location': true,
  'dot-notation': true,
  'eol-last': true,
  'no-empty': true,
  'no-extra-parens': true,
  'no-extra-semi': true,
  'no-irregular-whitespace': true,
  'no-regex-spaces': true,
  'semi': true,
}

class Editor {
  /**
   *
   * @param {!ESLint.Linter} linter
   * @param {!CM.Object} CodeMirror
   * @param {!HTMLTextAreaElement} textArea
   */
  constructor(linter, CodeMirror, textArea) {
    this.codeMirrorDoc = CodeMirror.fromTextArea(textArea, {
      mode: 'javascript',
      lineNumbers: true,
      gutters: [GUTTER_NAME],
    });
    this.linter = linter;

    this.eslintMessages = [];

    this.resultsNode = /** @type {!HTMLUlElement} */ (
        document.getElementById('results'));
    if (!this.resultsNode) {
      throw new Error('Can\'t find #results element.');
    }

    const prefixedClosureRules = {};
    Object.keys(closureLintPlugin.rules).forEach(ruleId => {
      const prefixedRuleId = 'closure/' + ruleId;
      prefixedClosureRules[prefixedRuleId ] = closureLintPlugin.rules[ruleId];
    });

    this.linter.defineRules(prefixedClosureRules);

    const debouncedVerifyCode = debounce(() => {
      this.clearAllErrors();
      const results = this.verifyCode();
      this.displayLintResults(results);
    }, 500);

    debouncedVerifyCode();
    this.codeMirrorDoc.on('change', debouncedVerifyCode);
  }

  fixAll() {
    const {messages, output} = applyFixes(this.getValue(), this.eslintMessages);
    this.codeMirrorDoc.setValue(output);
    this.displayLintResults(messages);
  }

  /**
   *
   * @return {!Array<!ESLint.LintMessage>}
   */
  verifyCode() {
    const content = this.codeMirrorDoc.getValue();
    const messages = this.linter.verify(content, OPTIONS);
    this.eslintMessages = messages.map(
        msg => this.codeMirrorifyEslintMessage(msg));
    this.eslintMessagesByLine = this.groupMessagesByLine(this.eslintMessages);
    return this.eslintMessages;
  }

  /**
   * Modifies an ESLint message into code mirror friendly conventions:
   * - 0-based indexing
   * - computes a reasonable end-column and end-line.
   * @param {!ESLint.LintMessage} msg
   * @return {!ESLint.LintMessage}
   */
  codeMirrorifyEslintMessage(msg) {
    msg.line--;
    const sourceLine = this.codeMirrorDoc.getLine(msg.line);
    msg.column = Math.min(sourceLine.length - 1, msg.column - 1);
    msg.endLine = msg.endLine ? message.endLine - 1 : msg.line;
    msg.endColumn = this.findEndColumn(msg);
    return msg;
  }

  /**
   * Figures out where message should end, exclusive.
   * Most ESLint rules don't return a range, so we only highlight one character.
   * For most rules, we should highlight at least the next word.
   * @param {!ESLint.LintMessage} msg
   */
  findEndColumn(msg) {
    const line = msg.line;
    const column = msg.column;
    if (SINGLE_COLUMN_RULES[msg.ruleId]) {
      return column + 1;
    }

    const content = this.codeMirrorDoc.getLine(line);
    const nextContent = content.slice(column + 1);
    let spanLength = 1;
    const matches = nextContent.match(/\w+/);
    if (matches) {
      spanLength = matches[0].length;
    }
    return column + 1 + spanLength;
  }

  groupMessagesByLine(messages) {
    const msgByLine = {};
    messages.forEach(msg => {
      const line = msg.line;
      msgByLine[line] = msgByLine[line] || [];
      msgByLine[line].push(msg);
    });
    return msgByLine;
  }

  getValue() {
    return this.codeMirrorDoc.getValue();
  }

  /**
   * Creates list of HTML lint results.
   * @param {!Array<!ESLint.LintMessage>} results
   */
  displayLintResults(messages) {
    this.resultsNode.innerHTML = "";

    if (messages.length === 0) {
      this.resultsNode.innerHTML("<li>Lint Free!</li>");
      return;
    }

    messages.forEach(message => {
      this.resultsNode.appendChild(this.makeResultNode(message));
    });

    this.markAllErrors(messages);
    this.markAllGutters(messages);
  }

  /**
   * Transform an individual ESLint message to an HTML node.
   * @param {!ESLint.LintMessage} message
   * @return {!HTMLDivElement}
   */
  makeResultNode(message) {
    const elem = /** @type {!HTMLLiElement} */ (document.createElement('li'));

    elem.classList.add('mdl-list__item');

    if (message.fatal) {
      elem.classList.add('lint-result__fatal');
    }
    if (message.severity == 1) {
      elem.classList.add('list-result__warning');
    } else {
      elem.classList.add('lint-result__error');
    }

    const lintMessage = `<span class="mdl-list__item-primary-content">
${message.line}:${message.column} - ${message.message} (${message.ruleId})</span>`
    elem.innerHTML = lintMessage;
    return elem;
  }

  clearAllErrors() {
    this.codeMirrorDoc.getAllMarks().forEach(mark => mark.clear());
    this.codeMirrorDoc.clearGutter(GUTTER_NAME);
  }

  markError(lintMessage) {
    const markStart = {line: lintMessage.line, ch: lintMessage.column};
    const markEnd = {line: lintMessage.endLine, ch: lintMessage.endColumn};
    const markOptions = {className: messageSeverityCssClass(lintMessage)};
    this.codeMirrorDoc.markText(markStart, markEnd, markOptions);
  }

  markAllErrors(lintMessages) {
    this.clearAllErrors();
    lintMessages.forEach(msg => this.markError(msg));
  }

  markAllGutters(messages) {
    this.codeMirrorDoc.clearGutter(GUTTER_NAME);
    const msgByLine = this.groupMessagesByLine(messages);
    Object.keys(msgByLine).forEach(line => {
      const messages = msgByLine[line];
      const gutterLineElem = document.createElement('span');
      gutterLineElem.textContent = '●';
      messages.forEach(msg => {
        const gutterClassName = msg.severity == 2 ? 'cm-gutter__error' :
              'cm-gutter__warning';
        gutterLineElem.classList.add(gutterClassName);
      });
      this.codeMirrorDoc.setGutterMarker(
          Number(line), GUTTER_NAME, gutterLineElem);
    });
  }

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
 * Compares items in a messages array by range.
 * @param {!ESLint.LintMessage} a The first message.
 * @param {!ESLint.LintMessage} b The second message.
 * @returns {number} -1 if a comes before b, 1 if a comes after b, 0 if equal.
 */
function compareMessagesByFixRange(a, b) {
  return a.fix.range[0] - b.fix.range[0] || a.fix.range[1] - b.fix.range[1];
}

/**
 * Applies the fixes specified by the messages to the given text. Tries to be
 * smart about the fixes and won't apply fixes over the same area in the text.
 * @param {text} text
 * @param {!Array<!ESLint.LintMessage>} messages
 * @returns {Object} An object containing the fixed text and any unfixed messages.
 */
function applyFixes(text, messages) {
  const remainingMessages = [];
  const fixableMessages = [];

  let lastPos = Number.NEGATIVE_INFINITY;
  let output = "";

  messages.forEach(message => {
    if (message.hasOwnProperty("fix")) {
      fixableMessages.push(message);
    } else {
      remainingMessages.push(message);
    }
  });
  fixableMessages.sort(compareMessagesByFixRange);
  for (const fixableMessage of fixableMessages) {
    const fix = fixableMessage.fix;
    const start = fix.range[0];
    const end = fix.range[1];

    // Keep this message if it overlaps or has a negative range.
    if (lastPos >= start || start > end) {
      remainingMessages.push(fixableMessage);
      continue;
    }

    output += text.slice(Math.max(0, lastPos), Math.max(0, start));
    output += fix.text;
    lastPos = end;
  }
  output += text.slice(Math.max(0, lastPos));

  const anyFixes = fixableMessages.length > 0;
  return {
    fixed: anyFixes,
    messages: remainingMessages,
    output,
  };

};

function setupEditor() {
  /** @const {!ESLint.Linter} */
  const linter = /** @type {!ESLint.Linter} */ (window['eslint']);

  /** @const {!CM.Object} */
  const CodeMirror = /** @type {!CM.Object} */ (window['CodeMirror']);

  const editorTextArea = /** @type {!HTMLTextAreaElement} */ (
      document.getElementById('editor'));

  const editor = new Editor(linter, CodeMirror, editorTextArea);
  window['EDITOR'] = editor;
}

document.addEventListener('DOMContentLoaded', setupEditor);
