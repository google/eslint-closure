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
    entry_points = ["googlejs.plugin"],
    deps = [
        "//packages/eslint-plugin-googlejs/lib:plugin",
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
    entry_points = ["googlejs.plugin"],
    deps = [
        "//packages/eslint-plugin-googlejs/lib:plugin",
    ],
)
