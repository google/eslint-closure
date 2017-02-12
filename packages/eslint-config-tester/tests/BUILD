package(default_visibility = ["//visibility:public"])

load("//build_rules:mocha_closure_test.bzl", "mocha_closure_test")

mocha_closure_test(
    name = "error-compare-test-bin",
    srcs = ["error-compare-test.js"],
    entry_point = "googlejs.configTester.tests.errorCompareTest",
    deps = [
        "//packages/eslint-config-tester/lib:error-compare",
        "//packages/eslint-config-tester/lib:types",
        "//packages/eslint-plugin-googlejs/lib/externs:all-externs",
    ],
)
