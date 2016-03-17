This repo is an example of a bug between Babel 6 and core-js.

Instructions:

```
npm install
npm run build
```

then open index.html and look at the browser console.

Issue:

Babel-transpiled generator and async functions throw the error "Can't find
variable: regeneratorRuntime".

Conditions:

* There is no `global.Symbol` and
`Object.prototype.toString.call(window) === "[object Window]"`. This is the
case in Safari <= 8 and likely IE.
* The babel-polyfill package has been executed in the page. This could be done
by a website's main javascript (which does *not* use the "transform-runtime"
babel plugin) for example.
* A Babel-transpiled generator or async function that was transpiled with the
"transform-runtime" babel plugin has executed within the page. This might be a
third-party module installed from NPM which did this so that the application
that used it wasn't required to use any specific global polyfill.
* At this point, `global.regeneratorRuntime` will be unset, and
Babel-transpiled generator or async function that did not use the
"transform-runtime" babel plugin will throw the error "Can't find variable:
regeneratorRuntime".

Causes:

When `global.Symbol` and
`Object.prototype.toString.call(window) === "[object Window]"`, when
babel-polyfill is imported, core-js 2.x (used by babel-polyfill since Babel 6)
replaces `Object.getOwnPropertyNames` with a function which when passed a
Window object, always returns the original property names that `window` was
seen with, not the current property names.

babel-polyfill sets `global.regeneratorRuntime`.

When a module using the transform-runtime plugin with a generator or async
function runs, babel-runtime runs regenerator, which uses
`Object.getOwnPropertyNames` on `window` to check if
`global.regeneratorRuntime` was already set. However, the function returns
false because it wasn't set when `Object.getOwnPropertyNames` was replaced.
Regenerator then runs a file that sets `global.regeneratorRuntime`, and then it
reverts the global to how Regenerator believed it was before Regenerator ran
now.

Possible Solution:

From https://github.com/zloirock/core-js/issues/76, it appears that core-js
overrides `Object.getOwnPropertyNames` because in IE11, the native function
sometimes throws errors when passed an iframe or other window. A possible fix
would be to make `Object.getOwnPropertyNames` only use its special-case
behavior if it's passed a Window object that is not equal to the global
`window`, such as an iframe or other window.
