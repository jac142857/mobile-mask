'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    put: _callbackify2.default.variadic((0, _prepost.pre)((0, _dag.preDagNodeToJson)(0), function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[0] && !(0, _dag.isDagNodeJson)(args[0])) {
        args[0] = (0, _convertValues2.default)(args[0], _buffer.isBuffer, _buffer.bufferToJson);
      }

      if (args[1] && args[1].cid) {
        if ((0, _buffer.isBuffer)(args[1].cid)) {
          args[1].cid = (0, _buffer.bufferToJson)(args[1].cid);
        } else if ((0, _cid.isCid)(args[1].cid)) {
          args[1].cid = (0, _cid.cidToJson)(args[1].cid);
        }
      }

      return args;
    }, (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.dag.put', opts), _cid.cidFromJson))),
    get: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.dag.get', opts), function (res) {
      if ((0, _dag.isDagNodeJson)(res.value)) {
        return (0, _dag.dagNodeFromJson)(res.value).then(function (value) {
          return { value: value };
        });
      }

      if ((0, _buffer.isBufferJson)(res.value)) {
        res.value = (0, _buffer.bufferFromJson)(res.value);
      } else if (res.value) {
        // TODO: CBOR node, is this correct?
        res.value = (0, _convertValues2.default)(res.value, _buffer.isBufferJson, _buffer.bufferFromJson);
      }

      return res;
    }))),
    tree: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _postmsgRpc.caller)('ipfs.dag.tree', opts)))
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _prepost = require('prepost');

var _dag = require('../serialization/dag');

var _cid = require('../serialization/cid');

var _buffer = require('../serialization/buffer');

var _convertValues = require('../serialization/utils/convert-values');

var _convertValues2 = _interopRequireDefault(_convertValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=dag.js.map