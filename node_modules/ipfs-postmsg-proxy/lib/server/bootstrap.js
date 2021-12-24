'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    add: (0, _postmsgRpc.expose)('ipfs.bootstrap.add', (0, _prepost.pre)(opts.pre('bootstrap.add'), (0, _prepost.post)(function () {
      var _getIpfs$bootstrap;

      return (_getIpfs$bootstrap = getIpfs().bootstrap).add.apply(_getIpfs$bootstrap, arguments);
    }, (0, _prepostArrayOf.postArrayOf)('Peers', _multiaddr.isMultiaddr, _multiaddr.multiaddrToJson))), opts),
    list: (0, _postmsgRpc.expose)('ipfs.bootstrap.list', (0, _prepost.pre)(opts.pre('bootstrap.list'), (0, _prepost.post)(function () {
      var _getIpfs$bootstrap2;

      return (_getIpfs$bootstrap2 = getIpfs().bootstrap).list.apply(_getIpfs$bootstrap2, arguments);
    }, (0, _prepostArrayOf.postArrayOf)('Peers', _multiaddr.isMultiaddr, _multiaddr.multiaddrToJson))), opts),
    rm: (0, _postmsgRpc.expose)('ipfs.bootstrap.rm', (0, _prepost.pre)(opts.pre('bootstrap.rm'), (0, _prepost.post)(function () {
      var _getIpfs$bootstrap3;

      return (_getIpfs$bootstrap3 = getIpfs().bootstrap).rm.apply(_getIpfs$bootstrap3, arguments);
    }, (0, _prepostArrayOf.postArrayOf)('Peers', _multiaddr.isMultiaddr, _multiaddr.multiaddrToJson))), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _prepostArrayOf = require('../serialization/utils/prepost-array-of');

var _multiaddr = require('../serialization/multiaddr');
//# sourceMappingURL=bootstrap.js.map