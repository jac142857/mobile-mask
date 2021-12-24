import test from 'ava'
import { post } from '../src'

test('should call a function after', (t) => {
  t.plan(3)

  const arg = 2

  const fn = (n) => {
    t.pass('fn function called')
    return n
  }

  const postFn = (n) => {
    t.pass('postFn function called')
    return n * 2
  }

  const result = post(fn, postFn)(arg)

  t.is(result, 4, 'correct value returned')
})

test('should call an async function after', async (t) => {
  t.plan(3)

  const arg = 2

  const fn = (n) => {
    t.pass('fn function called')
    return new Promise((resolve) => {
      setTimeout(() => resolve(n), 50)
    })
  }

  const postFn = (n) => {
    t.pass('postFn function called')
    return new Promise((resolve) => {
      setTimeout(() => resolve(n * 2), 50)
    })
  }

  const result = await post(fn, postFn)(arg)

  t.is(result, 4, 'correct value returned')
})

test('should call multiple functions after', (t) => {
  t.plan(6)

  const arg = 2

  const postFn0 = (n) => {
    t.pass('postFn0 function called')
    t.is(n, 4)
    return n * 2
  }

  const postFn1 = (n) => {
    t.pass('postFn1 function called')
    t.is(n, 8)
    return n * 10
  }

  const fn = (n) => {
    t.pass('fn function called')
    return n * 2
  }

  const result = post(fn, postFn0, postFn1)(arg)

  t.is(result, 80, 'correct value returned')
})

test('should allow null functions after', (t) => {
  t.plan(4)

  const arg = 2

  const fn = (n) => {
    t.pass('fn function called')
    return n * 2
  }

  const postFn0 = (n) => {
    t.pass('postFn0 function called')
    t.is(n, 4)
    return n * 2
  }

  const postFn1 = null

  const result = post(fn, postFn0, postFn1)(arg)

  t.is(result, 8, 'correct value returned')
})

test('should call multiple sync and async functions after', async (t) => {
  t.plan(7)

  const arg = 2

  const fn = (n) => {
    t.pass('fn function called')
    return n * 2
  }

  const postFn0 = (n) => {
    t.pass('postFn0 function called')
    t.is(n, 4)
    return n * 2
  }

  const postFn1 = (n) => {
    t.pass('postFn1 function called')
    return n
  }

  const postFn2 = (n) => {
    t.pass('postFn2 function called')
    t.is(n, 8)
    return new Promise((resolve) => {
      setTimeout(() => resolve(n * 10), 50)
    })
  }

  const result = await post(fn, postFn0, postFn1, postFn2)(arg)

  t.is(result, 80, 'correct value returned')
})

test('should allow null postFn', (t) => {
  t.plan(2)

  const arg = 2

  const fn = (n) => {
    t.pass('fn function called')
    return n
  }

  const postFn = null

  const result = post(fn, postFn)(arg)

  t.is(result, 2, 'correct value returned')
})

test('should not allow non function postFn', (t) => {
  t.plan(1)
  const fn = () => {}
  const postFn = 'string'
  t.throws(() => post(fn, postFn)(), TypeError, 'non function postFn throws')
})

test('should not allow no postFn', (t) => {
  t.plan(1)
  const fn = () => {}
  t.throws(() => post(fn)(), Error, 'no postFn throws')
})

test('should not allow no fn', (t) => {
  t.plan(1)
  t.throws(() => post()(), Error, 'no fn throws')
})

test('should not allow non function fn', (t) => {
  t.plan(1)
  const pre = (...args) => args
  const fn = 138
  t.throws(() => post(fn, pre)(), TypeError, 'non function fn throws')
})

test('should allow passing post functions as an array', (t) => {
  t.plan(32)

  const arg = 2

  const fn = (n) => {
    t.pass('fn function called')
    return n
  }

  const postFn0 = (n) => {
    t.pass('postFn0 function called')
    t.is(n, 2)
    return n * 2
  }

  const postFn1 = (n) => {
    t.pass('postFn1 function called')
    t.is(n, 4)
    return n * 3
  }

  const postFn2 = (n) => {
    t.pass('postFn2 function called')
    t.is(n, 12)
    return n * 4
  }

  let result

  result = post(fn, [postFn0, postFn1, postFn2])(arg)
  t.is(result, 48, 'correct value returned')

  result = post(fn, postFn0, [postFn1, postFn2])(arg)
  t.is(result, 48, 'correct value returned')

  result = post([fn, postFn0, postFn1, postFn2])(arg)
  t.is(result, 48, 'correct value returned')

  result = post([fn, postFn0], postFn1, postFn2)(arg)
  t.is(result, 48, 'correct value returned')
})
