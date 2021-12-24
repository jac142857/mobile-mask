'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preArrayOfBufferFromJson = exports.preArrayOfBufferToJson = exports.preBufferToJson = exports.preBufferFromJson = exports.isBufferJson = exports.isBuffer = exports.bufferToJson = exports.bufferFromJson = undefined;

var _prepostArrayOf = require('./utils/prepost-array-of');

var bufferFromJson = exports.bufferFromJson = function bufferFromJson(obj) {
  return Buffer.from(JSON.parse(obj.data).data);
};

var bufferToJson = exports.bufferToJson = function bufferToJson(buf) {
  return {
    __ipfsPostMsgProxyType: 'Buffer',
    data: JSON.stringify(buf)
  };
};

var isBuffer = exports.isBuffer = Buffer.isBuffer;
var isBufferJson = exports.isBufferJson = function isBufferJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'Buffer';
};

var preBufferFromJson = exports.preBufferFromJson = function preBufferFromJson(index) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isBufferJson(args[index])) {
      args[index] = bufferFromJson(args[index]);
    }
    return args;
  };
};

var preBufferToJson = exports.preBufferToJson = function preBufferToJson(index) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (isBuffer(args[index])) {
      args[index] = bufferToJson(args[index]);
    }
    return args;
  };
};

var preArrayOfBufferToJson = exports.preArrayOfBufferToJson = function preArrayOfBufferToJson(index) {
  return (0, _prepostArrayOf.preArrayOf)(index, isBuffer, bufferToJson);
};
var preArrayOfBufferFromJson = exports.preArrayOfBufferFromJson = function preArrayOfBufferFromJson(index) {
  return (0, _prepostArrayOf.preArrayOf)(index, isBufferJson, bufferFromJson);
};
//# sourceMappingURL=buffer.js.map