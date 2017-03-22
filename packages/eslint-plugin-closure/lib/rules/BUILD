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

closure_js_library(
    name = "camelcase",
    srcs = ["camelcase.js"],
    deps = [
        "//packages/eslint-plugin-closure/lib:types",
        "//packages/eslint-plugin-closure/lib:utils",
    ],
)

closure_js_library(
    name = "indent",
    srcs = ["indent.js"],
    deps = [
        "//packages/eslint-plugin-closure/lib:ast",
        "//packages/eslint-plugin-closure/lib:utils",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "inline-comment-spacing",
    srcs = ["inline-comment-spacing.js"],
    deps = [
        "//packages/eslint-plugin-closure/lib:utils",
    ],
)

closure_js_library(
    name = "jsdoc",
    srcs = ["jsdoc.js"],
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        "//packages/eslint-plugin-closure/lib:jsdoc-utils",
        "//packages/eslint-plugin-closure/lib:utils",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "no-undef",
    srcs = ["no-undef.js"],
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        "//packages/eslint-plugin-closure/lib:ast",
        "//packages/eslint-plugin-closure/lib:utils",
    ],
)

closure_js_library(
    name = "no-unused-expressions",
    srcs = ["no-unused-expressions.js"],
    deps = [
        "//packages/eslint-plugin-closure/lib:ast",
        "//packages/eslint-plugin-closure/lib:jsdoc-utils",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "no-unused-vars",
    srcs = ["no-unused-vars.js"],
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        "//packages/eslint-plugin-closure/lib:ast",
        "//packages/eslint-plugin-closure/lib:utils",
    ],
)
