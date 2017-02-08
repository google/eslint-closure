package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("//build_rules:mocha_closure_test.bzl", "mocha_closure_test")

mocha_closure_test(
    name = "ast-test-bin",
    srcs = ["ast-test.js"],
    entry_point = "googlejs.tests.ast",
    deps = [
        "//lib:ast",
        "//lib:test-utils",
        "//lib/externs:all-externs",
    ],
)

mocha_closure_test(
    name = "ast-matcher-test-bin",
    srcs = ["ast-matcher-test.js"],
    entry_point = "googlejs.tests.astMatcher",
    deps = [
        "//lib:ast-matcher",
        "//lib/externs:all-externs",
    ],
)

mocha_closure_test(
    name = "utils-test-bin",
    srcs = ["utils-test.js"],
    entry_point = "googlejs.tests.utils",
    deps = [
        "//lib:types",
        "//lib:utils",
        "//lib/externs:all-externs",
    ],
)

mocha_closure_test(
    name = "jsdoc-utils-test-bin",
    srcs = ["jsdoc-utils-test.js"],
    entry_point = "googlejs.tests.jsdocUtils",
    deps = [
        "//lib:jsdoc-utils",
        "//lib:test-utils",
        "//lib/externs:all-externs",
    ],
)
