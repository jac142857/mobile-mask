'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    publish: (0, _postmsgRpc.expose)('ipfs.name.publish', (0, _prepost.pre)(opts.pre('name.publish'), function () {
      var _getIpfs$name;

      return (_getIpfs$name = getIpfs().name).publish.apply(_getIpfs$name, arguments);
    }), opts),
    resolve: (0, _postmsgRpc.expose)('ipfs.name.resolve', (0, _prepost.pre)(opts.pre('name.resolve'), function () {
      var _getIpfs$name2;

      return (_getIpfs$name2 = getIpfs().name).resolve.apply(_getIpfs$name2, arguments);
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');
//# sourceMappingURL=name.js.map