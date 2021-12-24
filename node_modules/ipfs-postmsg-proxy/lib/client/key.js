'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    export: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.key.export', opts)),
    gen: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.key.gen', opts)),
    import: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.key.import', opts)),
    list: (0, _callbackify2.default)((0, _postmsgRpc.caller)('ipfs.key.list', opts)),
    rename: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.key.rename', opts)),
    rm: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.key.rm', opts))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=key.js.map