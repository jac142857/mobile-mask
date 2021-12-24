'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    ls: (0, _postmsgRpc.expose)('ipfs.files.ls', (0, _prepost.pre)(opts.pre('files.ls'), function () {
      var _getIpfs$files;

      return (_getIpfs$files = getIpfs().files).ls.apply(_getIpfs$files, arguments);
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');
//# sourceMappingURL=ls.js.map