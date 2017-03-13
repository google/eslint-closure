# GoogleJS - ESLint Plugin and Config for the Google JavaScript Style Guide


A heavily customized ESLint config and plugin for JavaScript following
the
[Google JavaScript style guide](https://google.github.io/styleguide/jsguide.html).
Check out the [**demo**](https://jschaf.github.io/googlejs/).

## Google Style Guide Specific Features

- Recognizes `goog.scope` as an immediately invoked function expression (IIFE).

  ```javascript
  goog.scope(function() {
  var noIndent = 2;
  });
  ```
  
- Recognizes `goog.provide` and `goog.require`.

  ```javascript
  goog.provide('my.module');
  goog.require('other.module');
  
  my.module.Foo = other.module.Bar;
  ```

- Marks `typedef`, `export` and other tags as being used to avoid spurious
  warnings.

  ```javascript
  /** @export {number} */
  my.module.foo = 2;
  ```
  
See the
[Google JavaScript style guide](https://google.github.io/styleguide/jsguide.html) for
the rest of the rules.
