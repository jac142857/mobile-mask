'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    add: (0, _postmsgRpc.expose)('ipfs.pin.add', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('pin.add'), function () {
      var _getIpfs$pin;

      return (_getIpfs$pin = getIpfs().pin).add.apply(_getIpfs$pin, arguments);
    }), opts),
    rm: (0, _postmsgRpc.expose)('ipfs.pin.rm', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('pin.rm'), function () {
      var _getIpfs$pin2;

      return (_getIpfs$pin2 = getIpfs().pin).rm.apply(_getIpfs$pin2, arguments);
    }), opts),
    ls: (0, _postmsgRpc.expose)('ipfs.pin.ls', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('pin.ls'), function () {
      var _getIpfs$pin3;

      return (_getIpfs$pin3 = getIpfs().pin).ls.apply(_getIpfs$pin3, arguments);
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _cid = require('../serialization/cid');

var _buffer = require('../serialization/buffer');
//# sourceMappingURL=pin.js.map