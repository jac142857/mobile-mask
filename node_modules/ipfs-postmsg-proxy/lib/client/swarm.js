'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    peers: _callbackify2.default.variadic((0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.swarm.peers', opts), function (res) {
      return Promise.all(res.map(function (item) {
        item.addr = (0, _multiaddr.multiaddrFromJson)(item.addr);

        // https://github.com/ipfs/js-ipfs/issues/1248
        if ((0, _peer.isPeerInfoJson)(item.peer)) {
          return (0, _peer.peerInfoFromJson)(item.peer).then(function (peerInfo) {
            item.peer = peerInfo;
            return item;
          });
        } else if ((0, _peer.isPeerIdJson)(item.peer)) {
          return (0, _peer.peerIdFromJson)(item.peer).then(function (peerId) {
            item.peer = peerId;
            return item;
          });
        }

        return Promise.resolve(item);
      }));
    })),
    addrs: (0, _callbackify2.default)((0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.swarm.addrs', opts), function (res) {
      return Promise.all(res.map(_peer.peerInfoFromJson));
    })),
    localAddrs: (0, _callbackify2.default)((0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.swarm.localAddrs', opts), function (res) {
      return res.map(_multiaddr.multiaddrFromJson);
    })),
    connect: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _multiaddr.preMultiaddrToJson)(0), (0, _postmsgRpc.caller)('ipfs.swarm.connect', opts))),
    disconnect: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _multiaddr.preMultiaddrToJson)(0), (0, _postmsgRpc.caller)('ipfs.swarm.disconnect', opts)))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _prepost = require('prepost');

var _peer = require('../serialization/peer');

var _multiaddr = require('../serialization/multiaddr');

var _buffer = require('../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=swarm.js.map