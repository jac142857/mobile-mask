# prepost

[![Build Status](https://travis-ci.org/tableflip/prepost.svg?branch=master)](https://travis-ci.org/tableflip/prepost) [![dependencies Status](https://david-dm.org/tableflip/prepost/status.svg)](https://david-dm.org/tableflip/prepost) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Alter arguments and return values before and after a function is called

## Install

```sh
npm install prepost
```

## Usage

Alter arguments to a function:

```js
import { pre } from 'prepost'

const add = (a, b) =>  a + b
const doubleAdd = pre((a, b) => [a * 2, b * 2], add)

add(1, 2) // -> 3
doubleAdd(1, 2) // -> 6
```

Alter return value from a function:

```js
import { post } from 'prepost'

const add = (a, b) =>  a + b
const doubleAdd = post(add, res => res * 2)

add(1, 2) // -> 3
doubleAdd(1, 2) // -> 6
```

Async alter arguments:

```js
import { pre } from 'prepost'

const add = (a, b) =>  a + b
const doubleAdd = pre(
  (a, b) => new Promise(resolve => setTimeout(resolve([a * 2, b * 2]), 1000)),
  add
)

add(1, 2) // -> 3
await doubleAdd(1, 2) // -> 6
```

Async alter return value:

```js
import { post } from 'prepost'

const add = (a, b) =>  a + b
const doubleAdd = post(
  add,
  res => new Promise(resolve => setTimeout(resolve(res * 2), 1000))
)

add(1, 2) // -> 3
await doubleAdd(1, 2) // -> 6
```

## API

#### `pre(preFunc, [preFunc1, preFunc2, ...,] func)`

* `preFunc` - function (or array of functions) to call before `func`. It is passed arguments as they would be if calling `func` normally. `preFunc` **must** return an array of arguments **or** a promise that resolves to an array.
* `preFunc1, preFunc2, ...` - other functions to call in series before `func`. The altered arguments from `preFunc` are passed to `preFunc1` and so on.
* `func` - function to call after all the pre-functions have run and altered arguments

Returns a function that when called will call all the pre-functions in order before finally calling `func`.

NOTE: If any one of your pre functions returns a promise then the function returned by `pre` becomes async (returns a promise), regardless of whether `func` was already async or not.

#### `post(func, postFunc [, postFunc1, postFunc2, ...])`

* `func` - function to call and pass return value to `postFunc`
* `postFunc` - function (or array of functions) to call after `func`. It is passed the return value as it's first argument. If `func` returns a promise, this is first resolved before `postFunc` is called. `preFunc` should return the altered return value from `func` **or** a promise that resolves to the return value.
* `postFunc1, postFunc2, ...` - other functions to call in series after `func`. The altered return value from `postFunc` is passed to `postFunc1` and so on.

Returns a function that when called will call all the post-functions in order after calling `func`.

NOTE: If any one of your post functions returns a promise then the function returned by `post` becomes async (returns a promise), regardless of whether `func` was already async or not.

## Contribute

Feel free to dive in! [Open an issue](https://github.com/tableflip/prepost/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw

