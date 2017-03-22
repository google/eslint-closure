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

closure_js_binary(
    name = "plugin",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
    ],
    dependency_mode = "strict",
    entry_points = ["eslintClosure.plugin"],
    deps = [
        "//packages/eslint-plugin-closure/lib:plugin",
    ],
)

closure_js_binary(
    name = "plugin-debug",
    compilation_level = "WHITESPACE_ONLY",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
        "--rewrite_polyfills=false",
        ("--output_wrapper=" +
         "global.goog={};" +
         "(function(goog){%output%}).call(global, global.goog);"),
    ],
    dependency_mode = "strict",
    entry_points = ["eslintClosure.plugin"],
    formatting = "PRETTY_PRINT",
    deps = [
        "//packages/eslint-plugin-closure/lib:plugin",
    ],
)

closure_js_binary(
    name = "plugin-simple",
    compilation_level = "SIMPLE",
    defs = [
        "--new_type_inf",
        "--assume_function_wrapper",
        "--rewrite_polyfills=false",
    ],
    dependency_mode = "strict",
    entry_points = ["eslintClosure.plugin"],
    formatting = "PRETTY_PRINT",
    deps = [
        "//packages/eslint-plugin-closure/lib:plugin",
    ],
)

closure_js_binary(
    name = "check-types",
    defs = [
        "--new_type_inf",
        "--checks_only",
        "--assume_function_wrapper",
    ],
    dependency_mode = "strict",
    entry_points = ["eslintClosure.plugin"],
    deps = [
        "//packages/eslint-plugin-closure/lib:plugin",
    ],
)
