
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
