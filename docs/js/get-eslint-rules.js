"use strict";

const fs = require("fs"),
    path = require("path");

const ESLINT_RULES_DIR = path.resolve('node_modules/eslint/lib/rules');

function getESLintRules() {
  const rules = Object.create(null);

  fs.readdirSync(ESLINT_RULES_DIR).forEach(function(file) {
    if (path.extname(file) !== '.js') {
      return;
    }
    rules[file.slice(0, -3)] = path.join(ESLINT_RULES_DIR, file);
  });
  return rules;
}

console.log(getESLintRules());
