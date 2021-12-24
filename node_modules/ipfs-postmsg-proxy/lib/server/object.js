'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    new: (0, _postmsgRpc.expose)('ipfs.object.new', (0, _prepost.pre)(opts.pre('object.new'), (0, _prepost.post)(function () {
      var _getIpfs$object;

      return (_getIpfs$object = getIpfs().object).new.apply(_getIpfs$object, arguments);
    }, _dag.dagNodeToJson)), opts),
    put: (0, _postmsgRpc.expose)('ipfs.object.put', (0, _prepost.pre)((0, _dag.preDagNodeFromJson)(0), (0, _buffer.preBufferFromJson)(0), function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args[0] && (0, _buffer.isBufferJson)(args[0].Data)) {
        args[0].Data = (0, _buffer.bufferFromJson)(args[0].Data);
      }

      return args;
    }, opts.pre('object.put'), (0, _prepost.post)(function () {
      var _getIpfs$object2;

      return (_getIpfs$object2 = getIpfs().object).put.apply(_getIpfs$object2, arguments);
    }, _dag.dagNodeToJson)), opts),
    get: (0, _postmsgRpc.expose)('ipfs.object.get', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('object.get'), (0, _prepost.post)(function () {
      var _getIpfs$object3;

      return (_getIpfs$object3 = getIpfs().object).get.apply(_getIpfs$object3, arguments);
    }, _dag.dagNodeToJson)), opts),
    data: (0, _postmsgRpc.expose)('ipfs.object.data', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('object.data'), (0, _prepost.post)(function () {
      var _getIpfs$object4;

      return (_getIpfs$object4 = getIpfs().object).data.apply(_getIpfs$object4, arguments);
    }, _buffer.bufferToJson)), opts),
    links: (0, _postmsgRpc.expose)('ipfs.object.links', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('object.links'), (0, _prepost.post)(function () {
      var _getIpfs$object5;

      return (_getIpfs$object5 = getIpfs().object).links.apply(_getIpfs$object5, arguments);
    }, function (res) {
      return res.map(_dag.dagLinkToJson);
    })), opts),
    stat: (0, _postmsgRpc.expose)('ipfs.object.stat', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('object.stat'), function () {
      var _getIpfs$object6;

      return (_getIpfs$object6 = getIpfs().object).stat.apply(_getIpfs$object6, arguments);
    }), opts),
    patch: {
      addLink: (0, _postmsgRpc.expose)('ipfs.object.patch.addLink', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), (0, _dag.preDagLinkFromJson)(1), opts.pre('object.patch.addLink'), (0, _prepost.post)(function () {
        var _getIpfs$object$patch;

        return (_getIpfs$object$patch = getIpfs().object.patch).addLink.apply(_getIpfs$object$patch, arguments);
      }, _dag.dagNodeToJson)), opts),
      rmLink: (0, _postmsgRpc.expose)('ipfs.object.patch.rmLink', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), (0, _dag.preDagLinkFromJson)(1), opts.pre('object.patch.rmLink'), (0, _prepost.post)(function () {
        var _getIpfs$object$patch2;

        return (_getIpfs$object$patch2 = getIpfs().object.patch).rmLink.apply(_getIpfs$object$patch2, arguments);
      }, _dag.dagNodeToJson)), opts),
      appendData: (0, _postmsgRpc.expose)('ipfs.object.patch.appendData', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), (0, _buffer.preBufferFromJson)(1), opts.pre('object.patch.appendData'), (0, _prepost.post)(function () {
        var _getIpfs$object$patch3;

        return (_getIpfs$object$patch3 = getIpfs().object.patch).appendData.apply(_getIpfs$object$patch3, arguments);
      }, _dag.dagNodeToJson)), opts),
      setData: (0, _postmsgRpc.expose)('ipfs.object.patch.setData', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), (0, _buffer.preBufferFromJson)(1), opts.pre('object.patch.setData'), (0, _prepost.post)(function () {
        var _getIpfs$object$patch4;

        return (_getIpfs$object$patch4 = getIpfs().object.patch).setData.apply(_getIpfs$object$patch4, arguments);
      }, _dag.dagNodeToJson)), opts)
    }
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _dag = require('../serialization/dag');

var _cid = require('../serialization/cid');

var _buffer = require('../serialization/buffer');
//# sourceMappingURL=object.js.map