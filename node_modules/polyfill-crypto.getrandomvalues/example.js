const getRandomValues = require('./index.js')

var typedArray = new Uint8Array(16)
getRandomValues(typedArray)
console.log(typedArray)
