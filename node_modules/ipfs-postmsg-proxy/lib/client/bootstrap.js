'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    add: _callbackify2.default.variadic((0, _prepost.pre)((0, _multiaddr.preMultiaddrToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.bootstrap.add', opts), (0, _prepostArrayOf.postArrayOf)('Peers', _multiaddr.isMultiaddrJson, _multiaddr.multiaddrFromJson)))),
    list: (0, _callbackify2.default)((0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.bootstrap.list', opts), (0, _prepostArrayOf.postArrayOf)('Peers', _multiaddr.isMultiaddrJson, _multiaddr.multiaddrFromJson))),
    rm: _callbackify2.default.variadic((0, _prepost.pre)((0, _multiaddr.preMultiaddrToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.bootstrap.rm', opts), (0, _prepostArrayOf.postArrayOf)('Peers', _multiaddr.isMultiaddrJson, _multiaddr.multiaddrFromJson))))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _prepost = require('prepost');

var _prepostArrayOf = require('../serialization/utils/prepost-array-of');

var _multiaddr = require('../serialization/multiaddr');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=bootstrap.js.map