# Human Standard Collectible ABI

A simple node module that exports the [Ethereum ABI][1] for [ERC 721][2] compatible tokens.

Requires the web3 API to be available, either by initailizing it yourself, or using a web3-injecting Javascript environment, like Geth, MetaMask, or Mist.

## Usage

``` javascript
var abi = require('human-standard-collectible-abi')

var collectible = web3.eth.contract(abi).at(contractAddress)
var tokenId = 12345
var addr = web3.eth.accounts[0]

// Get the token name
collectible.name.call(function(err, name) {
  if(err) { console.log(err) }
  if(name) { console.log('The collectible name is: ' + name) }
})

// Get the token symbol
collectible.symbol.call({from: addr}, function(err, symbol) {
  //ABI expects string here,
  if(err) { console.log(err) }
  console.log('Collectible symbol: ' + symbol)
})

collectible.tokenURI.call(tokenId, function(err, tokenURI) {
  console.log(tokenURI)
})

collectible.balanceOf.call(addr, function (err, bal) {
  if (err) { console.error(err) }
  console.log('balance is ' + bal.toString(10))
})

```

[1]: https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI
[2]: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md