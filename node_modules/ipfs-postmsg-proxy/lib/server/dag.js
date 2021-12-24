'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    put: (0, _postmsgRpc.expose)('ipfs.dag.put', (0, _prepost.pre)((0, _dag.preDagNodeFromJson)(0), function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // TODO: CBOR node, is this correct?
      if (args[0] && !(0, _dag.isDagNode)(args[0])) {
        args[0] = (0, _convertValues2.default)(args[0], _buffer.isBufferJson, _buffer.bufferFromJson);
      }

      if (args[1] && args[1].cid) {
        if ((0, _buffer.isBufferJson)(args[1].cid)) {
          args[1].cid = (0, _buffer.bufferFromJson)(args[1].cid);
        } else if ((0, _cid.isCidJson)(args[1].cid)) {
          args[1].cid = (0, _cid.cidFromJson)(args[1].cid);
        }
      }

      return args;
    }, opts.pre('dag.put'), (0, _prepost.post)(function () {
      var _getIpfs$dag;

      return (_getIpfs$dag = getIpfs().dag).put.apply(_getIpfs$dag, arguments);
    }, _cid.cidToJson)), opts),
    get: (0, _postmsgRpc.expose)('ipfs.dag.get', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('dag.get'), (0, _prepost.post)(function () {
      var _getIpfs$dag2;

      return (_getIpfs$dag2 = getIpfs().dag).get.apply(_getIpfs$dag2, arguments);
    }, function (res) {
      if ((0, _dag.isDagNode)(res.value)) {
        res.value = (0, _dag.dagNodeToJson)(res.value);
      } else if ((0, _buffer.isBuffer)(res.value)) {
        res.value = (0, _buffer.bufferToJson)(res.value);
      } else {
        res.value = (0, _convertValues2.default)(res.value, _buffer.isBuffer, _buffer.bufferToJson);
      }

      return res;
    })), opts),
    tree: (0, _postmsgRpc.expose)('ipfs.dag.tree', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('dag.tree'), function () {
      var _getIpfs$dag3;

      return (_getIpfs$dag3 = getIpfs().dag).tree.apply(_getIpfs$dag3, arguments);
    }), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _dag = require('../serialization/dag');

var _cid = require('../serialization/cid');

var _buffer = require('../serialization/buffer');

var _convertValues = require('../serialization/utils/convert-values');

var _convertValues2 = _interopRequireDefault(_convertValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=dag.js.map