BASE_DIR := ../packages/eslint-config-closure-base
ES5_DIR := ../packages/eslint-config-closure-es5
ES6_DIR := ../packages/eslint-config-closure-es6
PLUGIN_DIR := ../packages/eslint-plugin-closure
ESLINT_REPO := eslint-repo
OUTPUT_DIR := output
BAZEL_BIN := ../bazel-bin
NODE_BIN := ./node_modules/.bin


all: site

site: webpack
	cp -f dist/app.bundle.js dist/app.min.js

webpack:
	npm run webpack

js-prod: webpack
	bazel build //docs:app-min
	cp -f $(BAZEL_BIN)/docs/app-min.js dist/app.min.js
	cp -f $(BAZEL_BIN)/docs/app-min.js.map dist/app.min.js.map

serve:
	$(NODE_BIN)/webpack-dev-server --port 7777

develop:
	yarn link eslint-plugin-closure eslint-config-closure-base eslint-config-closure-es5 eslint-config-closure-es6
	yarn install

update-eslint:
	sh scripts/update-eslint.sh

copy-eslint:
	cp -f $(ESLINT_REPO)/build/eslint.js js/eslint.js

check-types:
	bazel build //docs:app-check-types
