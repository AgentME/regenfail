import 'babel-polyfill';
import './truntime';

var g = function*() {
  yield 1;
  yield 2;
};

for (let x of g()) {
  console.log('x', x);
}
