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
    srcs = ["dist/app.bundle.js"],
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
