'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    ledger: (0, _postmsgRpc.expose)('ipfs.bitswap.ledger', function () {
      var _getIpfs$bitswap;

      return (_getIpfs$bitswap = getIpfs().bitswap).ledger.apply(_getIpfs$bitswap, arguments);
    }, opts),
    reprovide: (0, _postmsgRpc.expose)('ipfs.bitswap.reprovide', function () {
      var _getIpfs$bitswap2;

      return (_getIpfs$bitswap2 = getIpfs().bitswap).reprovide.apply(_getIpfs$bitswap2, arguments);
    }, opts),
    stat: (0, _postmsgRpc.expose)('ipfs.bitswap.stat', (0, _prepost.post)(function () {
      var _getIpfs$bitswap3;

      return (_getIpfs$bitswap3 = getIpfs().bitswap).stat.apply(_getIpfs$bitswap3, arguments);
    }, function (stats) {
      if (stats) {
        if ((0, _big.isBig)(stats.blocksReceived)) {
          stats.blocksReceived = (0, _big.bigToJson)(stats.blocksReceived);
        }

        if ((0, _big.isBig)(stats.dataReceived)) {
          stats.dataReceived = (0, _big.bigToJson)(stats.dataReceived);
        }

        if ((0, _big.isBig)(stats.blocksSent)) {
          stats.blocksSent = (0, _big.bigToJson)(stats.blocksSent);
        }

        if ((0, _big.isBig)(stats.dataSent)) {
          stats.dataSent = (0, _big.bigToJson)(stats.dataSent);
        }

        if ((0, _big.isBig)(stats.dupBlksReceived)) {
          stats.dupBlksReceived = (0, _big.bigToJson)(stats.dupBlksReceived);
        }

        if ((0, _big.isBig)(stats.dupDataReceived)) {
          stats.dupDataReceived = (0, _big.bigToJson)(stats.dupDataReceived);
        }
      }

      return stats;
    }), opts),
    unwant: (0, _postmsgRpc.expose)('ipfs.bitswap.unwant', function () {
      var _getIpfs$bitswap4;

      return (_getIpfs$bitswap4 = getIpfs().bitswap).unwant.apply(_getIpfs$bitswap4, arguments);
    }, opts),
    wantlist: (0, _postmsgRpc.expose)('ipfs.bitswap.wantlist', function () {
      var _getIpfs$bitswap5;

      return (_getIpfs$bitswap5 = getIpfs().bitswap).wantlist.apply(_getIpfs$bitswap5, arguments);
    }, opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _big = require('../serialization/big');
//# sourceMappingURL=bitswap.js.map