'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeProxyServer = closeProxyServer;

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _bitswap = require('./bitswap');

var _bitswap2 = _interopRequireDefault(_bitswap);

var _block = require('./block');

var _block2 = _interopRequireDefault(_block);

var _bootstrap = require('./bootstrap');

var _bootstrap2 = _interopRequireDefault(_bootstrap);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _dag = require('./dag');

var _dag2 = _interopRequireDefault(_dag);

var _dht = require('./dht');

var _dht2 = _interopRequireDefault(_dht);

var _files = require('./files');

var _files2 = _interopRequireDefault(_files);

var _key = require('./key');

var _key2 = _interopRequireDefault(_key);

var _ls = require('./ls');

var _ls2 = _interopRequireDefault(_ls);

var _name = require('./name');

var _name2 = _interopRequireDefault(_name);

var _object = require('./object');

var _object2 = _interopRequireDefault(_object);

var _pin = require('./pin');

var _pin2 = _interopRequireDefault(_pin);

var _ping = require('./ping');

var _ping2 = _interopRequireDefault(_ping);

var _pubsub = require('./pubsub');

var _pubsub2 = _interopRequireDefault(_pubsub);

var _repo = require('./repo');

var _repo2 = _interopRequireDefault(_repo);

var _stats = require('./stats');

var _stats2 = _interopRequireDefault(_stats);

var _swarm = require('./swarm');

var _swarm2 = _interopRequireDefault(_swarm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (getIpfs, opts) {
  opts = opts || {};

  if (typeof opts.pre !== 'function') {
    var preObj = opts.pre || {};
    opts.pre = function (fnName) {
      return preObj[fnName];
    };
  }

  var ipfs = {
    bitswap: (0, _bitswap2.default)(getIpfs, opts),
    block: (0, _block2.default)(getIpfs, opts),
    bootstrap: (0, _bootstrap2.default)(getIpfs, opts),
    config: (0, _config2.default)(getIpfs, opts),
    dag: (0, _dag2.default)(getIpfs, opts),
    dht: (0, _dht2.default)(getIpfs, opts),
    dns: (0, _postmsgRpc.expose)('ipfs.dns', (0, _prepost.pre)(opts.pre('dns'), function () {
      var _getIpfs;

      return (_getIpfs = getIpfs()).dns.apply(_getIpfs, arguments);
    }), opts),
    files: (0, _files2.default)(getIpfs, opts),
    id: (0, _postmsgRpc.expose)('ipfs.id', (0, _prepost.pre)(opts.pre('id'), function () {
      return getIpfs().id();
    }), opts),
    key: (0, _key2.default)(getIpfs, opts),
    name: (0, _name2.default)(getIpfs, opts),
    object: (0, _object2.default)(getIpfs, opts),
    pin: (0, _pin2.default)(getIpfs, opts),
    pubsub: (0, _pubsub2.default)(getIpfs, opts),
    repo: (0, _repo2.default)(getIpfs, opts),
    resolve: (0, _postmsgRpc.expose)('ipfs.resolve', (0, _prepost.pre)(opts.pre('resolve'), function () {
      var _getIpfs2;

      return (_getIpfs2 = getIpfs()).resolve.apply(_getIpfs2, arguments);
    }), opts),
    stats: (0, _stats2.default)(getIpfs, opts),
    stop: (0, _postmsgRpc.expose)('ipfs.stop', (0, _prepost.pre)(opts.pre('stop'), function () {
      return getIpfs().stop();
    }), opts),
    swarm: (0, _swarm2.default)(getIpfs, opts),
    version: (0, _postmsgRpc.expose)('ipfs.version', (0, _prepost.pre)(opts.pre('version'), function () {
      return getIpfs().version();
    }), opts)
  };

  Object.assign(ipfs, (0, _ls2.default)(getIpfs, opts), (0, _ping2.default)(getIpfs, opts));

  return ipfs;
};

function closeProxyServer(obj) {
  return Promise.all(Object.keys(obj).map(function (k) {
    if (obj[k].close) return Promise.resolve(obj[k].close());
    return Promise.resolve(closeProxyServer(obj[k]));
  }));
}
//# sourceMappingURL=index.js.map