
DIST_DIR := dist
MOCHA := node_modules/mocha/bin/mocha
all: compile

compile:
	bazel build //:plugin && cp -f bazel-bin/plugin.js bazel-bin/plugin.js.map dist

test: test-utils test-rules
test-utils: test-ast test-ast-matcher test-jsdoc-utils test-utils
test-ast: dist/tests/ast.js
test-ast-matcher: dist/tests/ast.js
test-jsdoc-utils: dist/tests/jsdoc-utils.js
test-utils: dist/tests/utils.js

test-rules: test-rules-camelcase test-rules-indent test-rules-inline-comment-spacing test-rules-jsdoc test-rules-no-undef test-rules-no-unused-expressions test-rules-no-unused-vars
test-rules-camelcase: dist/tests/rules/camelcase.js
test-rules-indent: dist/tests/rules/indent.js
test-rules-inline-comment-spacing: dist/tests/rules/inline-comment-spacing.js
test-rules-jsdoc: dist/tests/rules/jsdoc.js
test-rules-no-undef: dist/tests/rules/no-undef.js
test-rules-no-unused-expressions: dist/tests/rules/no-unused-expressions.js
test-rules-no-unused-vars: dist/tests/rules/no-unused-vars.js

dist/tests/%.js: dist-mkdir
	bazel build "//tests:$(basename $(@F))-test" && \
			cp -f bazel-bin/tests/$(basename $(@F))-test.js \
						bazel-bin/tests/$(basename $(@F))-test.js.map \
						$(DIST_DIR)/tests && \
			$(MOCHA) --no-colors dist/tests/$(basename $(@F))-test.js


dist/tests/rules/%.js: dist-mkdir
	bazel build "//tests/rules:$(basename $(@F))-test" && \
			cp -f bazel-bin/tests/rules/$(basename $(@F))-test.js \
						bazel-bin/tests/rules/$(basename $(@F))-test.js.map \
						$(DIST_DIR)/tests/rules && \
			$(MOCHA) --no-colors dist/tests/rules/$(basename $(@F))-test.js

dist-mkdir:
	mkdir -p $(DIST_DIR)/tests/rules
