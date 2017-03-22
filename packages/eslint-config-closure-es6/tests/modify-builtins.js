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


// ERROR: no-extend-native
Object.prototype.foo = 2;

// ERROR: no-extend-native
Function.prototype.foo = 2;

// ERROR: no-extend-native
Date.prototype.foo = 2;

// ERROR: no-extend-native
RegExp.prototype.foo = 2;

// ERROR: no-extend-native
Error.prototype.foo = 2;

// ERROR: no-extend-native
Number.prototype.foo = 2;

// ERROR: no-extend-native
String.prototype.foo = 2;

// ERROR: no-extend-native
Boolean.prototype.foo = 2;
