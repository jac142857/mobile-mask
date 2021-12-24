'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    peers: (0, _postmsgRpc.expose)('ipfs.swarm.peers', (0, _prepost.pre)(opts.pre('swarm.peers'), (0, _prepost.post)(function () {
      var _getIpfs$swarm;

      return (_getIpfs$swarm = getIpfs().swarm).peers.apply(_getIpfs$swarm, arguments);
    }, function (res) {
      return res.map(function (item) {
        item.addr = (0, _multiaddr.multiaddrToJson)(item.addr);
        // https://github.com/ipfs/js-ipfs/issues/1248
        if ((0, _peer.isPeerInfo)(item.peer)) {
          item.peer = (0, _peer.peerInfoToJson)(item.peer);
        } else if ((0, _peer.isPeerId)(item.peer)) {
          item.peer = (0, _peer.peerIdToJson)(item.peer);
        }
        return item;
      });
    })), opts),
    addrs: (0, _postmsgRpc.expose)('ipfs.swarm.addrs', (0, _prepost.pre)(opts.pre('swarm.addrs'), (0, _prepost.post)(function () {
      return getIpfs().swarm.addrs();
    }, function (res) {
      return res.map(_peer.peerInfoToJson);
    })), opts),
    localAddrs: (0, _postmsgRpc.expose)('ipfs.swarm.localAddrs', (0, _prepost.pre)(opts.pre('swarm.localAddrs'), (0, _prepost.post)(function () {
      return getIpfs().swarm.localAddrs();
    }, function (res) {
      return res.map(_multiaddr.multiaddrToJson);
    })), opts),
    connect: (0, _postmsgRpc.expose)('ipfs.swarm.connect', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _multiaddr.preMultiaddrFromJson)(0), opts.pre('swarm.connect'), function () {
      var _getIpfs$swarm2;

      return (_getIpfs$swarm2 = getIpfs().swarm).connect.apply(_getIpfs$swarm2, arguments);
    }), opts),
    disconnect: (0, _postmsgRpc.expose)('ipfs.swarm.disconnect', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _multiaddr.preMultiaddrFromJson)(0), opts.pre('swarm.disconnect'), function () {
      var _getIpfs$swarm3;

      return (_getIpfs$swarm3 = getIpfs().swarm).disconnect.apply(_getIpfs$swarm3, arguments);
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _peer = require('../serialization/peer');

var _multiaddr = require('../serialization/multiaddr');

var _buffer = require('../serialization/buffer');
//# sourceMappingURL=swarm.js.map