let a = [1, 2];
a = [
  1,
  // ERROR: comma-dangle
  2
];

const foo = () => 5;
foo(a);
