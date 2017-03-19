#!/bin/bash

DOCS_DIR=$(dirname $(dirname "$0"))
ESLINT_DIR="${DOCS_DIR}/eslint-repo"

if [[ ! -d "${ESLINT_DIR/.git}" ]]; then
    git clone https://github.com/eslint/eslint.git "${ESLINT_DIR}"
fi

pushd "${ESLINT_DIR}"
git pull origin master
npm install
npm run browserify
