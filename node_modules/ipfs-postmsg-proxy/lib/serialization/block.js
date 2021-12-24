'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preBlockToJson = exports.preBlockFromJson = exports.isBlockJson = exports.isBlock = exports.blockFromJson = exports.blockToJson = undefined;

var _ipfsBlock = require('ipfs-block');

var _ipfsBlock2 = _interopRequireDefault(_ipfsBlock);

var _cid = require('./cid');

var _buffer = require('./buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var blockToJson = exports.blockToJson = function blockToJson(block) {
  return {
    __ipfsPostMsgProxyType: 'Block',
    cid: (0, _cid.cidToJson)(block.cid),
    data: (0, _buffer.bufferToJson)(block.data)
  };
};

var blockFromJson = exports.blockFromJson = function blockFromJson(obj) {
  var cid = (0, _cid.cidFromJson)(obj.cid);
  var data = (0, _buffer.bufferFromJson)(obj.data);
  return new _ipfsBlock2.default(data, cid);
};

var isBlock = exports.isBlock = function isBlock(obj) {
  return obj && _ipfsBlock2.default.isBlock(obj);
};
var isBlockJson = exports.isBlockJson = function isBlockJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'Block';
};

var preBlockFromJson = exports.preBlockFromJson = function preBlockFromJson(index) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isBlockJson(args[index])) {
      args[index] = blockFromJson(args[index]);
    }
    return args;
  };
};

var preBlockToJson = exports.preBlockToJson = function preBlockToJson(index) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (isBlock(args[index])) {
      args[index] = blockToJson(args[index]);
    }
    return args;
  };
};
//# sourceMappingURL=block.js.map