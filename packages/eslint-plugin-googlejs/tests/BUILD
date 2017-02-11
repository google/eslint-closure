package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("//build_rules:mocha_closure_test.bzl", "mocha_closure_test")

mocha_closure_test(
    name = "ast-test-bin",
    srcs = ["ast-test.js"],
    entry_point = "googlejs.tests.ast",
    deps = [
        "//packages/eslint-plugin-googlejs/lib:ast",
        "//packages/eslint-plugin-googlejs/lib:test-utils",
        "//packages/eslint-plugin-googlejs/lib/externs:all-externs",
    ],
)

mocha_closure_test(
    name = "ast-matcher-test-bin",
    srcs = ["ast-matcher-test.js"],
    entry_point = "googlejs.tests.astMatcher",
    deps = [
        "//packages/eslint-plugin-googlejs/lib:ast-matcher",
        "//packages/eslint-plugin-googlejs/lib/externs:all-externs",
    ],
)

mocha_closure_test(
    name = "utils-test-bin",
    srcs = ["utils-test.js"],
    entry_point = "googlejs.tests.utils",
    deps = [
        "//packages/eslint-plugin-googlejs/lib:types",
        "//packages/eslint-plugin-googlejs/lib:utils",
        "//packages/eslint-plugin-googlejs/lib/externs:all-externs",
    ],
)

mocha_closure_test(
    name = "jsdoc-utils-test-bin",
    srcs = ["jsdoc-utils-test.js"],
    entry_point = "googlejs.tests.jsdocUtils",
    deps = [
        "//packages/eslint-plugin-googlejs/lib:jsdoc-utils",
        "//packages/eslint-plugin-googlejs/lib:test-utils",
        "//packages/eslint-plugin-googlejs/lib/externs:all-externs",
    ],
)
