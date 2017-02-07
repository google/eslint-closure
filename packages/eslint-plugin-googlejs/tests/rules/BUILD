package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")
load("//build_rules:mocha_closure_test.bzl", "mocha_closure_test")

closure_js_library(
    name = "all-tests",
    srcs = glob(["*.js"]),
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:camelcase",
        "//lib/rules:indent",
        "//lib/rules:inline-comment-spacing",
        "//lib/rules:jsdoc",
        "//lib/rules:no-undef",
        "//lib/rules:no-unused-expressions",
        "//lib/rules:no-unused-vars",
        "@io_bazel_rules_closure//closure/library",
    ],
)

test_suite(
    name = "rules_suite",
    tests = [
        ":camelcase-test",
    ],
)

mocha_closure_test(
    name = "camelcase-test",
    srcs = ["camelcase.js"],
    entry_point = "googlejs.tests.rules.camelcase",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:camelcase",
    ],
)

mocha_closure_test(
    name = "indent-test",
    srcs = ["indent.js"],
    entry_point = "googlejs.tests.rules.indent",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:indent",
    ],
)

mocha_closure_test(
    name = "inline-comment-spacing-test",
    srcs = ["inline-comment-spacing.js"],
    entry_point = "googlejs.tests.rules.inlineCommentSpacing",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:inline-comment-spacing",
    ],
)

mocha_closure_test(
    name = "jsdoc-test",
    srcs = ["jsdoc.js"],
    entry_point = "googlejs.tests.rules.jsdoc",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:jsdoc",
    ],
)

mocha_closure_test(
    name = "no-undef-test",
    srcs = ["no-undef.js"],
    entry_point = "googlejs.tests.rules.noUndef",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:no-undef",
    ],
)

mocha_closure_test(
    name = "no-unused-expressions-test",
    srcs = ["no-unused-expressions.js"],
    entry_point = "googlejs.tests.rules.noUnusedExpressions",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:no-unused-expressions",
    ],
)

mocha_closure_test(
    name = "no-unused-vars-test",
    srcs = ["no-unused-vars.js"],
    entry_point = "googlejs.tests.rules.noUnusedVars",
    deps = [
        "//lib/externs:all-externs",
        "//lib/rules:no-unused-vars",
    ],
)
