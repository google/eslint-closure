ROOT_DIR := ../..
PLUGIN_PREFIX := packages/eslint-config-tester
BAZEL_BIN_DIR := $(ROOT_DIR)/bazel-bin/$(PLUGIN_PREFIX)
TEST_PKG := //$(PLUGIN_PREFIX)/tests
# No colors because it doesn't work on the solarized color scheme.
MOCHA := node_modules/mocha/bin/mocha --no-colors

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

develop:
	yarn link
	yarn install

clean:
	rm -rf dist/tests

test: build-tests
	$(MOCHA) --recursive ./dist/tests

test-summary: build-tests
	$(MOCHA) --recursive ./dist/tests --reporter dot

build-tests: clean dist-mkdir
	bazel build //packages/eslint-config-tester/tests/...:all
	find $(BAZEL_BIN_DIR)/tests -name "*.js" | xargs -i cp -f {} dist/tests


test-error-compare:
	bazel build $(TEST_PKG):error-compare-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/error-compare-test-bin.js dist/tests
	$(MOCHA) dist/tests/error-compare-test-bin.js

test-config-tester:
	bazel build $(TEST_PKG):config-tester-test-bin
	cp -f $(BAZEL_BIN_DIR)/tests/config-tester-test-bin.js dist/tests
	$(MOCHA) dist/tests/config-tester-test-bin.js

dist-mkdir:
	mkdir -p dist/tests
