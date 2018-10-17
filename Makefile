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

DOCS_DIR := docs
PLUGIN_DIR := packages/eslint-plugin-closure
BASE_DIR := packages/eslint-config-closure-base
ES5_DIR := packages/eslint-config-closure-es5
ES6_DIR := packages/eslint-config-closure-es6
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
	yarn install
