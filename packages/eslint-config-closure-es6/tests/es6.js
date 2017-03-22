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


const a = 2;

// ERROR: no-var
var b = 3;

const obj = {
  a,
  b() {
    return 2;
  },
};

// ERROR: prefer-const
let e = 4;

const {a: c, b: d} = obj;

const g = [1, 2, 3];

const [x, y, ...z] = g;

const foo = (a) => a;
foo(obj, a, b, c, d, e, x, y, z);


foo.bind(null);
