// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



/**
 * Saves and closes the configuration.
 */
function saveConfigAndClose() {
  saveConfig();
  $('#configuration').collapse('hide');
}

/**
 * Saves the tweaked configuration to local storage.
 */
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
  // localStorage.rules = JSON.stringify(rules);
  // localStorage.ecmaFeatures = JSON.stringify(ecmaFeatures);
  // localStorage.env = JSON.stringify(environments);
  verify();
}
/**
 *
 * @param {!Object} checkbox
 * @param {!Object} rule
 */
function addPopover(checkbox, rule) {
  checkbox.popover({
    title: rule,
    content() {
      const me = $(this);
      if (me.data('content')) {
        return me.data('content');
      } else {
        $.ajax({
          url: '/docs/rules/' + me.text() + '.html',
          method: 'GET',
          success(data) {
            const html = $(data);
            const firstParagraph = html.find('p:first');
            $('.popover-content').html(firstParagraph);
            me.data('content', firstParagraph);
          },
        });
        return 'Loading...';
      }
    },
    placement(popover, checkbox) {
      return $(checkbox).offset().left < 270 ? 'right' : 'left';
    },
    html: true,
  });
  checkbox.on('mouseenter', function() { $(this).popover('show'); });
  checkbox.on('mouseleave', function() { $(this).popover('hide'); });
}

/**
 * Makes a config.
 * @param {} rules
 * @param {} environments
 * @param {} ecmaFeatures
 */
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

if (localStorage.rules) {
  OPTIONS.rules = JSON.parse(localStorage.rules);
}
if (localStorage.env) {
  OPTIONS.env = JSON.parse(localStorage.env);
}
if (localStorage.ecmaFeatures) {
  OPTIONS.ecmaFeatures = JSON.parse(localStorage.ecmaFeatures);
}

ensure certain environments are available
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
