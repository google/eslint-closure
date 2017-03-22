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

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

closure_js_library(
    name = "app-lib",
    srcs = ["js/app.js"],
    deps = [
        "//packages/eslint-plugin-closure/lib:plugin",
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "app-webpack-bundle",
    srcs = ["dist/app.min.js"],
    suppress = [
        "checkTypes",
        "checkVars",
        "lintChecks",
        "nonStandardJsDocs",
        "misplacedTypeAnnotation",
    ],
    deps = [
        "//packages/eslint-plugin-closure/lib/externs:all-externs",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "eslint-browserified",
    srcs = ["dist/eslint.js"],
    suppress = [
        "checkTypes",
        "checkVars",
        "lintChecks",
        "nonStandardJsDocs",
        "misplacedTypeAnnotation",
    ],
)

closure_js_binary(
    name = "app-check-types",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
        "--rewrite_polyfills=false",
        "--checks_only",
    ],
    dependency_mode = "strict",
    entry_points = ["eslintClosure.docs.app"],
    deps = [
        ":app-lib",
    ],
)

closure_js_binary(
    name = "app-min",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
        "--rewrite_polyfills=false",
        "--warning_level=QUIET",
    ],
    deps = [
        ":app-webpack-bundle",
        ":eslint-browserified",
    ],
)


closure_js_binary(
    name = "eslint-min",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
        "--rewrite_polyfills=false",
        "--warning_level=QUIET",
    ],
    deps = [
        ":eslint-browserified",
    ],
)