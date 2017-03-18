goog.scope(function() {

function foo() {
  return {
    a: [
      1, 2, 3,
    ],
    b: {
      c() {
        return () => {
          return 3;
        };
      },
    },
  };
}

foo();
});

let a = 2;

switch (a) {
  case 4:
    a++;
    break;
  default:
    a++;
}
