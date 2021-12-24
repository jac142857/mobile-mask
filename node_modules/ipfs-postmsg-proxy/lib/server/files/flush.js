'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    flush: (0, _postmsgRpc.expose)('ipfs.files.flush', (0, _prepost.pre)(opts.pre('files.flush'), (0, _prepost.post)(function () {
      var _getIpfs$files;

      return (_getIpfs$files = getIpfs().files).flush.apply(_getIpfs$files, arguments);
    }, function () {
      return null;
    })), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');
//# sourceMappingURL=flush.js.map