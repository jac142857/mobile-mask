'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    put: (0, _postmsgRpc.expose)('ipfs.block.put', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _block.preBlockFromJson)(0), function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[1] && args[1].cid) {
        args[1].cid = (0, _cid.cidFromJson)(args[1].cid);
      }

      return args;
    }, opts.pre('block.put'), (0, _prepost.post)(function () {
      var _getIpfs$block;

      return (_getIpfs$block = getIpfs().block).put.apply(_getIpfs$block, arguments);
    }, _block.blockToJson)), opts),
    get: (0, _postmsgRpc.expose)('ipfs.block.get', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('block.get'), (0, _prepost.post)(function () {
      var _getIpfs$block2;

      return (_getIpfs$block2 = getIpfs().block).get.apply(_getIpfs$block2, arguments);
    }, _block.blockToJson)), opts),
    stat: (0, _postmsgRpc.expose)('ipfs.block.stat', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('block.stat'), function () {
      var _getIpfs$block3;

      return (_getIpfs$block3 = getIpfs().block).stat.apply(_getIpfs$block3, arguments);
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _block = require('../serialization/block');

var _cid = require('../serialization/cid');

var _buffer = require('../serialization/buffer');
//# sourceMappingURL=block.js.map