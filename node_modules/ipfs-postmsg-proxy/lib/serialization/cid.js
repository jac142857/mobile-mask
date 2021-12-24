'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preArrayOfCidFromJson = exports.preArrayOfCidToJson = exports.preCidToJson = exports.preCidFromJson = exports.isCidJson = exports.isCid = exports.cidToJson = exports.cidFromJson = undefined;

var _cids = require('cids');

var _cids2 = _interopRequireDefault(_cids);

var _buffer = require('./buffer');

var _prepostArrayOf = require('./utils/prepost-array-of');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cidFromJson = exports.cidFromJson = function cidFromJson(obj) {
  return new _cids2.default(obj.version, obj.codec, (0, _buffer.bufferFromJson)(obj.hash));
};

var cidToJson = exports.cidToJson = function cidToJson(cid) {
  return {
    __ipfsPostMsgProxyType: 'CID',
    codec: cid.codec,
    version: cid.version,
    hash: (0, _buffer.bufferToJson)(cid.multihash)
  };
};

var isCid = exports.isCid = _cids2.default.isCID;
var isCidJson = exports.isCidJson = function isCidJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'CID';
};

var preCidFromJson = exports.preCidFromJson = function preCidFromJson(index) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isCidJson(args[index])) {
      args[index] = cidFromJson(args[index]);
    }
    return args;
  };
};

var preCidToJson = exports.preCidToJson = function preCidToJson(index) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (isCid(args[index])) {
      args[index] = cidToJson(args[index]);
    }
    return args;
  };
};

var preArrayOfCidToJson = exports.preArrayOfCidToJson = function preArrayOfCidToJson(index) {
  return (0, _prepostArrayOf.preArrayOf)(index, isCid, cidToJson);
};
var preArrayOfCidFromJson = exports.preArrayOfCidFromJson = function preArrayOfCidFromJson(index) {
  return (0, _prepostArrayOf.preArrayOf)(index, isCidJson, cidFromJson);
};
//# sourceMappingURL=cid.js.map