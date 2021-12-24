'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    put: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.dht.put', opts)),
    get: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.dht.get', opts)),
    findprovs: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.dht.findprovs', opts), function (res) {
      return Promise.all(res.map(function (item) {
        return (0, _peer.isPeerInfo)(item) ? (0, _peer.peerInfoFromJson)(item) : Promise.resolve(item);
      }));
    }))),
    findpeer: _callbackify2.default.variadic((0, _prepost.pre)((0, _peer.prePeerIdToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.dht.findpeer', opts), function (res) {
      return (0, _peer.isPeerInfo)(res) ? (0, _peer.peerInfoFromJson)(res) : res;
    }))),
    provide: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _buffer.preArrayOfBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _cid.preArrayOfCidToJson)(0), (0, _postmsgRpc.caller)('ipfs.dht.provide', opts))),
    query: _callbackify2.default.variadic((0, _prepost.pre)((0, _peer.prePeerIdToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.dht.query', opts), function (res) {
      return Promise.all(res.map(function (item) {
        return (0, _peer.isPeerInfo)(item) ? (0, _peer.peerInfoFromJson)(item) : Promise.resolve(item);
      }));
    })))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _prepost = require('prepost');

var _cid = require('../serialization/cid');

var _peer = require('../serialization/peer');

var _buffer = require('../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=dht.js.map