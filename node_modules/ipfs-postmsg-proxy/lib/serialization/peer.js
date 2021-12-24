'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prePeerIdToJson = exports.prePeerIdFromJson = exports.isPeerIdJson = exports.isPeerId = exports.peerIdToJson = exports.peerIdFromJson = exports.prePeerInfoToJson = exports.prePeerInfoFromJson = exports.isPeerInfoJson = exports.isPeerInfo = exports.peerInfoToJson = exports.peerInfoFromJson = undefined;

var _peerInfo = require('peer-info');

var _peerInfo2 = _interopRequireDefault(_peerInfo);

var _peerId = require('peer-id');

var _peerId2 = _interopRequireDefault(_peerId);

var _multiaddr = require('./multiaddr');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var peerInfoFromJson = exports.peerInfoFromJson = function peerInfoFromJson(obj) {
  return peerIdFromJson(obj.id).then(function (peerId) {
    var peerInfo = new _peerInfo2.default(peerId);

    obj.multiaddrs.forEach(function (multiaddr) {
      peerInfo.multiaddrs.add((0, _multiaddr.multiaddrFromJson)(multiaddr));
    });

    if (obj._connectedMultiaddr) {
      peerInfo.connect((0, _multiaddr.multiaddrFromJson)(obj._connectedMultiaddr));
    }

    return peerInfo;
  });
};

var peerInfoToJson = exports.peerInfoToJson = function peerInfoToJson(peerInfo) {
  return {
    __ipfsPostMsgProxyType: 'PeerInfo',
    id: peerIdToJson(peerInfo.id),
    multiaddrs: peerInfo.multiaddrs.toArray().map(_multiaddr.multiaddrToJson),
    _connectedMultiaddr: peerInfo._connectedMultiaddr ? (0, _multiaddr.multiaddrToJson)(peerInfo._connectedMultiaddr) : null
  };
};

var isPeerInfo = exports.isPeerInfo = _peerInfo2.default.isPeerInfo;
var isPeerInfoJson = exports.isPeerInfoJson = function isPeerInfoJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'PeerInfo';
};

var prePeerInfoFromJson = exports.prePeerInfoFromJson = function prePeerInfoFromJson(index) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isPeerInfoJson(args[index])) {
      args[index] = peerInfoFromJson(args[index]);
    }
    return args;
  };
};

var prePeerInfoToJson = exports.prePeerInfoToJson = function prePeerInfoToJson(index) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (isPeerInfo(args[index])) {
      args[index] = peerInfoToJson(args[index]);
    }
    return args;
  };
};

var peerIdFromJson = exports.peerIdFromJson = function peerIdFromJson(obj) {
  return new Promise(function (resolve, reject) {
    _peerId2.default.createFromJSON(obj, function (err, peerId) {
      if (err) return reject(err);
      resolve(peerId);
    });
  });
};

var peerIdToJson = exports.peerIdToJson = function peerIdToJson(peerId) {
  return Object.assign({ __ipfsPostMsgProxyType: 'PeerId' }, peerId.toJSON());
};

var isPeerId = exports.isPeerId = _peerId2.default.isPeerId;
var isPeerIdJson = exports.isPeerIdJson = function isPeerIdJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'PeerId';
};

var prePeerIdFromJson = exports.prePeerIdFromJson = function prePeerIdFromJson(index) {
  return function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    if (isPeerIdJson(args[index])) {
      args[index] = peerIdFromJson(args[index]);
    }
    return args;
  };
};

var prePeerIdToJson = exports.prePeerIdToJson = function prePeerIdToJson(index) {
  return function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    if (isPeerId(args[index])) {
      args[index] = peerIdToJson(args[index]);
    }
    return args;
  };
};
//# sourceMappingURL=peer.js.map