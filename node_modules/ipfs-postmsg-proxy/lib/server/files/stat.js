'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    stat: (0, _postmsgRpc.expose)('ipfs.files.stat', (0, _prepost.pre)(opts.pre('files.stat'), function () {
      var _getIpfs$files;

      return (_getIpfs$files = getIpfs().files).stat.apply(_getIpfs$files, arguments);
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');
//# sourceMappingURL=stat.js.map