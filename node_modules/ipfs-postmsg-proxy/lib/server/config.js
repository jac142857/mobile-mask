'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    set: (0, _postmsgRpc.expose)('ipfs.config.set', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(1), opts.pre('config.set'), function () {
      var _getIpfs$config;

      return (_getIpfs$config = getIpfs().config).set.apply(_getIpfs$config, arguments);
    }), opts),
    get: (0, _postmsgRpc.expose)('ipfs.config.get', (0, _prepost.pre)(opts.pre('config.get'), function () {
      var _getIpfs$config2;

      return (_getIpfs$config2 = getIpfs().config).get.apply(_getIpfs$config2, arguments);
    }), opts),
    replace: (0, _postmsgRpc.expose)('ipfs.config.replace', (0, _prepost.pre)(opts.pre('config.replace'), function () {
      var _getIpfs$config3;

      return (_getIpfs$config3 = getIpfs().config).set.apply(_getIpfs$config3, arguments);
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _buffer = require('../serialization/buffer');
//# sourceMappingURL=config.js.map