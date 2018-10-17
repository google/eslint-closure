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

webpack:
	npm run webpack

js-prod: webpack
	bazel build //docs:app-min
  # TODO(jschaf): Closure compilation isn't currently working with eslint.js
	cp -f $(BAZEL_BIN)/docs/app-min.js dist/app.closure.min.js
	cp -f $(BAZEL_BIN)/docs/app-min.js.map dist/app.closure.min.js.map

serve:
	$(NODE_BIN)/webpack-dev-server --port 7777

update-eslint:
	sh scripts/update-eslint.sh

copy-eslint:
	cp -f $(ESLINT_REPO)/build/eslint.js js/eslint.js

check-types:
	bazel build //docs:app-check-types
