const preCallNoop = (...args) => args

// Alter the arguments before they are passed to the function
export default function pre (...args) {
  // Flatten args so that pre functions can be passed as arrays
  args = [].concat(...args)

  if (args.length < 2) {
    throw new Error('Two arguments required')
  } else if (args.length > 2) {
    args = [args[0], pre(...args.slice(1))]
  }

  const preFn = args[0] || preCallNoop

  if (typeof preFn !== 'function') {
    throw new TypeError('Pre function must be a function')
  }

  const callFn = args[1]

  if (typeof callFn !== 'function') {
    throw new TypeError('Function to call must be a function')
  }

  return (...args) => {
    args = preFn(...args)

    if (Array.isArray(args)) {
      return callFn(...args)
    }

    // Args can be a promise which should be resolved before callFn is called
    return args.then((args) => callFn(...args))
  }
}
