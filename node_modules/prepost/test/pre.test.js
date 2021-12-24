import test from 'ava'
import { pre } from '../src'

test('should call a function before', (t) => {
  t.plan(4)

  const arg = 2

  const preFn = (n) => {
    t.pass('preFn function called')
    return [n * 2]
  }

  const fn = (n) => {
    t.pass('fn function called')
    t.is(n, 4, 'arg altered')
    return n
  }

  const result = pre(preFn, fn)(arg)

  t.is(result, 4, 'correct value returned')
})

test('should call an async function before', async (t) => {
  t.plan(4)

  const arg = 2

  const preFn = (n) => {
    t.pass('preFn function called')
    return new Promise((resolve) => {
      setTimeout(() => resolve([n * 2]), 50)
    })
  }

  const fn = (n) => {
    t.pass('fn function called')
    t.is(n, 4, 'arg altered')
    return n
  }

  const result = await pre(preFn, fn)(arg)

  t.is(result, 4, 'correct value returned')
})

test('should call multiple functions before', (t) => {
  t.plan(6)

  const arg0 = 2
  const arg1 = 3

  const preFn0 = (i, j) => {
    t.pass('preFn0 function called')
    return [i * 2, j]
  }

  const preFn1 = (i, j) => {
    t.pass('preFn1 function called')
    return [i, j * 2]
  }

  const fn = (i, j) => {
    t.pass('fn function called')
    t.is(i, 4, 'arg0 altered')
    t.is(j, 6, 'arg1 altered')
    return i + j
  }

  const result = pre(preFn0, preFn1, fn)(arg0, arg1)

  t.is(result, 10, 'correct value returned')
})

test('should allow null functions before', (t) => {
  t.plan(4)

  const arg0 = 2

  const preFn0 = (i) => {
    t.pass('preFn0 function called')
    return [i * 2]
  }

  const preFn1 = null

  const fn = (i) => {
    t.pass('fn function called')
    t.is(i, 4, 'arg0 altered')
    return i
  }

  const result = pre(preFn0, preFn1, fn)(arg0)

  t.is(result, 4, 'correct value returned')
})

test('should call multiple async functions before', async (t) => {
  t.plan(6)

  const arg0 = 2
  const arg1 = 3

  const preFn0 = (i, j) => {
    t.pass('preFn0 function called')
    return new Promise((resolve) => {
      setTimeout(() => resolve([i * 2, j]), 50)
    })
  }

  const preFn1 = (i, j) => {
    t.pass('preFn1 function called')
    return new Promise((resolve) => {
      setTimeout(() => resolve([i, j * 2]), 50)
    })
  }

  const fn = (i, j) => {
    t.pass('fn function called')
    t.is(i, 4, 'arg0 altered')
    t.is(j, 6, 'arg1 altered')
    return Promise.resolve(i + j)
  }

  const result = await pre(preFn0, preFn1, fn)(arg0, arg1)

  t.is(result, 10, 'correct value returned')
})

test('should call multiple sync and async functions before', async (t) => {
  t.plan(6)

  const arg0 = 2
  const arg1 = 3

  const preFn0 = (i, j) => {
    t.pass('preFn0 function called')
    return new Promise((resolve) => {
      setTimeout(() => resolve([i * 2, j]), 50)
    })
  }

  const preFn1 = null

  const preFn2 = (i, j) => {
    t.pass('preFn1 function called')
    return [i, j * 2]
  }

  const fn = (i, j) => {
    t.pass('fn function called')
    t.is(i, 4, 'arg0 altered')
    t.is(j, 6, 'arg1 altered')
    return Promise.resolve(i + j)
  }

  const result = await pre(preFn0, preFn1, preFn2, fn)(arg0, arg1)

  t.is(result, 10, 'correct value returned')
})

test('should allow null preFn', (t) => {
  t.plan(2)

  const arg = 2
  const preFn = null

  const fn = (n) => {
    t.pass('fn function called')
    return n
  }

  const result = pre(preFn, fn)(arg)

  t.is(result, 2, 'correct value returned')
})

test('should not allow non function preFn', (t) => {
  t.plan(1)
  const fn = () => {}
  const preFn = 'string'
  t.throws(() => pre(preFn, fn)(), TypeError, 'non function preFn throws')
})

test('should not allow no preFn', (t) => {
  t.plan(1)
  const fn = () => {}
  t.throws(() => pre(fn)(), Error, 'no preFn throws')
})

test('should not allow no fn', (t) => {
  t.plan(1)
  t.throws(() => pre()(), Error, 'no fn throws')
})

test('should not allow non function fn', (t) => {
  t.plan(1)
  const preFn = (...args) => args
  const fn = 138
  t.throws(() => pre(preFn, fn)(), TypeError, 'non function fn throws')
})

test('should allow passing pre functions as an array', (t) => {
  t.plan(24)

  const arg = 2

  const preFn0 = (n) => {
    t.pass('preFn0 function called')
    return [n * 2]
  }

  const preFn1 = (n) => {
    t.pass('preFn1 function called')
    return [n * 3]
  }

  const preFn2 = (n) => {
    t.pass('preFn2 function called')
    return [n * 4]
  }

  const fn = (n) => {
    t.pass('fn function called')
    t.is(n, 48, 'arg altered')
    return n
  }

  let result

  result = pre([preFn0, preFn1, preFn2], fn)(arg)
  t.is(result, 48, 'correct value returned')

  result = pre(preFn0, [preFn1, preFn2], fn)(arg)
  t.is(result, 48, 'correct value returned')

  result = pre([preFn0, preFn1, preFn2, fn])(arg)
  t.is(result, 48, 'correct value returned')

  result = pre(preFn0, preFn1, [preFn2, fn])(arg)
  t.is(result, 48, 'correct value returned')
})
