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
 * @fileoverview Externs needed for node.
 * @externs
 */


/** @const */
const NodeJS = {};

/** @record */ NodeJS.fs = function() {};

/**
 * @param {string} filename
 * @param {function(?Error, !Uint8Array):void} callback
 * @this {undefined}
 * @return {void}
 */
NodeJS.fs.prototype.readFile = function(filename, callback) {};

/**
 * @param {string} file
 * @param {({encoding:string}|undefined)} options
 * @this {undefined}
 * @return {string}
 */
NodeJS.fs.prototype.readFileSync = function(file, options) {};

/** @record */ NodeJS.glob = function() {};
/** @type {function(string):!Array<string>} */
NodeJS.glob.prototype.sync = function(pattern) {};


/** @record */ NodeJS.path = function() {};

/**
 * @param {string} path
 * @return {string}
 */
NodeJS.path.prototype.resolve = function(path) {};
