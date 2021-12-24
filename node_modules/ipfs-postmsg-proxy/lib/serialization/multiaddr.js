'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preMultiaddrToJson = exports.preMultiaddrFromJson = exports.isMultiaddrJson = exports.isMultiaddr = exports.multiaddrToJson = exports.multiaddrFromJson = undefined;

var _multiaddr = require('multiaddr');

var _multiaddr2 = _interopRequireDefault(_multiaddr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multiaddrFromJson = exports.multiaddrFromJson = function multiaddrFromJson(obj) {
  return new _multiaddr2.default(obj.multiaddr);
};

var multiaddrToJson = exports.multiaddrToJson = function multiaddrToJson(multiaddr) {
  return {
    __ipfsPostMsgProxyType: 'Multiaddr',
    multiaddr: multiaddr.toString()
  };
};

var isMultiaddr = exports.isMultiaddr = function isMultiaddr(obj) {
  return obj && _multiaddr2.default.isMultiaddr(obj);
};
var isMultiaddrJson = exports.isMultiaddrJson = function isMultiaddrJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'Multiaddr';
};

var preMultiaddrFromJson = exports.preMultiaddrFromJson = function preMultiaddrFromJson(index) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isMultiaddrJson(args[index])) {
      args[index] = multiaddrFromJson(args[index]);
    }
    return args;
  };
};

var preMultiaddrToJson = exports.preMultiaddrToJson = function preMultiaddrToJson(index) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (isMultiaddr(args[index])) {
      args[index] = multiaddrToJson(args[index]);
    }
    return args;
  };
};
//# sourceMappingURL=multiaddr.js.map