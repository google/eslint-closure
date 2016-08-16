# eslint-plugin-google

Linting Rules for the Google Style Guide

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-google`:

```
$ npm install eslint-plugin-google --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-google` globally.

## Usage

Add `google` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "google"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "google/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





