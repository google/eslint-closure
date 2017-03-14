BASE_DIR := ../packages/eslint-config-googlejs-base
ES5_DIR := ../packages/eslint-config-googlejs-es5
ES6_DIR := ../packages/eslint-config-googlejs-es6
PLUGIN_DIR := ../packages/eslint-plugin-googlejs


all: compile

site: update-dependencies webpack

update-dependencies:
	cp -f $(BASE_DIR)/index.js js/eslint-config-googlejs-base.js
	cp -f $(ES5_DIR)/index.js js/eslint-config-googlejs-es5.js
	cp -f $(ES6_DIR)/index.js js/eslint-config-googlejs-es6.js
	cp -f $(PLUGIN_DIR)/dist/googlejs-eslint-plugin.js js/googlejs-eslint-plugin.js

webpack:
	npm run webpack

serve:
	bundle exec jekyll serve
