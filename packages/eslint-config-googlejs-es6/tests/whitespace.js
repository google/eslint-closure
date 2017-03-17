// ERROR: no-multi-spaces
let a  = () => 2;

// ERROR: no-multi-spaces
a =  () => 2;

// ERROR: no-tabs
a =	() => 2;

// ERROR: space-in-parens
if (a ) a++;

// ERROR: max-statements-per-line
a++; a--;

// ERROR: spaced-comment
//aa

a();
