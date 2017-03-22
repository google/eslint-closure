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

http_archive(
    name = "io_bazel_rules_closure",
    sha256 = "c104d30b4aaf23d72afe327b4478d1c08cf1ff75c6db2060682bb7ad0591e19b",
    strip_prefix = "rules_closure-962d929bc769fc320dd395f54fef3e9db62c3920",
    urls = [
        "http://bazel-mirror.storage.googleapis.com/github.com/bazelbuild/rules_closure/archive/962d929bc769fc320dd395f54fef3e9db62c3920.tar.gz",  # 2016-12-28
        "https://github.com/bazelbuild/rules_closure/archive/962d929bc769fc320dd395f54fef3e9db62c3920.tar.gz",
    ],
)

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_repositories")

closure_repositories()
