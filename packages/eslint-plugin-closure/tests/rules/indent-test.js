// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Test indents rule.
 */
goog.module('eslintClosure.tests.rules.indent');

const indentRule = goog.require('eslintClosure.rules.indent');

const eslint = /** @type {!ESLint.Module} */ (require('eslint'));

/**
 * @typedef {!Array<!Array<(number|string)>>}
 */
let IndentErrorInfo;

/**
 * Create error message object for failure cases with a single 'found'
 * indentation type
 * @param {(string|!IndentErrorInfo)} indentType indent type of string or tab.
 * @param {!IndentErrorInfo=} opt_errors Error info.
 * @return {!Object} The error messages collection.
 * @private
 */
function expectedErrors(indentType, opt_errors) {
  /** @type {!IndentErrorInfo} */
  let errors;
  if (Array.isArray(indentType)) {
    errors = indentType;
    indentType = 'space';
  } else if (opt_errors) {
    errors = opt_errors;
  } else {
    throw new Error('Array of error information must be provided.');
  }

  return errors.map((err) => {
    let message;

    if (typeof err[1] === 'string' && typeof err[2] === 'string') {
      message = `Expected indentation of ${err[1]} but found ${err[2]}.`;
    } else {
      const chars = indentType + (err[1] === 1 ? '' : 's');

      message =
          `Expected indentation of ${err[1]} ${chars} but found ${err[2]}.`;
    }
    // Skip the empty line at the beginning of the template literal.
    const lineNumber = /** @type {number} */ (err[0]) + 1;
    return {message, type: err[3], line: lineNumber};
  });
}

const ruleTester = new eslint.RuleTester();

ruleTester.run('indent', indentRule, {
  valid: [
    {
      code: `
bridge.callHandler(
  'getAppVersion', 'test23', function(responseData) {
    window.ah.mobileAppVersion = responseData;
  }
);`,
      options: [2],
    },
    {
      code: `
bridge.callHandler(
  'getAppVersion', 'test23', function(responseData) {
    window.ah.mobileAppVersion = responseData;
  });`,
      options: [2],
    },
    {
      code: `
bridge.callHandler(
  'getAppVersion',
  null,
  function responseCallback(responseData) {
    window.ah.mobileAppVersion = responseData;
  }
);`,
      options: [2],
    },
    {
      code: `
bridge.callHandler(
  'getAppVersion',
  null,
  function responseCallback(responseData) {
    window.ah.mobileAppVersion = responseData;
  });`,
      options: [2],
    },
    {
      code: `
function doStuff(keys) {
    _.forEach(
        keys,
        key => {
            doSomething(key);
        }
   );
}`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
example(
    function () {
        console.log('example');
    }
);`,
      options: [4],
    },
    {
      code: `
let foo = somethingList
    .filter(x => {
        return x;
    })
    .map(x => {
        return 100 * x;
    });`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
var x = 0 &&
    {
        a: 1,
        b: 2
    };`,
      options: [4],
    },
    {
      code: `
var x = 0 &&
\t{
\t\ta: 1,
\t\tb: 2
\t};`,
      options: ['tab'],
    },
    {
      code: `
var x = 0 &&
    {
        a: 1,
        b: 2
    }||
    {
        c: 3,
        d: 4
    };`,
      options: [4],
    },
    {
      code: `
var x = 0 && 1;`,
      options: [4],
    },
    {
      code: `
var x = 0 && { a: 1, b: 2 };`,
      options: [4],
    },
    {
      code: `
var x = 0 &&
    (
        1
    );`,
      options: [4],
    },
    {
      code: `
var x = 0 && { a: 1, b: 2 };`,
      options: [4],
    },
    {
      code: `
require('http').request({hostname: 'localhost',
                         port: 80}, function(res) {
  res.end();
});`,
      options: [2],
    },
    {
      code: `
function test() {
  return client.signUp(email, PASSWORD, { preVerified: true })
    .then(function (result) {
      // hi
    })
    .then(function () {
      return FunctionalHelpers.clearBrowserState(self, {
        contentServer: true,
        contentServer1: true
      });
    });
}`,
      options: [2],
    },
    {
      code: `
it('should... some lengthy test description that is forced to be' +
  'wrapped into two lines since the line length limit is set', () => {
  expect(true).toBe(true);
});`,
      options: [2],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
function test() {
    return client.signUp(email, PASSWORD, { preVerified: true })
        .then(function (result) {
            var x = 1;
            var y = 1;
        }, function(err){
            var o = 1 - 2;
            var y = 1 - 2;
            return true;
        })
}`,
      options: [4],
    },
    {
      code: `
function test() {
    return client.signUp(email, PASSWORD, { preVerified: true })
    .then(function (result) {
        var x = 1;
        var y = 1;
    }, function(err){
        var o = 1 - 2;
        var y = 1 - 2;
        return true;
    });
}`,
      options: [4, {MemberExpression: 0}],
    },

    {
      code: `
// hi`,
      options: [2],
    },
    {
      code: `
var Command = function() {
  var fileList = [],
      files = []

  files.concat(fileList)
};`,
      options: [2, {VariableDeclarator: {var: 2}}],
    },
    {
      code: ` `,
      options: [2],
    },
    {
      code: `
if(data) {
  console.log('hi');
  b = true;};`,
      options: [2],
    },
    {
      code: `
foo = () => {
  console.log('hi');
  return true;};`,
      options: [2],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
function test(data) {
  console.log('hi');
  return true;};`,
      options: [2],
    },
    {
      code: `
var test = function(data) {
  console.log('hi');
};`,
      options: [2],
    },
    {
      code: `
arr.forEach(function(data) {
  otherdata.forEach(function(zero) {
    console.log('hi');
  }) });`,
      options: [2],
    },
    {
      code: `
a = [
    ,3
]`,
      options: [4],
    },
    {
      code: `
[
  ['gzip', 'gunzip'],
  ['gzip', 'unzip'],
  ['deflate', 'inflate'],
  ['deflateRaw', 'inflateRaw'],
].forEach(function(method) {
  console.log(method);
});`,
      options: [2],
    },
    {
      code: `
test(123, {
    bye: {
        hi: [1,
            {
                b: 2
            }
        ]
    }
});`,
      options: [4],
    },
    {
      code: `
var xyz = 2,
    lmn = [
        {
            a: 1
        }
    ];`,
      options: [4],
    },
    {
      code: `
lmn = [{
    a: 1
},
{
    b: 2
},
{
    x: 2
}];`,
      options: [4],
    },
    {
      code: `
abc({
    test: [
        [
            c,
            xyz,
            2
        ].join(',')
    ]
});`,
      options: [4],
    },
    {
      code: `
abc = {
  test: [
    [
      c,
      xyz,
      2
    ]
  ]
};`,
      options: [2],
    },
    {
      code: `
abc(
  {
    a: 1,
    b: 2
  }
);`,
      options: [2],
    },
    {
      code: `
abc({
    a: 1,
    b: 2
});`,
      options: [4],
    },
    {
      code: `
var abc =
  [
    c,
    xyz,
    {
      a: 1,
      b: 2
    }
  ];`,
      options: [2],
    },
    {
      code: `
var abc = [
  c,
  xyz,
  {
    a: 1,
    b: 2
  }
];`,
      options: [2],
    },
    {
      code: `
var abc = 5,
    c = 2,
    xyz =
    {
      a: 1,
      b: 2
    };`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
var abc =
    {
      a: 1,
      b: 2
    };`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
var a = new abc({
        a: 1,
        b: 2
    }),
    b = 2;`,
      options: [4],
    },
    {
      code: `
var a = 2,
  c = {
    a: 1,
    b: 2
  },
  b = 2;`,
      options: [2],
    },
    {
      code: `
var x = 2,
    y = {
      a: 1,
      b: 2
    },
    b = 2;`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
var e = {
      a: 1,
      b: 2
    },
    b = 2;`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
var a = {
  a: 1,
  b: 2
};`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
function test() {
  if (true ||
            false){
    console.log(val);
  }
}`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
for (var val in obj)
  if (true)
    console.log(val);`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
if(true)
  if (true)
    if (true)
      console.log(val);`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
function hi(){     var a = 1;
  y++;                   x++;
}`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
for(;length > index; index++)if(NO_HOLES || index in self){
  x++;
}`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
function test(){
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
  }
}`,
      options: [2, {SwitchCase: 1}],
    },
    {
      code: `
var geometry = 2,
rotate = 2;`,
      options: [2, {VariableDeclarator: 0}],
    },
    {
      code: `
var geometry,
    rotate;`,
      options: [4, {VariableDeclarator: 1}],
    },
    {
      code: `
var geometry,
\trotate;`,
      options: ['tab', {VariableDeclarator: 1}],
    },
    {
      code: `
var geometry,
  rotate;`,
      options: [2, {VariableDeclarator: 1}],
    },
    {
      code: `
var geometry,
    rotate;`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
let geometry,
    rotate;`,
      options: [2, {VariableDeclarator: 2}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
const geometry = 2,
    rotate = 3;`,
      options: [2, {VariableDeclarator: 2}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
  height, rotate;`,
      options: [2, {SwitchCase: 1}],
    },
    {
      code: `
var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth;`,
      options: [2, {SwitchCase: 1}],
    },
    {
      code: `
if (1 < 2){
//hi sd
}`,
      options: [2],
    },
    {
      code: `
while (1 < 2){
  //hi sd
}`,
      options: [2],
    },
    {
      code: `
while (1 < 2) console.log('hi');`,
      options: [2],
    },
    {
      code: `
[a, b,
c].forEach((index) => {
    index;
});`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
[a, b,
c].forEach(function(index){
    return index;
});`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
[a, b, c].forEach((index) => {
    index;
});`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
[a, b, c].forEach(function(index){
    return index;
});`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
switch (x) {
    case "foo":
        a();
        break;
    case "bar":
        switch (y) {
            case "1":
                break;
            case "2":
                a = 6;
                break;
        }
    case "test":
        break;
}`,
      options: [4, {SwitchCase: 1}],
    },
    {
      code: `
switch (x) {
        case "foo":
            a();
            break;
        case "bar":
            switch (y) {
                    case "1":
                        break;
                    case "2":
                        a = 6;
                        break;
            }
        case "test":
            break;
}`,
      options: [4, {SwitchCase: 2}],
    },
    {
      code: `
switch (a) {
case "foo":
    a();
    break;
case "bar":
    switch(x){
    case '1':
        break;
    case '2':
        a = 6;
        break;
    }
}`,
    },
    {
      code: `
switch (a) {
case "foo":
    a();
    break;
case "bar":
    if(x){
        a = 2;
    }
    else{
        a = 6;
    }
}`,
    },
    {
      code: `
switch (a) {
case "foo":
    a();
    break;
case "bar":
    if(x){
        a = 2;
    }
    else
        a = 6;
}`,
    },
    {
      code: `
switch (a) {
case "foo":
    a();
    break;
case "bar":
    a(); break;
case "baz":
    a(); break;
}`,
    },
    {
      code: `
switch (0) {
}`,
    },
    {
      code: `
function foo() {
    var a = "a";
    switch(a) {
    case "a":
        return "A";
    case "b":
        return "B";
    }
}
foo();`,
    },
    {
      code: `
switch(value){
    case "1":
    case "2":
        a();
        break;
    default:
        a();
        break;
}
switch(value){
    case "1":
        a();
        break;
    case "2":
        break;
    default:
        break;
}`,
      options: [4, {SwitchCase: 1}],
    },
    {
      code: `
var obj = {foo: 1, bar: 2};
with (obj) {
    console.log(foo + bar);
}`,
    },
    {
      code: `
if (a) {
    (1 + 2 + 3); // no error on this line
}`,
    },
    {
      code: `
switch(value){ default: a(); break; }`,
    },
    {
      code: `
import {addons} from 'react/addons'
import React from 'react'`,
      options: [2],
      parserOptions: {sourceType: 'module'},
    },
    {
      code: `
var a = 1,
    b = 2,
    c = 3;`,
      options: [4],
    },
    {
      code: `
var a = 1
   ,b = 2
   ,c = 3;`,
      options: [4],
    },
    {
      code: `while (1 < 2) console.log('hi')`,
      options: [2],
    },
    {
      code: `
function salutation () {
  switch (1) {
    case 0: return console.log('hi')
    case 1: return console.log('hey')
  }
}`,
      options: [2, {SwitchCase: 1}],
    },
    {
      code: `
var items = [
  {
    foo: 'bar'
  }
];`,
      options: [2, {VariableDeclarator: 2}],
    },
    {
      code: `
const a = 1,
      b = 2;
const items1 = [
  {
    foo: 'bar'
  }
];
const items2 = Items(
  {
    foo: 'bar'
  }
);`,
      options: [2, {VariableDeclarator: 3}],
      parserOptions: {ecmaVersion: 6},

    },
    {
      code: `
const geometry = 2,
      rotate = 3;
var a = 1,
  b = 2;
let light = true,
    shadow = false;`,
      options: [2, {VariableDeclarator: {const: 3, let: 2}}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
const abc = 5,
      c = 2,
      xyz =
      {
        a: 1,
        b: 2
      };
let abc = 5,
  c = 2,
  xyz =
  {
    a: 1,
    b: 2
  };
var abc = 5,
    c = 2,
    xyz =
    {
      a: 1,
      b: 2
    };`,
      options: [2, {VariableDeclarator: {var: 2, const: 3}}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
module.exports =
{
  'Unit tests':
  {
    rootPath: './',
    environment: 'node',
    tests:
    [
      'test/test-*.js'
    ],
    sources:
    [
      '*.js',
      'test/**.js'
    ]
  }
};`,
      options: [2],
    },
    {
      code: `
var path     = require('path')
  , crypto    = require('crypto')
  ;`,
      options: [2],
    },
    {
      code: `
var a = 1
   ,b = 2
   ;`,
    },
    {
      code: `
export function create (some,
                        argument) {
  return Object.create({
    a: some,
    b: argument
  });
};`,
      parserOptions: {sourceType: 'module'},
      options: [2],
    },
    {
      code: `
export function create (id, xfilter, rawType,
                        width=defaultWidth, height=defaultHeight,
                        footerHeight=defaultFooterHeight,
                        padding=defaultPadding) {
  // ... function body, indented two spaces
}`,
      parserOptions: {sourceType: 'module'},
      options: [2],
    },
    {
      code: `
var obj = {
  foo: function () {
    return new p()
      .then(function (ok) {
        return ok;
      }, function () {
        // ignore things
      });
  }
};`,
      options: [2],
    },
    {
      code: `
a.b()
  .c(function(){
    var a;
  }).d.e;`,
      options: [2],
    },
    {
      code: `
const YO = 'bah',
      TE = 'mah'

let res,
    a = 5,
    b = 4;

var res,
    a = 5,
    b = 4`,
      parserOptions: {ecmaVersion: 6},
      options: [2, {VariableDeclarator: {var: 2, let: 2, const: 3}}],
    },
    {
      code: `
const YO = 'bah',
      TE = 'mah'

var res,
    a = 5,
    b = 4

if (YO) console.log(TE)`,
      parserOptions: {ecmaVersion: 6},
      options: [2, {VariableDeclarator: {var: 2, let: 2, const: 3}}],
    },
    {
      code: `
var foo = 'foo',
  bar = 'bar',
  baz = function() {

  }

function hello () {

}`,
      options: [2],
    },
    {
      code: `
var obj = {
  send: function () {
    return P.resolve({
      type: 'POST'
    })
      .then(function () {
        return true;
      }, function () {
        return false;
      });
  }
};`,
      options: [2],
    },
    {
      code: `
var obj = {
  send: function () {
    return P.resolve({
      type: 'POST'
    })
    .then(function () {
      return true;
    }, function () {
      return false;
    });
  }
};`,
      options: [2, {MemberExpression: 0}],
    },
    {
      code: `
const someOtherFunction = argument => {
        console.log(argument);
    },
    someOtherValue = 'someOtherValue';`,
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
[
  'a',
  'b'
].sort().should.deepEqual([
  'x',
  'y'
]);`,
      options: [2],
    },
    {
      code: `
var a = 1,
    B = class {
      constructor(){}
      a(){}
      get b(){}
    };`,
      options: [2, {VariableDeclarator: 2}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
var a = 1,
    B =
    class {
      constructor(){}
      a(){}
      get b(){}
    },
    c = 3;`,
      options: [2, {VariableDeclarator: 2}],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
class A{
    constructor(){}
    a(){}
    get b(){}
}`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
var A = class {
    constructor(){}
    a(){}
    get b(){}
}`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
var a = {
  some: 1
, name: 2
};`,
      options: [2],
    },
    {
      code: `
a.c = {
    aa: function() {
        'test1';
        return 'aa';
    }
    , bb: function() {
        return this.bb();
    }
};`,
      options: [4],
    },
    {
      code: `
var a =
{
    actions:
    [
        {
            name: 'compile'
        }
    ]
};`,
      options: [4, {VariableDeclarator: 0}],
    },
    {
      code: `
var a =
[
    {
        name: 'compile'
    }
];`,
      options: [4, {VariableDeclarator: 0}],
    },
    {
      code: `
const func = function (opts) {
    return Promise.resolve()
    .then(() => {
        [
            'ONE', 'TWO'
        ].forEach(command => { doSomething(); });
    });
};`,
      parserOptions: {ecmaVersion: 6},
      options: [4, {MemberExpression: 0}],
    },
    {
      code: `
const func = function (opts) {
    return Promise.resolve()
        .then(() => {
            [
                'ONE', 'TWO'
            ].forEach(command => { doSomething(); });
        });
};`,
      parserOptions: {ecmaVersion: 6},
      options: [4],
    },
    {
      code: `
var haveFun = function () {
    SillyFunction(
        {
            value: true,
        },
        {
            _id: true,
        }
    );
};`,
      options: [4],
    },
    {
      code: `
var haveFun = function () {
    new SillyFunction(
        {
            value: true,
        },
        {
            _id: true,
        }
    );
};`,
      options: [4],
    },
    {
      code: `
let object1 = {
  doThing() {
    return _.chain([])
      .map(v => (
        {
          value: true,
        }
      ))
      .value();
  }
};`,
      parserOptions: {ecmaVersion: 6},
      options: [2],
    },
    {
      code: `
class Foo
  extends Bar {
  baz() {}
}`,
      parserOptions: {ecmaVersion: 6},
      options: [2],
    },
    {
      code: `
class Foo extends
  Bar {
  baz() {}
}`,
      parserOptions: {ecmaVersion: 6},
      options: [2],
    },
    {
      code: `
fs.readdirSync(path.join(__dirname, '../rules')).forEach(name => {
  files[name] = foo;
});`,
      options: [2],
      parserOptions: {ecmaVersion: 6},
    },
    {
      code: `
(function(){
function foo(x) {
  return x + 1;
}
})();`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
(function(){
        function foo(x) {
            return x + 1;
        }
})();`,
      options: [4, {outerIIFEBody: 2}],
    },
    {
      code: `
(function(x, y){
function foo(x) {
  return x + 1;
}
})(1, 2);`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
(function(){
function foo(x) {
  return x + 1;
}
}());`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
!function(){
function foo(x) {
  return x + 1;
}
}();`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
!function(){
\t\t\tfunction foo(x) {
\t\t\t\treturn x + 1;
\t\t\t}
}();`,
      options: ['tab', {outerIIFEBody: 3}],
    },
    {
      code: `
var out = function(){
  function fooVar(x) {
    return x + 1;
  }
};`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
var ns = function(){
function fooVar(x) {
  return x + 1;
}
}();`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
ns = function(){
function fooVar(x) {
  return x + 1;
}
}();`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
var ns = (function(){
function fooVar(x) {
  return x + 1;
}
}(x));`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
var ns = (function(){
        function fooVar(x) {
            return x + 1;
        }
}(x));`,
      options: [4, {outerIIFEBody: 2}],
    },
    {
      code: `
var obj = {
  foo: function() {
    return true;
  }
};`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
while (
  function() {
    return true;
  }()) {

  x = x + 1;
};`,
      options: [2, {outerIIFEBody: 20}],
    },
    {
      code: `
(() => {
function foo(x) {
  return x + 1;
}
})();`,
      parserOptions: {ecmaVersion: 6},
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
function foo() {
}`,
      options: ['tab', {outerIIFEBody: 0}],
    },
    {
      code: `
;(() => {
function foo(x) {
  return x + 1;
}
})();`,
      parserOptions: {ecmaVersion: 6},
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
if(data) {
  console.log('hi');
}`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
Buffer.length`,
      options: [4, {MemberExpression: 1}],
    },
    {
      code: `
Buffer
    .indexOf('a')
    .toString()`,
      options: [4, {MemberExpression: 1}],
    },
    {
      code: `
Buffer.
    length`,
      options: [4, {MemberExpression: 1}],
    },
    {
      code: `
Buffer
    .foo
    .bar`,
      options: [4, {MemberExpression: 1}],
    },
    {
      code: `
Buffer
\t.foo
\t.bar`,
      options: ['tab', {MemberExpression: 1}],
    },
    {
      code: `
Buffer
    .foo
    .bar`,
      options: [2, {MemberExpression: 2}],
    },
    {
      code: `
MemberExpression
.is
  .off
    .by
 .default();`,
      options: [4],
    },
    {
      code: `
foo = bar.baz()
        .bip();`,
      options: [4, {MemberExpression: 1}],
    },
    {
      code: `
if (foo) {
  bar();
} else if (baz) {
  foobar();
} else if (qux) {
  qux();
}`,
      options: [2],
    },
    {
      code: `
function foo(aaa,
  bbb, ccc, ddd) {
    bar();
}`,
      options: [2, {FunctionDeclaration: {parameters: 1, body: 2}}],
    },
    {
      code: `
function foo(aaa, bbb,
      ccc, ddd) {
  bar();
}`,
      options: [2, {FunctionDeclaration: {parameters: 3, body: 1}}],
    },
    {
      code: `
function foo(aaa,
    bbb,
    ccc) {
            bar();
}`,
      options: [4, {FunctionDeclaration: {parameters: 1, body: 3}}],
    },
    {
      code: `
function foo(aaa,
             bbb, ccc,
             ddd, eee, fff) {
  bar();
}`,
      options: [2, {FunctionDeclaration: {parameters: 'first', body: 1}}],
    },
    {
      code: `
function foo(aaa, bbb)
{
      bar();
}`,
      // FIXME: what is the default for `parameters`?
      options: [2, {FunctionDeclaration: {body: 3}}],
    },
    {
      code: `
function foo(
  aaa,
  bbb) {
    bar();
}`,
      // FIXME: make sure this is correct
      options: [2, {FunctionDeclaration: {parameters: 'first', body: 2}}],
    },
    {
      code: `
var foo = function(aaa,
    bbb,
    ccc,
    ddd) {
bar();
}`,
      options: [2, {FunctionExpression: {parameters: 2, body: 0}}],
    },
    {
      code: `
var foo = function(aaa,
  bbb,
  ccc) {
                    bar();
}`,
      options: [2, {FunctionExpression: {parameters: 1, body: 10}}],
    },
    {
      code: `
var foo = function(aaa,
                   bbb, ccc, ddd,
                   eee, fff) {
    bar();
}`,
      options: [4, {FunctionExpression: {parameters: 'first', body: 1}}],
    },
    {
      code: `
var foo = function(
  aaa, bbb, ccc,
  ddd, eee) {
      bar();
}`,
      // FIXME: make sure this is correct
      options: [2, {FunctionExpression: {parameters: 'first', body: 3}}],
    },
    {
      code: `
while(true) {
  foo();
  bar();
}`,
      options: [2],
    },
    {
      code: `
if(true) {
  foo();
  bar();
}`,
      options: [2],
    },

    {
      code: `
goog.scope(function() {
  var foo;
})
`,
      options: [2],
    },
    {
      code: `
goog.scope(function() {
var foo;
})
`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
goog.scope(function() {var foo;})
`,
      options: [2, {outerIIFEBody: 0}],
    },
    {
      code: `
goog.scope(function() {
    var foo;
})
`,
      options: [2, {outerIIFEBody: 2}],
    },
  ],
  invalid: [
    {
      code: `
var a = b;
if (a) {
b();
}`,
      options: [2],
      errors: expectedErrors([[3, 2, 0, 'ExpressionStatement']]),
      output: `
var a = b;
if (a) {
  b();
}`,
    },
    {
      code: `
if (array.some(function(){
  return true;
})) {
a++; // ->
  b++;
    c++; // <-
}`,
      output: `
if (array.some(function(){
  return true;
})) {
  a++; // ->
  b++;
  c++; // <-
}`,
      options: [2],
      errors: expectedErrors([
        [4, 2, 0, 'ExpressionStatement'],
        [6, 2, 4, 'ExpressionStatement']]),
    },
    {
      code: `
if (a){
\tb=c;
\t\tc=d;
e=f;
}`,
      output: `
if (a){
\tb=c;
\tc=d;
\te=f;
}`,
      options: ['tab'],
      errors: expectedErrors('tab', [
        [3, 1, 2, 'ExpressionStatement'],
        [4, 1, 0, 'ExpressionStatement']]),
    },
    {
      code: `
if (a){
    b=c;
      c=d;
 e=f;
}`,
      output: `
if (a){
    b=c;
    c=d;
    e=f;
}`,
      options: [4],
      errors: expectedErrors([
        [3, 4, 6, 'ExpressionStatement'],
        [4, 4, 1, 'ExpressionStatement']]),
    },
    {
      code: `
switch(value){
    case "1":
        a();
    break;
    case "2":
        a();
    break;
    default:
        a();
        break;
}`,
      output: `
switch(value){
    case "1":
        a();
        break;
    case "2":
        a();
        break;
    default:
        a();
        break;
}`,
      options: [4, {SwitchCase: 1}],
      errors: expectedErrors([
        [4, 8, 4, 'BreakStatement'],
        [7, 8, 4, 'BreakStatement']]),
    },
    {
      code: `
var x = 0 &&
    {
       a: 1,
          b: 2
    };`,
      output: `
var x = 0 &&
    {
        a: 1,
        b: 2
    };`,
      options: [4],
      errors: expectedErrors([[3, 8, 7, 'Property'], [4, 8, 10, 'Property']]),
    },
    {
      code: `
switch(value){
    case "1":
        a();
        break;
    case "2":
        a();
        break;
    default:
    break;
}`,
      output: `
switch(value){
    case "1":
        a();
        break;
    case "2":
        a();
        break;
    default:
        break;
}`,
      options: [4, {SwitchCase: 1}],
      errors: expectedErrors([[9, 8, 4, 'BreakStatement']]),
    },
    {
      code: `
switch(value){
    case "1":
    case "2":
        a();
        break;
    default:
        break;
}
switch(value){
    case "1":
    break;
    case "2":
        a();
    break;
    default:
        a();
    break;
}`,
      output: `
switch(value){
    case "1":
    case "2":
        a();
        break;
    default:
        break;
}
switch(value){
    case "1":
        break;
    case "2":
        a();
        break;
    default:
        a();
        break;
}`,
      options: [4, {SwitchCase: 1}],
      errors: expectedErrors([
        [11, 8, 4, 'BreakStatement'],
        [14, 8, 4, 'BreakStatement'],
        [17, 8, 4, 'BreakStatement']]),
    },
    {
      code: `
switch(value){
case "1":
        a();
        break;
    case "2":
        break;
    default:
        break;
}`,
      output: `
switch(value){
case "1":
    a();
    break;
case "2":
    break;
default:
    break;
}`,
      options: [4],
      errors: expectedErrors([
        [3, 4, 8, 'ExpressionStatement'],
        [4, 4, 8, 'BreakStatement'],
        [5, 0, 4, 'SwitchCase'],
        [6, 4, 8, 'BreakStatement'],
        [7, 0, 4, 'SwitchCase'],
        [8, 4, 8, 'BreakStatement'],
      ]),
    },
    {
      code: `
var obj = {foo: 1, bar: 2};
with (obj) {
console.log(foo + bar);
}`,
      output: `
var obj = {foo: 1, bar: 2};
with (obj) {
    console.log(foo + bar);
}`,
      errors: expectedErrors([[3, 4, 0, 'ExpressionStatement']]),
    },
    {
      code: `
switch (a) {
case '1':
b();
break;
default:
c();
break;
}`,
      output: `
switch (a) {
    case '1':
        b();
        break;
    default:
        c();
        break;
}`,
      options: [4, {SwitchCase: 1}],
      errors: expectedErrors([
        [2, 4, 0, 'SwitchCase'],
        [3, 8, 0, 'ExpressionStatement'],
        [4, 8, 0, 'BreakStatement'],
        [5, 4, 0, 'SwitchCase'],
        [6, 8, 0, 'ExpressionStatement'],
        [7, 8, 0, 'BreakStatement'],
      ]),
    },
    {
      code: `
while (a)
b();`,
      output: `
while (a)
    b();`,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
for (;;)
b();`,
      output: `
for (;;)
    b();`,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
for (a in x)
b();`,
      output: `
for (a in x)
    b();`,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
do
b();
while(true)`,
      output: `
do
    b();
while(true)`,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
if(true)
b();`,
      output: `
if(true)
    b();`,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
var test = {
      a: 1,
    b: 2
    };`,
      output: `
var test = {
  a: 1,
  b: 2
};`,
      options: [2],
      errors: expectedErrors([
        [2, 2, 6, 'Property'],
        [3, 2, 4, 'Property'],
        [4, 0, 4, 'ObjectExpression'],
      ]),
    },
    {
      code: `
var a = function() {
      a++;
    b++;
          c++;
    },
    b;`,
      output: `
var a = function() {
        a++;
        b++;
        c++;
    },
    b;`,
      options: [4],
      errors: expectedErrors([
        [2, 8, 6, 'ExpressionStatement'],
        [3, 8, 4, 'ExpressionStatement'],
        [4, 8, 10, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
var a = 1,
b = 2,
c = 3;`,
      output: `
var a = 1,
    b = 2,
    c = 3;`,
      options: [4],
      errors: expectedErrors([
        [2, 4, 0, 'VariableDeclarator'],
        [3, 4, 0, 'VariableDeclarator'],
      ]),
    },
    {
      code: `
[a, b,
c].forEach((index) => {
  index;
});`,
      output: `
[a, b,
c].forEach((index) => {
    index;
});`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([
        [3, 4, 2, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
[a, b,
c].forEach(function(index){
  return index;
});`,
      output: `
[a, b,
c].forEach(function(index){
    return index;
});`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([
        [3, 4, 2, 'ReturnStatement'],
      ]),
    },
    {
      code: `
[a, b, c].forEach((index) => {
  index;
});`,
      output: `
[a, b, c].forEach((index) => {
    index;
});`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([
        [2, 4, 2, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
[a, b, c].forEach(function(index){
  return index;
});`,
      output: `
[a, b, c].forEach(function(index){
    return index;
});`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([
        [2, 4, 2, 'ReturnStatement'],
      ]),
    },
    {
      code: `
while (1 < 2)
console.log('foo')
  console.log('bar')`,
      output: `
while (1 < 2)
  console.log('foo')
console.log('bar')`,
      options: [2],
      errors: expectedErrors([
        [2, 2, 0, 'ExpressionStatement'],
        [3, 0, 2, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
function salutation () {
  switch (1) {
  case 0: return console.log('hi')
    case 1: return console.log('hey')
  }
}`,
      output: `
function salutation () {
  switch (1) {
    case 0: return console.log('hi')
    case 1: return console.log('hey')
  }
}`,
      options: [2, {SwitchCase: 1}],
      errors: expectedErrors([
        [3, 4, 2, 'SwitchCase'],
      ]),
    },
    {
      code: `
var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
height, rotate;`,
      output: `
var geometry, box, face1, face2, colorT, colorB, sprite, padding, maxWidth,
  height, rotate;`,
      options: [2],
      errors: expectedErrors([
        [2, 2, 0, 'VariableDeclarator'],
      ]),
    },
    {
      code: `
switch (a) {
case '1':
b();
break;
default:
c();
break;
}`,
      output: `
switch (a) {
        case '1':
            b();
            break;
        default:
            c();
            break;
}`,
      options: [4, {SwitchCase: 2}],
      errors: expectedErrors([
        [2, 8, 0, 'SwitchCase'],
        [3, 12, 0, 'ExpressionStatement'],
        [4, 12, 0, 'BreakStatement'],
        [5, 8, 0, 'SwitchCase'],
        [6, 12, 0, 'ExpressionStatement'],
        [7, 12, 0, 'BreakStatement'],
      ]),
    },
    {
      code: `
var geometry,
rotate;`,
      output: `
var geometry,
  rotate;`,
      options: [2, {VariableDeclarator: 1}],
      errors: expectedErrors([
        [2, 2, 0, 'VariableDeclarator'],
      ]),
    },
    {
      code: `
var geometry,
  rotate;`,
      output: `
var geometry,
    rotate;`,
      options: [2, {VariableDeclarator: 2}],
      errors: expectedErrors([
        [2, 4, 2, 'VariableDeclarator'],
      ]),
    },
    {
      code: `
var geometry,
\trotate;`,
      output: `
var geometry,
\t\trotate;`,
      options: ['tab', {VariableDeclarator: 2}],
      errors: expectedErrors('tab', [
        [2, 2, 1, 'VariableDeclarator'],
      ]),
    },
    {
      code: `
let geometry,
  rotate;`,
      output: `
let geometry,
    rotate;`,
      options: [2, {VariableDeclarator: 2}],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([
        [2, 4, 2, 'VariableDeclarator'],
      ]),
    },
    {
      code: `
if(true)
  if (true)
    if (true)
    console.log(val);`,
      output: `
if(true)
  if (true)
    if (true)
      console.log(val);`,
      options: [2, {VariableDeclarator: 2}],
      errors: expectedErrors([
        [4, 6, 4, 'ExpressionStatement'],
      ]),
    },
    {
      code: `
var a = {
    a: 1,
    b: 2
}`,
      output: `
var a = {
  a: 1,
  b: 2
}`,
      options: [2, {VariableDeclarator: 2}],
      errors: expectedErrors([
        [2, 2, 4, 'Property'],
        [3, 2, 4, 'Property'],
      ]),
    },
    {
      code: `
var a = [
    a,
    b
]`,
      output: `
var a = [
  a,
  b
]`,
      options: [2, {VariableDeclarator: 2}],
      errors: expectedErrors([
        [2, 2, 4, 'Identifier'],
        [3, 2, 4, 'Identifier'],
      ]),
    },
    {
      code: `
let a = [
    a,
    b
]`,
      output: `
let a = [
  a,
  b
]`,
      options: [2, {VariableDeclarator: {let: 2}}],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([
        [2, 2, 4, 'Identifier'],
        [3, 2, 4, 'Identifier'],
      ]),
    },
    {
      code: `
var a = new Test({
      a: 1
  }),
    b = 4;`,
      output: `
var a = new Test({
        a: 1
    }),
    b = 4;`,
      options: [4],
      errors: expectedErrors([
        [2, 8, 6, 'Property'],
        [3, 4, 2, 'ObjectExpression'],
      ]),
    },
    {
      code: `
var a = new Test({
      a: 1
    }),
    b = 4;
const a = new Test({
      a: 1
    }),
    b = 4;`,
      output: `
var a = new Test({
      a: 1
    }),
    b = 4;
const a = new Test({
    a: 1
  }),
  b = 4;`,
      options: [2, {VariableDeclarator: {var: 2}}],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([
        [6, 4, 6, 'Property'],
        [7, 2, 4, 'ObjectExpression'],
        [8, 2, 4, 'VariableDeclarator'],
      ]),
    },
    {
      code: `
var abc = 5,
    c = 2,
    xyz =
     {
       a: 1,
        b: 2
     };`,
      output: `
var abc = 5,
    c = 2,
    xyz =
    {
      a: 1,
      b: 2
    };`,
      options: [2, {VariableDeclarator: 2}],
      errors: expectedErrors([
        [4, 4, 5, 'ObjectExpression'],
        [5, 6, 7, 'Property'],
        [6, 6, 8, 'Property'],
        [7, 4, 5, 'ObjectExpression'],
      ]),
    },
    {
      code: `
var abc =
     {
       a: 1,
        b: 2
     };`,
      output: `
var abc =
    {
      a: 1,
      b: 2
    };`,
      options: [2, {VariableDeclarator: 2}],
      errors: expectedErrors([
        [2, 4, 5, 'ObjectExpression'],
        [3, 6, 7, 'Property'],
        [4, 6, 8, 'Property'],
        [5, 4, 5, 'ObjectExpression'],
      ]),
    },
    {
      code: `
var path     = require('path')
 , crypto    = require('crypto')
;`,
      output: `
var path     = require('path')
 , crypto    = require('crypto')
 ;`,
      options: [2],
      errors: expectedErrors([
        [3, 1, 0, 'VariableDeclaration'],
      ]),
    },
    {
      code: `
var a = 1
   ,b = 2
;`,
      output: `
var a = 1
   ,b = 2
   ;`,
      errors: expectedErrors([
        [3, 3, 0, 'VariableDeclaration'],
      ]),
    },
    {
      code: `
class A{
  constructor(){}
    a(){}
    get b(){}
}`,
      output: `
class A{
    constructor(){}
    a(){}
    get b(){}
}`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([[2, 4, 2, 'MethodDefinition']]),
    },
    {
      code: `
var A = class {
  constructor(){}
    a(){}
  get b(){}
};`,
      output: `
var A = class {
    constructor(){}
    a(){}
    get b(){}
};`,
      options: [4],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([
        [2, 4, 2, 'MethodDefinition'],
        [4, 4, 2, 'MethodDefinition']]),
    },
    {
      code: `
var a = 1,
    B = class {
    constructor(){}
      a(){}
      get b(){}
    };`,
      output: `
var a = 1,
    B = class {
      constructor(){}
      a(){}
      get b(){}
    };`,
      options: [2, {VariableDeclarator: 2}],
      parserOptions: {ecmaVersion: 6},
      errors: expectedErrors([[3, 6, 4, 'MethodDefinition']]),
    },
    {
      code: `
{
    if(a){
        foo();
    }
  else{
        bar();
    }
}`,
      output: `
{
    if(a){
        foo();
    }
    else{
        bar();
    }
}`,
      options: [4],
      errors: expectedErrors([[5, 4, 2, 'Keyword']]),
    },
    {
      code: `
{
    if(a){
        foo();
    }
  else
        bar();

}`,
      output: `
{
    if(a){
        foo();
    }
    else
        bar();

}`,
      options: [4],
      errors: expectedErrors([[5, 4, 2, 'Keyword']]),
    },
    {
      code: `
{
    if(a)
        foo();
  else
        bar();
}`,
      output: `
{
    if(a)
        foo();
    else
        bar();
}`,
      options: [4],
      errors: expectedErrors([[4, 4, 2, 'Keyword']]),
    },
    {
      code: `
(function(){
  function foo(x) {
    return x + 1;
  }
})();`,
      options: [2, {outerIIFEBody: 0}],
      errors: expectedErrors([[2, 0, 2, 'FunctionDeclaration']]),
    },
    {
      code: `
(function(){
    function foo(x) {
        return x + 1;
    }
})();`,
      options: [4, {outerIIFEBody: 2}],
      errors: expectedErrors([[2, 8, 4, 'FunctionDeclaration']]),
    },
    {
      code: `
if(data) {
console.log('hi');
}`,
      options: [2, {outerIIFEBody: 0}],
      errors: expectedErrors([[2, 2, 0, 'ExpressionStatement']]),
    },
    {
      code: `
var ns = function(){
    function fooVar(x) {
        return x + 1;
    }
}(x);`,
      options: [4, {outerIIFEBody: 2}],
      errors: expectedErrors([[2, 8, 4, 'FunctionDeclaration']]),
    },
    {
      code: `
var obj = {
  foo: function() {
  return true;
  }()
};`,
      options: [2, {outerIIFEBody: 0}],
      errors: expectedErrors([[3, 4, 2, 'ReturnStatement']]),
    },
    {
      code: `
typeof function() {
    function fooVar(x) {
      return x + 1;
    }
}();`,
      options: [2, {outerIIFEBody: 2}],
      errors: expectedErrors([[2, 2, 4, 'FunctionDeclaration']]),
    },
    {
      code: `
{
\t!function(x) {
\t\t\t\treturn x + 1;
\t}()
};`,
      output: `
{
\t!function(x) {
\t\treturn x + 1;
\t}()
};`,
      options: ['tab', {outerIIFEBody: 3}],
      errors: expectedErrors('tab', [[3, 2, 4, 'ReturnStatement']]),
    },
    {
      code: `
Buffer
.toString()`,
      output: `
Buffer
    .toString()`,
      options: [4, {MemberExpression: 1}],
      errors: expectedErrors([[2, 4, 0, 'Punctuator']]),
    },
    {
      code: `
Buffer
    .indexOf('a')
.toString()`,
      output: `
Buffer
    .indexOf('a')
    .toString()`,
      options: [4, {MemberExpression: 1}],
      errors: expectedErrors([[3, 4, 0, 'Punctuator']]),
    },
    {
      code: `
Buffer.
length`,
      output: `
Buffer.
    length`,
      options: [4, {MemberExpression: 1}],
      errors: expectedErrors([[2, 4, 0, 'Identifier']]),
    },
    {
      code: `
Buffer.
\t\tlength`,
      output: `
Buffer.
\tlength`,
      options: ['tab', {MemberExpression: 1}],
      errors: expectedErrors('tab', [[2, 1, 2, 'Identifier']]),
    },
    {
      code: `
Buffer
  .foo
  .bar`,
      output: `
Buffer
    .foo
    .bar`,
      options: [2, {MemberExpression: 2}],
      errors: expectedErrors([
        [2, 4, 2, 'Punctuator'],
        [3, 4, 2, 'Punctuator']]),
    },
    {

      // Indentation with multiple else statements:
      // https://github.com/eslint/eslint/issues/6956
      code: `
if (foo) bar();
else if (baz) foobar();
  else if (qux) qux();`,
      output: `
if (foo) bar();
else if (baz) foobar();
else if (qux) qux();`,
      options: [2],
      errors: expectedErrors([[3, 0, 2, 'Keyword']]),
    },
    {
      code: `
if (foo) bar();
else if (baz) foobar();
  else qux();`,
      output: `
if (foo) bar();
else if (baz) foobar();
else qux();`,
      options: [2],
      errors: expectedErrors([[3, 0, 2, 'Keyword']]),
    },
    {
      code: `
foo();
  if (baz) foobar();
  else qux();`,
      output: `
foo();
if (baz) foobar();
  else qux();`,
      options: [2],
      errors: expectedErrors([[2, 0, 2, 'IfStatement']]),
    },
    {
      code: `
if (foo) bar();
else if (baz) foobar();
     else if (bip) {
       qux();
     }`,
      // Output is fixed on the next pass.
      output: `
if (foo) bar();
else if (baz) foobar();
else if (bip) {
       qux();
     }`,
      options: [2],
      errors: expectedErrors([[3, 0, 5, 'Keyword']]),
    },
    {
      code: `
if (foo) bar();
else if (baz) {
    foobar();
     } else if (boop) {
       qux();
     }`,
      // Output is fixed on the next pass.
      output: `
if (foo) bar();
else if (baz) {
  foobar();
} else if (boop) {
       qux();
     }`,
      options: [2],
      errors: expectedErrors([
        [3, 2, 4, 'ExpressionStatement'],
        [4, 0, 5, 'BlockStatement']]),
    },
    {
      code: `
function foo(aaa,
    bbb, ccc, ddd) {
      bar();
}`,
      output: `
function foo(aaa,
  bbb, ccc, ddd) {
    bar();
}`,
      options: [2, {FunctionDeclaration: {parameters: 1, body: 2}}],
      errors: expectedErrors([
        [2, 2, 4, 'Identifier'],
        [3, 4, 6, 'ExpressionStatement']]),
    },
    {
      code: `
function foo(aaa, bbb,
  ccc, ddd) {
bar();
}`,
      output: `
function foo(aaa, bbb,
      ccc, ddd) {
  bar();
}`,
      options: [2, {FunctionDeclaration: {parameters: 3, body: 1}}],
      errors: expectedErrors([
        [2, 6, 2, 'Identifier'],
        [3, 2, 0, 'ExpressionStatement']]),
    },
    {
      code: `
function foo(aaa,
        bbb,
  ccc) {
      bar();
}`,
      output: `
function foo(aaa,
    bbb,
    ccc) {
            bar();
}`,
      options: [4, {FunctionDeclaration: {parameters: 1, body: 3}}],
      errors: expectedErrors([
        [2, 4, 8, 'Identifier'],
        [3, 4, 2, 'Identifier'],
        [4, 12, 6, 'ExpressionStatement']]),
    },
    {
      code: `
function foo(aaa,
  bbb, ccc,
                   ddd, eee, fff) {
   bar();
}`,
      output: `
function foo(aaa,
             bbb, ccc,
             ddd, eee, fff) {
  bar();
}`,
      options: [2, {FunctionDeclaration: {parameters: 'first', body: 1}}],
      errors: expectedErrors([
        [2, 13, 2, 'Identifier'],
        [3, 13, 19, 'Identifier'],
        [4, 2, 3, 'ExpressionStatement']]),
    },
    {
      code: `
function foo(aaa, bbb)
{
bar();
}`,
      output: `
function foo(aaa, bbb)
{
      bar();
}`,
      options: [2, {FunctionDeclaration: {body: 3}}],
      errors: expectedErrors([[3, 6, 0, 'ExpressionStatement']]),
    },
    {
      code: `
function foo(
aaa,
    bbb) {
bar();
}`,
      output: `
function foo(
aaa,
bbb) {
    bar();
}`,
      options: [2, {FunctionDeclaration: {parameters: 'first', body: 2}}],
      errors: expectedErrors([
        [3, 0, 4, 'Identifier'],
        [4, 4, 0, 'ExpressionStatement']]),
    },
    {
      code: `
var foo = function(aaa,
  bbb,
    ccc,
      ddd) {
  bar();
}`,
      output: `
var foo = function(aaa,
    bbb,
    ccc,
    ddd) {
bar();
}`,
      options: [2, {FunctionExpression: {parameters: 2, body: 0}}],
      errors: expectedErrors([
        [2, 4, 2, 'Identifier'],
        [4, 4, 6, 'Identifier'],
        [5, 0, 2, 'ExpressionStatement']]),
    },
    {
      code: `
var foo = function(aaa,
   bbb,
 ccc) {
  bar();
}`,
      output: `
var foo = function(aaa,
  bbb,
  ccc) {
                    bar();
}`,
      options: [2, {FunctionExpression: {parameters: 1, body: 10}}],
      errors: expectedErrors([
        [2, 2, 3, 'Identifier'],
        [3, 2, 1, 'Identifier'],
        [4, 20, 2, 'ExpressionStatement']]),
    },
    {
      code: `
var foo = function(aaa,
  bbb, ccc, ddd,
                        eee, fff) {
        bar();
}`,
      output: `
var foo = function(aaa,
                   bbb, ccc, ddd,
                   eee, fff) {
    bar();
}`,
      options: [4, {FunctionExpression: {parameters: 'first', body: 1}}],
      errors: expectedErrors([
        [2, 19, 2, 'Identifier'],
        [3, 19, 24, 'Identifier'],
        [4, 4, 8, 'ExpressionStatement']]),
    },
    {
      code: `
var foo = function(
aaa, bbb, ccc,
    ddd, eee) {
  bar();
}`,
      output: `
var foo = function(
aaa, bbb, ccc,
ddd, eee) {
      bar();
}`,
      options: [2, {FunctionExpression: {parameters: 'first', body: 3}}],
      errors: expectedErrors([
        [3, 0, 4, 'Identifier'], [4, 6, 2, 'ExpressionStatement']]),
    },
    {
      code: `
var foo = bar;
  \t  \t  \t  var baz = qux;`,
      output: `
var foo = bar;
var baz = qux;`,
      options: [2],
      errors: expectedErrors([
          [2, '0 spaces', '8 spaces and 3 tabs', 'VariableDeclaration']]),
    },
    {
      code: `
function foo() {
  bar();
  \tbaz();
\t   \t\t\t  \t\t\t  \t   \tqux();
}`,
      output: `
function foo() {
  bar();
  baz();
  qux();
}`,
      options: [2],
      errors: expectedErrors([
        [3, '2 spaces', '2 spaces and 1 tab', 'ExpressionStatement'],
        [4, '2 spaces', '10 spaces and 9 tabs', 'ExpressionStatement']]),
    },
    {
      code: `
function foo() {
\tbar();
\t  baz();
  \t\t \t     \t   \t  \t\t\t qux();
}`,
      output: `
function foo() {
\tbar();
\tbaz();
\tqux();
}`,
      options: ['tab'],
      errors: expectedErrors('tab', [
        [3, '1 tab', '2 spaces and 1 tab', 'ExpressionStatement'],
        [4, '1 tab', '14 spaces and 8 tabs', 'ExpressionStatement']]),
    },
    {
      code: `
function foo() {
  bar();
\t\t}`,
      output: `
function foo() {
  bar();
}`,
      options: [2],
      errors: expectedErrors([[3, '0 spaces', '2 tabs', 'BlockStatement']]),
    },
  ],
});
