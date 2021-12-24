'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    set: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(1), (0, _postmsgRpc.caller)('ipfs.config.set', opts))),
    get: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.config.get', opts)),
    replace: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.config.replace', opts))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _prepost = require('prepost');

var _buffer = require('../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=config.js.map