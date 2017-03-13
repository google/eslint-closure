BASE_DIR := ../packages/eslint-config-googlejs-base
ES5_DIR := ../packages/eslint-config-googlejs-es5
ES6_DIR := ../packages/eslint-config-googlejs-es6


all: compile

compile: update-dependencies webpack

update-dependencies:
	cp -f $(BASE_DIR)/index.js js/eslint-config-googlejs-base.js
	cp -f $(ES5_DIR)/index.js js/eslint-config-googlejs-es5.js
	cp -f $(ES6_DIR)/index.js js/eslint-config-googlejs-es6.js

webpack:
	npm run webpack

site:
	bundle exec jekyll serve
