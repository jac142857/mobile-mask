const postCallNoop = (res) => res

// Alter the return value before it is passed back to the caller
export default function post (...args) {
  // Flatten args so that pre functions can be passed as arrays
  args = [].concat(...args)

  if (args.length < 2) {
    throw new Error('Two arguments required')
  } else if (args.length > 2) {
    args = [post(...args.slice(0, -1)), args[args.length - 1]]
  }

  const callFn = args[0]

  if (typeof callFn !== 'function') {
    throw new TypeError('Function to call must be a function')
  }

  const postFn = args[1] || postCallNoop

  if (typeof postFn !== 'function') {
    throw new TypeError('Post function must be a function')
  }

  return (...args) => {
    const res = callFn(...args)

    // If res is a promise, resolve it before passing it to postFn
    if (res && typeof res.then === 'function') {
      return res.then(postFn)
    }

    return postFn(res)
  }
}
