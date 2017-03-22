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
load("//build_rules:mocha_closure_test.bzl", "mocha_closure_test")

mocha_closure_test(
    name = "camelcase-test-bin",
    srcs = ["camelcase-test.js"],
    entry_point = "eslintClosure.tests.rules.camelcase",
    deps = [
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "//packages/eslint-plugin-closure/lib/rules:camelcase",
    ],
)

mocha_closure_test(
    name = "indent-test-bin",
    srcs = ["indent-test.js"],
    entry_point = "eslintClosure.tests.rules.indent",
    deps = [
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "//packages/eslint-plugin-closure/lib/rules:indent",
    ],
)

mocha_closure_test(
    name = "inline-comment-spacing-test-bin",
    srcs = ["inline-comment-spacing-test.js"],
    entry_point = "eslintClosure.tests.rules.inlineCommentSpacing",
    deps = [
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "//packages/eslint-plugin-closure/lib/rules:inline-comment-spacing",
    ],
)

mocha_closure_test(
    name = "jsdoc-test-bin",
    srcs = ["jsdoc-test.js"],
    entry_point = "eslintClosure.tests.rules.jsdoc",
    deps = [
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "//packages/eslint-plugin-closure/lib/rules:jsdoc",
    ],
)

mocha_closure_test(
    name = "no-undef-test-bin",
    srcs = ["no-undef-test.js"],
    entry_point = "eslintClosure.tests.rules.noUndef",
    deps = [
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "//packages/eslint-plugin-closure/lib/rules:no-undef",
    ],
)

mocha_closure_test(
    name = "no-unused-expressions-test-bin",
    srcs = ["no-unused-expressions-test.js"],
    entry_point = "eslintClosure.tests.rules.noUnusedExpressions",
    deps = [
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "//packages/eslint-plugin-closure/lib/rules:no-unused-expressions",
    ],
)

mocha_closure_test(
    name = "no-unused-vars-test-bin",
    srcs = ["no-unused-vars-test.js"],
    entry_point = "eslintClosure.tests.rules.noUnusedVars",
    deps = [
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "//packages/eslint-plugin-closure/lib/rules:no-unused-vars",
    ],
)
