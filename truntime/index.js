function* p() {
  yield 1;
  yield 2;
}

global.foo = function foo() {
  console.log('libfoo initialization');
  for (let x of p()) {
    console.log(x);
  }
  console.log('libfoo initialization complete');
};
