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
 * @fileoverview An extern file for commonjs modules.  We take this approach
 * because we don't want to typecheck all node_modules.  I only care about the
 * provided externs file.  This works because we're not outputting or minifying
 * anything.  We only want typechecking.
 * @externs
 */

/* eslint no-unused-vars: "off" */

/** @type {!Object} */
let module = {};

/** @type {!Object<string, *>} */
module.exports;

/**
 * @param {string} src
 * @return {!Object}
 */
function require(src) {}
