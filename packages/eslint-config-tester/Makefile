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

ROOT_DIR := ../..
PKG_PREFIX := packages/eslint-config-tester
BAZEL_BIN_DIR := $(ROOT_DIR)/bazel-bin/$(PKG_PREFIX)
TEST_PKG := $(PKG_PREFIX)/tests
# No colors because it doesn't work on the solarized color scheme.
MOCHA := node_modules/mocha/bin/mocha --no-colors

# Build a package target relative to the root dir.
#
# The first arg is the bazel build package without the leading //.  The second
# arg is the bazel build target.  For example:
# $(1): packages/eslint-plugin-closure/tests/rules
# $(2): no-undef-test-bin
define build_run_test
	bazel build //$(1):$(2)
  cp -f $(ROOT_DIR)/bazel-bin/$(1)/$(2).js dist/tests
  $(MOCHA) dist/tests/$(2).js
endef

all: compile

compile: dist-mkdir
	bazel build //packages/eslint-config-tester
	cp -f $(BAZEL_BIN_DIR)/eslint-config-tester.js \
      dist/eslint-config-tester.js

compile-simple: dist-mkdir
	bazel build //packages/eslint-config-tester:eslint-config-tester-simple
	cp -f $(BAZEL_BIN_DIR)/eslint-config-tester-simple.js \
      dist/eslint-config-tester.js

compile-debug: dist-mkdir
	bazel build //packages/eslint-config-tester:eslint-config-tester-debug
	cp -f $(BAZEL_BIN_DIR)/eslint-config-tester-debug.js \
      dist/eslint-config-tester.js

debug: build-tests
	$(MOCHA) --recursive ./dist/tests --inspect --debug-brk

clean:
	rm -rf dist/tests

test: build-tests
	$(MOCHA) --recursive ./dist/tests

test-summary: build-tests
	$(MOCHA) --recursive ./dist/tests --reporter dot

build-tests: clean dist-mkdir
	bazel build //packages/eslint-config-tester/tests/...:all
	find $(BAZEL_BIN_DIR)/tests -name "*.js" | xargs -I '{}' cp -f {} dist/tests

test-error-compare:
	$(call build_run_test,$(TEST_PKG),error-compare-test-bin)

test-config-tester:
	$(call build_run_test,$(TEST_PKG),config-tester-test-bin)

dist-mkdir:
	mkdir -p dist/tests
