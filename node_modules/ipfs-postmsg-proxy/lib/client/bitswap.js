'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    ledger: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.bitswap.ledger', opts)),
    reprovide: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.bitswap.reprovide', opts)),
    stat: (0, _callbackify2.default)((0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.bitswap.stat', opts), function (stats) {
      if (stats) {
        if ((0, _big.isBigJson)(stats.blocksReceived)) {
          stats.blocksReceived = (0, _big.bigFromJson)(stats.blocksReceived);
        }

        if ((0, _big.isBigJson)(stats.dataReceived)) {
          stats.dataReceived = (0, _big.bigFromJson)(stats.dataReceived);
        }

        if ((0, _big.isBigJson)(stats.blocksSent)) {
          stats.blocksSent = (0, _big.bigFromJson)(stats.blocksSent);
        }

        if ((0, _big.isBigJson)(stats.dataSent)) {
          stats.dataSent = (0, _big.bigFromJson)(stats.dataSent);
        }

        if ((0, _big.isBigJson)(stats.dupBlksReceived)) {
          stats.dupBlksReceived = (0, _big.bigFromJson)(stats.dupBlksReceived);
        }

        if ((0, _big.isBigJson)(stats.dupDataReceived)) {
          stats.dupDataReceived = (0, _big.bigFromJson)(stats.dupDataReceived);
        }
      }

      return stats;
    })),
    unwant: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.bitswap.unwant', opts)),
    wantlist: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.bitswap.wantlist', opts))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _prepost = require('prepost');

var _big = require('../serialization/big');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=bitswap.js.map