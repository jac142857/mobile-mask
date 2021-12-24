'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    gc: (0, _postmsgRpc.expose)('ipfs.repo.gc', (0, _prepost.pre)(opts.pre('repo.gc'), function () {
      var _getIpfs$repo;

      return (_getIpfs$repo = getIpfs().repo).gc.apply(_getIpfs$repo, arguments);
    }), opts),
    stat: (0, _postmsgRpc.expose)('ipfs.repo.stat', (0, _prepost.pre)(opts.pre('repo.stat'), (0, _prepost.post)(function () {
      var _getIpfs$repo2;

      return (_getIpfs$repo2 = getIpfs().repo).stat.apply(_getIpfs$repo2, arguments);
    }, function (stats) {
      if (stats) {
        if ((0, _big.isBig)(stats.numObjects)) {
          stats.numObjects = (0, _big.bigToJson)(stats.numObjects);
        }

        if ((0, _big.isBig)(stats.repoSize)) {
          stats.repoSize = (0, _big.bigToJson)(stats.repoSize);
        }

        if ((0, _big.isBig)(stats.storageMax)) {
          stats.storageMax = (0, _big.bigToJson)(stats.storageMax);
        }
      }

      return stats;
    })), opts),
    version: (0, _postmsgRpc.expose)('ipfs.repo.version', (0, _prepost.pre)(opts.pre('repo.version'), function () {
      return getIpfs().repo.version();
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _big = require('../serialization/big');
//# sourceMappingURL=repo.js.map