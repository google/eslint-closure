DOCS_DIR := docs
PLUGIN_DIR := packages/eslint-plugin-googlejs
BASE_DIR := packages/eslint-config-googlejs-base
ES5_DIR := packages/eslint-config-googlejs-es5
ES6_DIR := packages/eslint-config-googlejs-es6
CONFIG_TESTER_DIR := packages/eslint-config-tester

all: compile

compile:
	$(MAKE) -C $(PLUGIN_DIR) compile
	$(MAKE) -C $(CONFIG_TESTER_DIR) compile

test:
	$(MAKE) -C $(PLUGIN_DIR) test-summary
	$(MAKE) -C $(CONFIG_TESTER_DIR) test-summary
	$(MAKE) -C $(ES5_DIR) test-summary
	$(MAKE) -C $(ES6_DIR) test-summary

site:
	$(MAKE) -C $(DOCS_DIR) site

serve: site
	$(MAKE) -C $(DOCS_DIR) serve

develop:
	$(MAKE) -C $(PLUGIN_DIR) develop
	$(MAKE) -C $(CONFIG_TESTER_DIR) develop
	$(MAKE) -C $(BASE_DIR) develop
	$(MAKE) -C $(ES5_DIR) develop
	$(MAKE) -C $(ES6_DIR) develop
