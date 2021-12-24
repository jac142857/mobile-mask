'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    put: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _block.preBlockToJson)(0), function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[1] && args[1].cid) {
        args[1].cid = (0, _cid.cidToJson)(args[1].cid);
      }

      return args;
    }, (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.block.put', opts), _block.blockFromJson))),
    get: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.block.get', opts), _block.blockFromJson))),
    stat: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _postmsgRpc.caller)('ipfs.block.stat', opts)))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _prepost = require('prepost');

var _block = require('../serialization/block');

var _cid = require('../serialization/cid');

var _buffer = require('../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=block.js.map