'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    publish: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.name.publish', opts)),
    resolve: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.name.resolve', opts))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=name.js.map