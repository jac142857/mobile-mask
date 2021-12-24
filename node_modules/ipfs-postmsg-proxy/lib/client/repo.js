'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    gc: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.repo.gc', opts)),
    stat: _callbackify2.default.variadic((0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.repo.stat', opts), function (stats) {
      if (stats) {
        if ((0, _big.isBigJson)(stats.numObjects)) {
          stats.numObjects = (0, _big.bigFromJson)(stats.numObjects);
        }

        if ((0, _big.isBigJson)(stats.repoSize)) {
          stats.repoSize = (0, _big.bigFromJson)(stats.repoSize);
        }

        if ((0, _big.isBigJson)(stats.storageMax)) {
          stats.storageMax = (0, _big.bigFromJson)(stats.storageMax);
        }
      }

      return stats;
    })),
    version: (0, _callbackify2.default)((0, _postmsgRpc.caller)('ipfs.repo.version', opts))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _prepost = require('prepost');

var _big = require('../serialization/big');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=repo.js.map