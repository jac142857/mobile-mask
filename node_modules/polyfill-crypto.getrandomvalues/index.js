var MersenneTwister = require('mersenne-twister')

var twister = new MersenneTwister(Math.random()*Number.MAX_SAFE_INTEGER)

module.exports = getRandomValues


function getRandomValues (abv) {
  var l = abv.length
  while (l--) {
    abv[l] = Math.floor(randomFloat() * 256)
  }
  return abv
}

function randomFloat() {
  return twister.random()
}