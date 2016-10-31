/**
 * @fileoverview Custom ESLint configuration to adhere to the Google style guide
 * at https://google.github.io/styleguide/javascriptguide.xml.
 *
 * All ESLint rules are listed below.  ESLint recommended rules have an #eslint
 * tag.  Google JS style guide required rules have a #google tag.  Internal
 * Google guidelines have a #google3 tag.
 *
 * Short link to the Google JS Style Guide: https://git.io/vured
 * Short link to the Google C++ Style Guide: https://git.io/v6Mp3
 */


// Named constants for the numbers eslint uses to indicate lint severity.
const OFF = 0;
const WARNING = 1;
const ERROR = 2;


// Private Google JSDoc tags.  #google3
const GOOGLE_CUSTOM_JSDOC_TAGS = [
  'abstract',
  'copyright',
  'disposes',
  'externs',
  // Mark function as returning an ID.  The type can be {consistent}, {unique},
  // {stable}, {xid} or empty.
  'idGenerator',
  'jaggerInject',
  'jaggerModule',
  'jaggerProvide',
  'jaggerProvidePromise',
  'meaning',  // Localization helper.
  'modifies',  // For externs.
  'ngInject',
  'nocollapse',
  'nocompile',
  'nosideeffects',
  'package',  // Indicates package-private.,
  'polymerBehavior',
  'record',
  'struct',
  'template',  // Generics.
  'unrestricted',  // Mark class that's not a @struct or @dict.,
  'visibility',  // Control blaze build visibility.
  'wizaction',
];


// Pubically released closure JSDoc tags from
// https://developers.google.com/closure/compiler/docs/js-for-compiler.  #google
const CLOSURE_JSDOC_TAGS = [
  'abstract',
  'const',
  'constructor',
  'define',
  'deprecated',
  'dict',
  'enum',
  'export',
  'extends',
  'final',
  'implements',
  'implicitCast',
  'inheritDoc',
  'interface',
  'lends',
  'license',
  'preserve',
  'nocollapse',
  'nosideeffects',
  'override',
  'package',
  'param',
  'private',
  'protected',
  'record',
  'return',
  'struct',
  'template',
  'this',
  'throws',
  'type',
  'typedef',
  'unrestricted',
];


// Possible Errors
// These rules relate to possible syntax or logic errors in JavaScript code.
const POSSIBLE_ERROR_RULES = {
  // Disallow assignment operators in conditional expressions.  #eslint
  'no-cond-assign': ERROR,

  // Disallow the use of console.  #eslint
  'no-console': ERROR,

  // Disallow constant expressions in conditions.  #eslint
  'no-constant-condition': ERROR,

  // Disallow control characters in regular expressions.  #eslint
  'no-control-regex': ERROR,

  // Disallow the use of debugger.  #eslint
  'no-debugger': ERROR,

  // Disallow duplicate arguments in function definitions.  #eslint
  'no-dupe-args': ERROR,

  // Disallow duplicate keys in object literals.  #eslint
  'no-dupe-keys': ERROR,

  // Disallow duplicate case labels.  #eslint
  'no-duplicate-case': ERROR,

  // Disallow empty character classes in regular expressions.  #eslint
  'no-empty-character-class': ERROR,

  // Disallow empty block statements.  #eslint
  // Google ES6 Section 5.8.2.1
  'no-empty': ERROR,

  // Disallow reassigning exceptions in catch clauses.  #eslint
  'no-ex-assign': ERROR,

  // Disallow unnecessary boolean casts.  #eslint
  'no-extra-boolean-cast': ERROR,

  // Disallow unnecessary parentheses.
  'no-extra-parens': OFF,

  // Disallow unnecessary semicolons.  #eslint
  'no-extra-semi': ERROR,

  // Disallow reassigning function declarations.  #eslint
  'no-func-assign': ERROR,

  // Disallow function or var declarations in nested blocks.  #eslint
  // Google ES5 https://git.io/vured#Nested_functions.
  'no-inner-declarations': ERROR,

  // Disallow invalid regular expression strings in RegExp constructors.
  // #eslint
  'no-invalid-regexp': ERROR,

  // Disallow irregular whitespace outside of strings and comments.  #eslint
  'no-irregular-whitespace': ERROR,

  // Disallow calling global object properties as functions.  #eslint
  'no-obj-calls': ERROR,

  // Disallow calling some Object.prototype methods directly on objects.
  'no-prototype-builtins': OFF,

  // Disallow multiple spaces in regular expressions.  #eslint
  'no-regex-spaces': ERROR,

  // Disallow sparse arrays.  #eslint
  'no-sparse-arrays': ERROR,

  // Disallow template literal placeholder syntax in regular strings.
  'no-template-curly-in-string': OFF,

  // Disallow confusing multiline expressions.  #eslint
  'no-unexpected-multiline': ERROR,

  // Disallow unreachable code after return, throw, continue, and break
  // statements.  #eslint
  'no-unreachable': ERROR,

  // Disallow control flow statements in finally blocks.  #eslint
  'no-unsafe-finally': ERROR,

  // Disallow negating the left operand of relational operators.
  'no-unsafe-negation': ERROR,

  // Require calls to isNaN() when checking for NaN.  #eslint
  'use-isnan': ERROR,

  // Enforce valid JSDoc comments.  Use the jsdoc plugin instead.
  'valid-jsdoc': OFF,

  // Enforce comparing typeof expressions against valid strings.  #eslint
  'valid-typeof': ERROR,
};


// Best Practices
// These rules relate to better ways of doing things to help you avoid problems.
const BEST_PRACTICE_RULES = {
  // Enforce getter and setter pairs in objects.
  'accessor-pairs': OFF,

  // Enforce return statements in callbacks of array methods.
  'array-callback-return': OFF,

  // Enforce the use of variables within the scope they are defined.
  'block-scoped-var': OFF,

  // Enforce a maximum cyclomatic complexity allowed in a program.
  'complexity': OFF,

  // Require return statements to either always or never specify values.
  'consistent-return': ERROR,

  // Enforce consistent brace style for all control statements.

  // TODO(jschaf): This doesn't quite match Google style guide because it allows
  // a single statement on the line after a block statement:
  //
  // if (foo)
  //   bar();  // Bad, google style only allows it on the same line like:
  //
  // if (foo) bar(); // Good.
  'curly': [ERROR, 'multi-line'],

  // Require default cases in switch statements.
  // Google ES6 Section 5.8.3.2
  'default-case': ERROR,

  // Enforce consistent newlines before and after dots.
  // Google ES5 https://git.io/vured#Code_formatting
  // Google ES6 Section 4.5.1
  'dot-location': [ERROR, 'property'],

  // Enforce dot notation whenever possible.
  'dot-notation': OFF,

  // Require the use of === and !==.
  // The style guide says nothing about the great == vs === debate.
  'eqeqeq': OFF,

  // Require for-in loops to include an if statement.
  // Google ES6 Section 5.8.1
  'guard-for-in': ERROR,

  // Disallow the use of alert, confirm, and prompt.
  'no-alert': OFF,

  // Disallow the use of arguments.caller or arguments.callee.
  'no-caller': OFF,

  // Disallow lexical declarations in case clauses.  #eslint
  'no-case-declarations': ERROR,

  // Disallow division operators explicitly at the beginning of regular
  // expressions.
  'no-div-regex': OFF,

  // Disallow else blocks after return statements in if statements.
  'no-else-return': OFF,

  // Disallow empty functions.
  'no-empty-function': OFF,

  // Disallow empty destructuring patterns.  #eslint
  'no-empty-pattern': ERROR,

  // Disallow null comparisons without type-checking operators.
  'no-eq-null': OFF,

  // Disallow the use of eval().
  // Google ES6 Section 5.10.2
  'no-eval': ERROR,

  // Disallow extending native types.
  // Google ES5  https://git.io/vured#Modifying_prototypes_of_builtin_objects
  // Google ES6 Section 5.10.6
  'no-extend-native': ERROR,

  // Disallow unnecessary calls to .bind().
  // Google ES6 Section 5.5.3.  Loosely hinted at, but not specifically
  // required.
  'no-extra-bind': WARNING,

  // Disallow unnecessary labels.
  'no-extra-label': OFF,

  // Disallow fallthrough of case statements.  #eslint
  // Google ES6 Section 5.8.3.1
  'no-fallthrough': [ERROR, {
    commentPattern: '[fF]alls?\\s?[tT]hrough',
  }],

  // Disallow leading or trailing decimal points in numeric literals.
  'no-floating-decimal': OFF,

  // Disallow assignments to native objects or read-only global variables.
  'no-global-assign': OFF,

  // Disallow shorthand type conversions.
  'no-implicit-coercion': OFF,

  // Disallow var and named function declarations in the global scope.
  'no-implicit-globals': OFF,

  // Disallow the use of eval()-like methods.
  'no-implied-eval': OFF,

  // Disallow this keywords outside of classes or class-like objects.
  'no-invalid-this': OFF,

  // Disallow the use of the __iterator__ property.
  'no-iterator': OFF,

  // Disallow labeled statements.
  'no-labels': OFF,

  // Disallow unnecessary nested blocks.
  'no-lone-blocks': OFF,

  // Disallow function declarations and expressions inside loop statements.
  'no-loop-func': OFF,

  // Disallow magic numbers.
  'no-magic-numbers': OFF,

  // Disallow multiple spaces.
  // Google ES6 Section 4.6.2
  'no-multi-spaces': ERROR,

  // Disallow multiline strings.
  // Google ES5 https://git.io/vured#Multiline_string_literals.
  'no-multi-str': ERROR,

  // Disallow new operators with the Function object.
  // Google ES6 Section 5.10.2
  'no-new-func': ERROR,

  // Disallow new operators with the String, Number, and Boolean objects.
  // Google ES5 https://git.io/vured#Wrapper_objects_for_primitive_types.
  // Google ES6 Section 5.10.5
  'no-new-wrappers': ERROR,

  // Disallow new operators outside of assignments or comparisons.
  'no-new': OFF,

  // Disallow octal escape sequences in string literals.
  'no-octal-escape': OFF,

  // Disallow octal literals.  #eslint
  // Google ES6 Section 5.7
  'no-octal': ERROR,

  // Disallow reassigning function parameters.
  'no-param-reassign': OFF,

  // Disallow the use of the __proto__ property.
  'no-proto': OFF,

  // Disallow var redeclaration.  #eslint
  'no-redeclare': ERROR,

  // Disallow assignment operators in return statements.
  'no-return-assign': OFF,

  // Disallow javascript: urls.
  'no-script-url': OFF,

  // Disallow assignments where both sides are exactly the same.  #eslint
  'no-self-assign': ERROR,

  // Disallow comparisons where both sides are exactly the same.
  'no-self-compare': OFF,

  // Disallow comma operators.
  'no-sequences': OFF,

  // Disallow throwing literals as exceptions.
  'no-throw-literal': OFF,

  // Disallow unmodified loop conditions.
  'no-unmodified-loop-condition': OFF,

  // Disallow unused expressions.
  'no-unused-expressions': OFF,

  // Disallow unused labels.  #eslint
  'no-unused-labels': ERROR,

  // Disallow unnecessary calls to .call() and .apply().
  'no-useless-call': OFF,

  // Disallow unnecessary concatenation of literals or template literals.
  'no-useless-concat': OFF,

  // Disallow unnecessary escape characters.
  'no-useless-escape': OFF,

  // Disallow void operators.
  'no-void': OFF,

  // Disallow specified warning terms in comments.
  'no-warning-comments': OFF,

  // Disallow with statements.
  // Google ES6 Section 5.10.1
  'no-with': ERROR,

  // Enforce the consistent use of the radix argument when using parseInt().
  'radix': OFF,

  // Require var declarations be placed at the top of their containing scope.
  'vars-on-top': OFF,

  // Require parentheses around immediate function invocations.
  'wrap-iife': OFF,

  // Require or disallow "Yoda" conditions.
  'yoda': OFF,
};


// Strict Mode
// These rules relate to strict mode directives.
const STRICT_MODE_RULES = {
  // Require or disallow strict mode directives.  The style guide does not
  // mandate the use of 'use strict'.
  strict: OFF,
};


// Variables
// These rules relate to variable declarations.
const VARIABLE_DECLARATION_RULES = {
  // Require or disallow initialization in var declarations.
  'init-declarations': OFF,

  // Disallow catch clause parameters from shadowing variables in the outer
  // scope.
  'no-catch-shadow': OFF,

  // Disallow deleting variables.  #eslint
  'no-delete-var': ERROR,

  // Disallow labels that share a name with a variable.
  'no-label-var': OFF,

  // Disallow specified global variables.
  'no-restricted-globals': OFF,

  // Disallow identifiers from shadowing restricted names.
  'no-shadow-restricted-names': OFF,

  // Disallow var declarations from shadowing variables in the outer scope.
  'no-shadow': OFF,

  // Disallow initializing variables to undefined.
  'no-undef-init': OFF,

  // Disallow the use of undeclared variables unless mentioned in /*global */
  // comments.  #eslint
  // Disabled for googlejs rule.
  // 'no-undef': ERROR,

  // Disallow the use of undefined as an identifier.
  'no-undefined': OFF,

  // Disallow unused variables.  #eslint
  'no-unused-vars': WARNING,

  // Disallow the use of variables before they are defined.
  'no-use-before-define': OFF,
};


// Node.js and CommonJS
// These rules relate to code running in Node.js, or in browsers with CommonJS.
const NODEJS_RULES = {
  // Require return statements after callbacks.
  'callback-return': OFF,

  // Require require() calls to be placed at top-level module scope.
  'global-require': OFF,

  // Require error handling in callbacks.
  'handle-callback-err': OFF,

  // Disallow require calls to be mixed with regular var declarations.
  'no-mixed-requires': OFF,

  // Disallow new operators with calls to require.
  'no-new-require': OFF,

  // Disallow string concatenation with __dirname and __filename.
  'no-path-concat': OFF,

  // Disallow the use of process.env.
  'no-process-env': OFF,

  // Disallow the use of process.exit().
  'no-process-exit': OFF,

  // Disallow specified modules when loaded by require.
  'no-restricted-modules': OFF,

  // Disallow synchronous methods.
  'no-sync': OFF,
};


// Stylistic Issues
// These rules relate to style guidelines, and are therefore quite subjective.
const STYLISTIC_RULES = {
  // Enforce consistent spacing inside array brackets.
  // Google ES5 https://git.io/vured#Code_formatting
  'array-bracket-spacing': [ERROR, 'never'],

  // Enforce consistent spacing inside single-line blocks.
  'block-spacing': OFF,

  // Enforce consistent brace style for blocks.
  // Google ES5 https://git.io/vured#Code_formatting
  // Google ES6 Section 4.1.2
  'brace-style': [ERROR, '1tbs'],

  // Enforce camelcase naming convention.
  // Google plugin has more applicable rules.
  'camelcase': OFF,

  // Require or disallow trailing commas.
  'comma-dangle': OFF,

  // Enforce consistent spacing before and after commas.
  // Google ES6 Section 4.6.2
  'comma-spacing': ERROR,

  // Enforce consistent comma style.
  // Google ES6 Section 4.5.1
  'comma-style': [ERROR, 'last'],

  // Enforce consistent spacing inside computed property brackets.
  'computed-property-spacing': OFF,

  // Enforce consistent naming when capturing the current execution context.
  'consistent-this': OFF,

  // Enforce at least one newline at the end of files.
  'eol-last': [ERROR, 'unix'],

  // Require or disallow spacing between function identifiers and their
  // invocations.
  // Google ES6 Section 4.6.2
  'func-call-spacing': [ERROR, 'never'],

  // Require or disallow named function expressions.
  'func-names': OFF,

  // Enforce the consistent use of either function declarations or expressions.
  'func-style': OFF,

  // Disallow specified identifiers.
  'id-blacklist': OFF,

  // Enforce minimum and maximum identifier lengths.
  'id-length': OFF,

  // Require identifiers to match a specified regular expression.
  'id-match': OFF,

  // Enforce consistent indentation.
  // Disabled because the googlejs/indent supports goog.scope.
  'indent': OFF,

  // Enforce the consistent use of either double or single quotes in JSX
  // attributes.
  'jsx-quotes': OFF,

  // Enforce consistent spacing between keys and values in object literal
  // properties.
  // Google ES6 Section 4.6.2
  'key-spacing': [WARNING, {
    beforeColon: false,
    afterColon: true,
    mode: 'strict', // Enforces exactly 1 space.
  }],

  // Enforce consistent spacing before and after keywords.
  // Google ES6 Section 4.6.2
  'keyword-spacing': ERROR,

  // Enforce consistent linebreak style.
  'linebreak-style': OFF,

  // Require empty lines around comments.
  'lines-around-comment': OFF,

  // Enforce a maximum depth that blocks can be nested.
  'max-depth': OFF,

  // Enforce a maximum line length.
  // Google ES6 Section 4.4, implied in ES5 guide.
  'max-len': [ERROR, {
    code: 80,
    comments: 80,
    ignorePattern: '(goog\\.(require|module|provide)|\\brequire)\\(',
    ignoreComments: false,
    ignoreUrls: true,
  }],

  // Enforce a maximum number of lines per file.
  'max-lines': OFF,

  // Enforce a maximum depth that callbacks can be nested.
  'max-nested-callbacks': OFF,

  // Enforce a maximum number of parameters in function definitions.
  'max-params': OFF,

  // Enforce a maximum number of statements allowed per line.
  // Google ES6 Section 4.3.1
  'max-statements-per-line': [ERROR, {max: 1}],

  // Enforce a maximum number of statements allowed in function blocks.
  'max-statements': OFF,

  // Enforce newlines between operands of ternary expressions.
  'multiline-ternary': OFF,

  // Require constructor function names to begin with a capital letter.
  'new-cap': OFF,

  // Require parentheses when invoking a constructor with no arguments.
  'new-parens': ERROR,

  // Require or disallow an empty line after var declarations.
  'newline-after-var': OFF,

  // Require an empty line before return statements.
  'newline-before-return': OFF,

  // Require a newline after each call in a method chain.
  'newline-per-chained-call': OFF,

  // Disallow Array constructors.
  // Google ES5 https://git.io/vured#Array_and_Object_literals
  // Google ES6 Section 5.2.2
  'no-array-constructor': ERROR,

  // Disallow bitwise operators.
  'no-bitwise': OFF,

  // Disallow continue statements.
  'no-continue': OFF,

  // Disallow inline comments after code.
  'no-inline-comments': OFF,

  // Disallow if statements as the only statement in else blocks.
  'no-lonely-if': OFF,

  // Disallow mixed binary operators.
  'no-mixed-operators': OFF,

  // Disallow mixed spaces and tabs for indentation.  #eslint
  'no-mixed-spaces-and-tabs': ERROR,

  // Disallow multiple empty lines.
  // Google ES6 Section 4.6.1. Allowed.
  'no-multiple-empty-lines': OFF,

  // Disallow negated conditions.
  'no-negated-condition': OFF,

  // Disallow nested ternary expressions.
  'no-nested-ternary': OFF,

  // Disallow Object constructors.
  // Google ES6 Section 5.3.2
  'no-new-object': [ERROR],

  // Disallow the unary operators ++ and --.
  'no-plusplus': OFF,

  // Disallow specified syntax.
  'no-restricted-syntax': OFF,

  // Disallow tabs in file.
  'no-tabs': OFF,

  // Disallow ternary operators.
  'no-ternary': OFF,

  // Disallow trailing whitespace at the end of lines.
  // Google ES6 Section 4.6.2
  'no-trailing-spaces': ERROR,

  // Disallow dangling underscores in identifiers.
  'no-underscore-dangle': OFF,

  // Disallow ternary operators when simpler alternatives exist.
  'no-unneeded-ternary': OFF,

  // Disallow whitespace before properties.
  // Google ES6 Section 4.3.2
  'no-whitespace-before-property': ERROR,

  // Enforce consistent line breaks inside braces.
  'object-curly-newline': OFF,

  // Enforce consistent spacing inside braces.
  // Google ES5 https://git.io/vured#Code_formatting
  // Google ES6 Section 4.2.2
  'object-curly-spacing': [ERROR, 'never'],

  // Enforce placing object properties on separate lines.
  'object-property-newline': OFF,

  // Require or disallow newlines around var declarations.
  'one-var-declaration-per-line': OFF,

  // Enforce variables to be declared either together or separately in
  // functions.
  // Google ES5 assumed to follow ES6
  // Google ES6 Section 5.1.2
  'one-var': [ERROR, {
    const: 'never',
    var: 'never',
    let: 'never',
  }],

  // Require or disallow assignment operator shorthand where possible.
  'operator-assignment': OFF,

  // Enforce consistent linebreak style for operators.
  // Google ES6 Section 4.5.1
  'operator-linebreak': [ERROR, 'after'],

  // Require or disallow padding within blocks.
  'padded-blocks': OFF,

  // Require quotes around object literal property names.
  // Google ES6 Section 5.3.3
  'quote-props': [WARNING, 'consistent-as-needed'],

  // Enforce the consistent use of either backticks, double, or single quotes.
  // Google ES5 https://git.io/vured#Strings
  // Google ES6 Section 5.6.1, 5.6.2
  'quotes': [ERROR, 'single', {
    avoidEscape: true,
    allowTemplateLiterals: true,
  }],

  // Require JSDoc comments.
  'require-jsdoc': OFF,

  // Enforce consistent spacing before and after semicolons.
  'semi-spacing': ERROR,

  // Require or disallow semicolons instead of ASI.
  // Google ES5 https://git.io/vured#Strings#Semicolons
  // Google ES6 Section 4.3.2
  'semi': [ERROR, 'always'],

  // Requires object keys to be sorted.
  'sort-keys': OFF,

  // Require variables within the same declaration block to be sorted.
  'sort-vars': OFF,

  // Enforce consistent spacing before blocks.
  // Google ES6 Section 4.6.2
  'space-before-blocks': [ERROR, 'always'],

  // Enforce consistent spacing before function definition opening parenthesis.
  // Google ES6 Section 4.6.2
  'space-before-function-paren': [ERROR, 'never'],

  // Enforce consistent spacing inside parentheses.
  // Google ES6 Section 4.6.2
  'space-in-parens': [ERROR, 'never'],

  // Require spacing around operators.
  // Google ES6 Section 5.5.5.1
  'space-infix-ops': [ERROR, {int32Hint: true}],

  // Enforce consistent spacing before or after unary operators.
  // Google ES6 Section 4.6.2
  'space-unary-ops': [ERROR, {
    words: true,
    nonwords: false,
  }],

  // Enforce consistent spacing after the // or /* in a comment.
  // Google ES6 Section 4.3.2
  'spaced-comment': [ERROR, 'always', {
    block: {
      balanced: true,
    },
  }],

  // Require or disallow Unicode byte order mark (BOM).
  'unicode-bom': OFF,

  // Require parenthesis around regex literals.
  'wrap-regex': OFF,
};


// ECMAScript 6
// These rules relate to ES6, also known as ES2015.
//
// We apply ES6 rules to the base config to allow code bases to slowly migrate
// to ES6.  The only rules specified here are those that are legal in both the
// ES5 and ES6 style guides.
const ES6_RULES = {
  // Require braces around arrow function bodies.
  'arrow-body-style': OFF,

  // Require parentheses around arrow function arguments.
  'arrow-parens': OFF,

  // Enforce consistent spacing before and after the arrow in arrow functions.
  // Google ES6 Section ?
  'arrow-spacing': [WARNING, {
    before: true,
    after: true,
  }],

  // Require super() calls in constructors.  #eslint
  // Google ES6 Section 5.4.1
  'constructor-super': ERROR,

  // Enforce consistent spacing around * operators in generator functions.
  // Google ES6 Section 5.5.4
  'generator-star-spacing': [WARNING, 'after'],

  // Disallow reassigning class members.  #eslint
  'no-class-assign': ERROR,

  // Disallow arrow functions where they could be confused with comparisons.
  'no-confusing-arrow': OFF,

  // Disallow reassigning const variables.  #eslint
  'no-const-assign': ERROR,

  // Disallow duplicate class members.  #eslint
  'no-dupe-class-members': ERROR,

  // Disallow duplicate module imports.
  'no-duplicate-imports': OFF,

  // Disallow new operators with the Symbol object.  #eslint
  'no-new-symbol': ERROR,

  // Disallow specified modules when loaded by import.
  'no-restricted-imports': OFF,

  // Disallow this/super before calling super() in constructors.  #eslint
  'no-this-before-super': ERROR,

  // Disallow unnecessary computed property keys in object literals.
  // Google ES6 Section 5.3.4
  'no-useless-computed-key': ERROR,

  // Disallow unnecessary constructors.
  'no-useless-constructor': OFF,

  // Disallow renaming import, export, and destructured assignments to the same
  // name.
  'no-useless-rename': OFF,

  // Require let or const instead of var.
  'no-var': OFF,

  // Require or disallow method and property shorthand syntax for object
  // literals.
  'object-shorthand': OFF,

  // Require arrow functions as callbacks.
  'prefer-arrow-callback': OFF,

  // Require const declarations for variables that are never reassigned after
  // declared.
  'prefer-const': OFF,

  // Require Reflect methods where applicable.
  'prefer-reflect': OFF,

  // Require rest parameters instead of arguments.
  'prefer-rest-params': OFF,

  // Require spread operators instead of .apply().
  // Google ES6 Section 5.5.8
  'prefer-spread': WARNING,

  // Require template literals instead of string concatenation.
  'prefer-template': OFF,

  // Require generator functions to contain yield.  #eslint
  'require-yield': ERROR,

  // Enforce spacing between rest and spread operators and their expressions.
  // Google ES6 Section 5.2.5
  'rest-spread-spacing': [ERROR, 'never'],

  // Enforce sorted import declarations within modules.
  'sort-imports': OFF,

  // Require or disallow spacing around embedded expressions of template
  // strings.
  'template-curly-spacing': OFF,

  // Require or disallow spacing around the * in yield* expressions.
  // Google ES6 Section 5.5.4
  'yield-star-spacing': [WARNING, 'after'],
};


// Google Plugin Rules
// These rules are specific to Google code.  See
// https://github.com/jschaf/googlejs/packages/eslint-plugin-googlejs
const GOOGLE_PLUGIN_RULES = {
  'googlejs/indent': [WARNING, 2, {
    // Google ES6 Section 4.2.5
    SwitchCase: 1,
    // Google ES6 Section 4.5.1
    MemberExpression: 2,
    // Google ES5: Aliasing with goog.scope
    outerIIFEBody: 0,
  }],
  'googlejs/jsdoc': [WARNING, {
    prefer: {
      returns: 'return',
      arg: 'param',
      argument: 'param',
    },
    preferType: {
      String: 'string',
      Boolean: 'boolean',
      Number: 'number',
      Function: 'function',

    },
    requireReturn: false,
    requireReturnType: false,
    matchDescription: undefined,
    requireParamDescription: false,
    requireReturnDescription: false,
  }],
  'googlejs/no-undef': ERROR,
};


// JSDoc Plugin Rules
// https://github.com/gajus/eslint-plugin-jsdoc
const JSDOC_PLUGIN_RULES = {
  // Ensures that parameter names in JSDoc match those in the function
  // declaration.
  'jsdoc/check-param-names': ERROR,

  // Reports invalid block tag names.
  // Disabled because it doesn't support custom tags.
  'jsdoc/check-tag-names': OFF,

  // Disallows object wrapper types.
  'jsdoc/check-types': ERROR,

  // Enforces a consistent padding of the block description.  Not required by
  // the style guide.
  'jsdoc/newline-after-description': OFF,

  // Requires that block description and tag description are written in complete
  // sentences.
  // TODO(jschaf): too many spurious warnings.  It doesn't detect HTML tags.
  'jsdoc/require-description-complete-sentence': OFF,

  // Requires a hyphen before the @param description.  This doesn't match Google
  // style.
  'jsdoc/require-hyphen-before-param-description': OFF,

  // Requires that all function parameters are documented.
  'jsdoc/require-param': ERROR,

  // Requires that @param tag has description value.
  // Google ES6 Section 7.8 - descriptions may be omitted.
  'jsdoc/require-param-description': OFF,

  // Requires that @param tag has type value.
  // Google ES6 Section 7.8 - types must be included.
  'jsdoc/require-param-type': ERROR,

  // Requires that @returns tag has description value.
  // Google ES6 Section 7.8 - descriptions may be omitted.
  'jsdoc/require-returns-description': OFF,

  // Requires that @returns tag has type value.
  'jsdoc/require-returns-type': ERROR,
};


// ESLint configuration object.  Options are described at
// http://eslint.org/docs/user-guide/configuring.
const ESLINT_CONFIG = {

  parserOptions: {
    ecmaVersion: 5,
    sourceType: 'script',
  },

  parser: 'espree',

  // An environment defines global variables that are predefined.
  env: {
    browser: true,
  },

  globals: {
    goog: true,
  },

  plugins: [
    // https://github.com/gajus/eslint-plugin-jsdoc
    'jsdoc',
    // https://github.com/jschaf/eslint-config-google
    'googlejs',
  ],

  // The list of rules and options are available at
  // http://eslint.org/docs/rules/.
  rules: Object.assign(
    {},

    // ESLint built-in rules.
    POSSIBLE_ERROR_RULES,
    BEST_PRACTICE_RULES,
    STRICT_MODE_RULES,
    VARIABLE_DECLARATION_RULES,
    NODEJS_RULES,
    STYLISTIC_RULES,
    ES6_RULES,

    // Custom plugin rules.
    GOOGLE_PLUGIN_RULES,
    JSDOC_PLUGIN_RULES
  ),

  // ESLint supports adding shared settings into configuration file.  The
  // settings object will be supplied to every rule that will be executed.
  settings: {
    jsdoc: {
      additionalTagNames: {
        customTags: GOOGLE_CUSTOM_JSDOC_TAGS.concat(CLOSURE_JSDOC_TAGS),
      },
      tagNamePreference: {
        returns: 'return',
      },
    },
  },
};


module.exports = ESLINT_CONFIG;
