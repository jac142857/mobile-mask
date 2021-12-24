'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    mkdir: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.files.mkdir', opts))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=mkdir.js.map