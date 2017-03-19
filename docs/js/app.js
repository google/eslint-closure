const closureLintPlugin = require('eslint-plugin-closure');
const closureConfigBase = require('eslint-config-closure-base');
const closureConfigEs5 = require('eslint-config-closure-es5');
const closureConfigEs6 = require('eslint-config-closure-es6');
const merge = require('lodash.merge');

// ESLint is added manually by using their browserify config in the Makefile.
// It's difficult to use Webpack to bundle ESLint ourselves because of the use
// of fs module and because the way that rules are exposed confuses Webpack.
const eslint = /** @type {!ESLint.Linter} */ (window['eslint']);

const CodeMirror = window.CodeMirror;

// TODO(jschaf): Clean this up into proper Closure-style code.
const EDITOR_TEXT_AREA_ELEMENT = document.getElementById('editor');
const EDITOR = CodeMirror.fromTextArea(EDITOR_TEXT_AREA_ELEMENT, {
  mode: 'javascript',
  lineNumbers: true,
});

const CSS_CLASS_WARNING = 'editor-warning';
const CSS_CLASS_ERROR = 'editor-error';

// Expose the EDITOR for easy access.
window.EDITOR = EDITOR;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const BASE_OPTIONS = closureConfigBase;
const ES5_OPTIONS = merge(clone(BASE_OPTIONS), closureConfigEs5);
const ES6_OPTIONS = merge(clone(BASE_OPTIONS), closureConfigEs6);
let OPTIONS = ES6_OPTIONS;

function switchConfig(configKey) {
  const es5Button = document.getElementById('es5Button');
  const es6Button = document.getElementById('es6Button');
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
  verify();
}

window.switchConfig = switchConfig;

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

function saveConfig() {
  const environments = {};
  const rules = {};
  const ecmaFeatures = {};
  $('.ecmaFeatures input')
      .each(function() {
        const name = $(this).attr('id');
        const value = $(this).is(':checked');
        ecmaFeatures[name] = value;
      });
  $('.environments input')
      .each(function() {
        const name = $(this).attr('id');
        const value = $(this).is(':checked');
        environments[name] = value;
      });
  $('.rules input')
      .each(function() {
        const name = $(this).attr('id');
        const value = $(this).is(':checked') ? 2 : 0;
        rules[name] = value;
      });

  OPTIONS.rules = rules;
  OPTIONS.env = environments;
  OPTIONS.ecmaFeatures = ecmaFeatures;
  localStorage.rules = JSON.stringify(rules);
  localStorage.ecmaFeatures = JSON.stringify(ecmaFeatures);
  localStorage.env = JSON.stringify(environments);
  verify();
}

function saveConfigAndClose() {
  saveConfig();
  $('#configuration').collapse('hide');
}

function removeWarningsErrors() {
  EDITOR.getAllMarks().forEach((mark) => {
    mark.clear();
  });
}

function messageSeverityCssClass(eslintMessage) {
  if (eslintMessage.severty == 2) {
    return CSS_CLASS_ERROR;
  } else {
    return CSS_CLASS_WARNING;
  }
}

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

function addPopover(checkbox, rule) {
  // checkbox.popover({
  //   title: rule,
  //   content() {
  //     const me = $(this);
  //     if (me.data('content')) {
  //       return me.data('content');
  //     } else {
  //       $.ajax({
  //         url: '/docs/rules/' + me.text() + '.html',
  //         method: 'GET',
  //         success(data) {
  //           const html = $(data);
  //           const firstParagraph = html.find('p:first');
  //           $('.popover-content').html(firstParagraph);
  //           me.data('content', firstParagraph);
  //         },
  //       });
  //       return 'Loading...';
  //     }
  //   },
  //   placement(popover, checkbox) {
  //     return $(checkbox).offset().left < 270 ? 'right' : 'left';
  //   },
  //   html: true,
  // });
  // checkbox.on('mouseenter', function() { $(this).popover('show'); });
  // checkbox.on('mouseleave', function() { $(this).popover('hide'); });
}

function populateConfiguration(rules, environments, ecmaFeatures) {
  let checkbox;
  let parent;

  // ecmaFeatures
  for (const feature in ecmaFeatures) {
    checkbox = $(
        '<div class="checkbox-inline"><label><input class="feature" type="checkbox" />' +
          feature + '</label></div>');
    $('input', checkbox)
        .attr('id', feature)
        .prop('checked', ecmaFeatures[feature]);
    $('.ecmaFeatures .list').append(checkbox);
  }

  // environments
  for (const env in environments) {
    checkbox = $(
        '<div class="checkbox-inline"><label><input type="checkbox" />' +
          env + '</label></div>');
    $('input', checkbox)
        .attr('id', env)
        .prop('checked', environments[env]);
    $('.environments .list').append(checkbox);
  }

  // rules
  Object.keys(rules).forEach(function(rule, i, keys) {
    const limit = Math.ceil(keys.length / 3);
    if (i % limit === 0) {
      parent = $('<div class="col-md-4"></div>');
      $('.rules').append(parent);
    }
    checkbox =
        $('<div class="checkbox"><label><input type="checkbox" />' +
          rule + '</label></div>');
    addPopover(checkbox, rule);
    $('input', checkbox)
        .attr('id', rule)
        .prop('checked', rules[rule] !== 0);
    parent.append(checkbox);
  });

  $('#configuration').on('change', 'input[type=checkbox]', saveConfig);
  $('#configuration .btn').click(saveConfigAndClose);
}

// if (localStorage.rules) {
//   OPTIONS.rules = JSON.parse(localStorage.rules);
// }
// if (localStorage.env) {
//   OPTIONS.env = JSON.parse(localStorage.env);
// }
// if (localStorage.ecmaFeatures) {
//   OPTIONS.ecmaFeatures = JSON.parse(localStorage.ecmaFeatures);
// }

// ensure certain environments are available
OPTIONS.env = OPTIONS.env || {};
OPTIONS.env.node = OPTIONS.env.node || false;
OPTIONS.env.browser = OPTIONS.env.browser || false;
OPTIONS.env.amd = OPTIONS.env.amd || false;
OPTIONS.env.mocha = OPTIONS.env.mocha || false;
OPTIONS.env.jasmine = OPTIONS.env.jasmine || false;
OPTIONS.env.phantomjs = OPTIONS.env.phantomjs || false;
OPTIONS.env.qunit = OPTIONS.env.qunit || false;
OPTIONS.env.jquery = OPTIONS.env.jquery || false;
OPTIONS.env.prototypejs = OPTIONS.env.prototypejs || false;
OPTIONS.env.shelljs = OPTIONS.env.shelljs || false;
OPTIONS.env.meteor = OPTIONS.env.meteor || false;
OPTIONS.env.mongo = OPTIONS.env.mongo || false;
OPTIONS.env.applescript = OPTIONS.env.applescript || false;
OPTIONS.env.serviceworker = OPTIONS.env.serviceworker || false;
OPTIONS.env.embertest = OPTIONS.env.embertest || false;
OPTIONS.env.es6 = OPTIONS.env.es6 || false;

// include certain ecma features
OPTIONS.ecmaFeatures = OPTIONS.ecmaFeatures || {};
OPTIONS.ecmaFeatures.modules = OPTIONS.ecmaFeatures.module || false;

populateConfiguration(OPTIONS.rules, OPTIONS.env, OPTIONS.ecmaFeatures);

console.log(closureLintPlugin.rules);
const prefixedKeys = Object.keys(closureLintPlugin.rules)
      .reduce((newObj, key) => {
        const prefixedKey = 'closure/' + key;
        newObj[prefixedKey] = closureLintPlugin.rules[key];
        return newObj;
      }, {});
eslint.defineRules(prefixedKeys);
console.log(prefixedKeys);

console.log('OPTIONS', OPTIONS);

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
