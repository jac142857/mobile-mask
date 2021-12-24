'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    write: (0, _postmsgRpc.expose)('ipfs.files.write', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(1), opts.pre('files.write'), function () {
      var _getIpfs$files;

      return (_getIpfs$files = getIpfs().files).write.apply(_getIpfs$files, arguments);
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _buffer = require('../../serialization/buffer');
//# sourceMappingURL=write.js.map