package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary")
load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library")

package_group(
    name = "eslint-plugin",
    packages = ["//..."],
)

closure_js_binary(
    name = "plugin",
    defs = [
        "--new_type_inf",
    ],
    dependency_mode = "strict",
    entry_points = ["googlejs.config"],
    deps = [
        "//lib:config",
    ],
)
