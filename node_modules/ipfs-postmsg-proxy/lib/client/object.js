'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return {
    new: _callbackify2.default.variadic((0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.object.new', opts), function (res) {
      return (0, _dag.isDagNodeJson)(res) ? (0, _dag.dagNodeFromJson)(res) : res;
    })),
    put: _callbackify2.default.variadic((0, _prepost.pre)((0, _dag.preDagNodeToJson)(0), (0, _buffer.preBufferToJson)(0), function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[0] && (0, _buffer.isBuffer)(args[0].Data)) {
        args[0] = Object.assign({}, args[0], { Data: (0, _buffer.bufferToJson)(args[0].Data) });
      }

      return args;
    }, (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.object.put', opts), function (res) {
      return (0, _dag.isDagNodeJson)(res) ? (0, _dag.dagNodeFromJson)(res) : res;
    }))),
    get: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.object.get', opts), function (res) {
      return (0, _dag.isDagNodeJson)(res) ? (0, _dag.dagNodeFromJson)(res) : res;
    }))),
    data: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.object.data', opts), _buffer.bufferFromJson))),
    links: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.object.links', opts), function (res) {
      return res.map(_dag.dagLinkFromJson);
    }))),
    stat: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _postmsgRpc.caller)('ipfs.object.stat', opts))),
    patch: {
      addLink: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _dag.preDagLinkToJson)(1), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.object.patch.addLink', opts), _dag.dagNodeFromJson))),
      rmLink: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _dag.preDagLinkToJson)(1), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.object.patch.rmLink', opts), _dag.dagNodeFromJson))),
      appendData: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _buffer.preBufferToJson)(1), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.object.patch.appendData', opts), _dag.dagNodeFromJson))),
      setData: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _buffer.preBufferToJson)(1), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.object.patch.setData', opts), _dag.dagNodeFromJson)))
    }
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _prepost = require('prepost');

var _dag = require('../serialization/dag');

var _cid = require('../serialization/cid');

var _buffer = require('../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=object.js.map