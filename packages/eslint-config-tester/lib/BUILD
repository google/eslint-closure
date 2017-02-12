package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

closure_js_library(
    name = "types",
    srcs = ["types.js"],
    deps = [],
)

closure_js_library(
    name = "config-tester",
    srcs = ["config-tester.js"],
    deps = [
        ":types",
        "//packages/eslint-plugin-googlejs/lib/externs:all-externs",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_library(
    name = "error-compare",
    srcs = ["error-compare.js"],
    deps = [
        ":types",
        "//packages/eslint-plugin-googlejs/lib/externs:all-externs",
        "@io_bazel_rules_closure//closure/library",
    ],
)
