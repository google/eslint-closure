BASE_DIR := ../packages/eslint-config-closure-base
ES5_DIR := ../packages/eslint-config-closure-es5
ES6_DIR := ../packages/eslint-config-closure-es6
PLUGIN_DIR := ../packages/eslint-plugin-closure
ESLINT_REPO := eslint-repo
OUTPUT_DIR := output
BAZEL_BIN := ../bazel-bin


all: site

site: webpack
	cp -f dist/app.bundle.js dist/app.min.js

webpack:
	npm run webpack

js-prod: webpack
	bazel build //docs:app-min
	cp -f $(BAZEL_BIN)/docs/app-min.js dist/app.min.js

serve:
	bundle exec jekyll serve

develop:
	yarn link eslint-plugin-closure eslint-config-closure-base eslint-config-closure-es5 eslint-config-closure-es6
	yarn install

update-eslint:
	sh bin/update-eslint.sh

copy-eslint:
	cp -f $(ESLINT_REPO)/build/eslint.js js/eslint.js
