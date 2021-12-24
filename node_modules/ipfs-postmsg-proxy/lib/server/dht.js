'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    put: (0, _postmsgRpc.expose)('ipfs.dht.put', (0, _prepost.pre)(opts.pre('dht.put'), function () {
      var _getIpfs$dht;

      return (_getIpfs$dht = getIpfs().dht).put.apply(_getIpfs$dht, arguments);
    }), opts),
    get: (0, _postmsgRpc.expose)('ipfs.dht.get', (0, _prepost.pre)(opts.pre('dht.get'), function () {
      var _getIpfs$dht2;

      return (_getIpfs$dht2 = getIpfs().dht).get.apply(_getIpfs$dht2, arguments);
    }), opts),
    findprovs: (0, _postmsgRpc.expose)('ipfs.dht.findprovs', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), opts.pre('dht.findprovs'), (0, _prepost.post)(function () {
      var _getIpfs$dht3;

      return (_getIpfs$dht3 = getIpfs().dht).findprovs.apply(_getIpfs$dht3, arguments);
    }, function (res) {
      return res.map(function (item) {
        return (0, _peer.isPeerInfo)(item) ? (0, _peer.peerInfoToJson)(item) : item;
      });
    })), opts),
    findpeer: (0, _postmsgRpc.expose)('ipfs.dht.findpeer', (0, _prepost.pre)((0, _peer.prePeerIdFromJson)(0), opts.pre('dht.findpeer'), (0, _prepost.post)(function () {
      var _getIpfs$dht4;

      return (_getIpfs$dht4 = getIpfs().dht).findpeer.apply(_getIpfs$dht4, arguments);
    }, function (res) {
      return (0, _peer.isPeerInfo)(res) ? (0, _peer.peerInfoToJson)(res) : res;
    })), opts),
    provide: (0, _postmsgRpc.expose)('ipfs.dht.provide', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _buffer.preArrayOfBufferFromJson)(0), (0, _cid.preCidFromJson)(0), (0, _cid.preArrayOfCidFromJson)(0), opts.pre('dht.provide'), (0, _prepost.post)(function () {
      var _getIpfs$dht5;

      return (_getIpfs$dht5 = getIpfs().dht).provide.apply(_getIpfs$dht5, arguments);
    },
    // js-ipfs returns undefined
    // js-ipfs-api -> go-ipfs returns the request stream, with no data
    //
    // https://ipfs.io/docs/api/#api-v0-dht-provide
    // ^ Docs say some response should be sent, but nothing is returned in
    // current implementations.
    //
    // Returning null here so structured clone doesn't error trying to clone
    // a stream.
    function () {
      return null;
    })), opts),
    query: (0, _postmsgRpc.expose)('ipfs.dht.query', (0, _prepost.pre)((0, _peer.prePeerIdFromJson)(0), opts.pre('dht.query'), (0, _prepost.post)(function () {
      var _getIpfs$dht6;

      return (_getIpfs$dht6 = getIpfs().dht).query.apply(_getIpfs$dht6, arguments);
    }, function (res) {
      return res.map(function (item) {
        return (0, _peer.isPeerInfo)(item) ? (0, _peer.peerInfoToJson)(item) : item;
      });
    })), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _cid = require('../serialization/cid');

var _peer = require('../serialization/peer');

var _buffer = require('../serialization/buffer');
//# sourceMappingURL=dht.js.map