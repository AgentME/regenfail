import 'babel-core/polyfill';

var g = function*() {
  yield 1;
  yield 2;
};

setTimeout(() => {
  for (let x of g()) {
    console.log('x', x);
  }
}, 500);
