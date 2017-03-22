# Copyright 2017 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("//build_rules:mocha_closure_test.bzl", "mocha_closure_test")

mocha_closure_test(
    name = "ast-test-bin",
    srcs = ["ast-test.js"],
    entry_point = "eslintClosure.tests.ast",
    deps = [
        "//packages/eslint-plugin-closure/lib:ast",
        "//packages/eslint-plugin-closure/lib:test-utils",
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
    ],
)

mocha_closure_test(
    name = "ast-matcher-test-bin",
    srcs = ["ast-matcher-test.js"],
    entry_point = "eslintClosure.tests.astMatcher",
    deps = [
        "//packages/eslint-plugin-closure/lib:ast-matcher",
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
    ],
)

mocha_closure_test(
    name = "utils-test-bin",
    srcs = ["utils-test.js"],
    entry_point = "eslintClosure.tests.utils",
    deps = [
        "//packages/eslint-plugin-closure/lib:types",
        "//packages/eslint-plugin-closure/lib:utils",
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
    ],
)

mocha_closure_test(
    name = "jsdoc-utils-test-bin",
    srcs = ["jsdoc-utils-test.js"],
    entry_point = "eslintClosure.tests.jsdocUtils",
    deps = [
        "//packages/eslint-plugin-closure/lib:jsdoc-utils",
        "//packages/eslint-plugin-closure/lib:test-utils",
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
    ],
)
