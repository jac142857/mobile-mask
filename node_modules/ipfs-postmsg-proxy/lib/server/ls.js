'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    ls: (0, _postmsgRpc.expose)('ipfs.ls', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('ls'), function () {
      var _getIpfs;

      return (_getIpfs = getIpfs()).ls.apply(_getIpfs, arguments);
    }), opts),
    lsPullStream: (0, _postmsgRpc.expose)('ipfs.lsPullStream', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('lsPullStream'), (0, _prepost.post)(function () {
      var _getIpfs2;

      return (_getIpfs2 = getIpfs()).lsPullStream.apply(_getIpfs2, arguments);
    }, function (res) {
      return new Promise(function (resolve) {
        var readFnName = (0, _shortid2.default)();
        (0, _pullStream2.default)(res, _pullPostmsgStream2.default.sink(readFnName, opts));
        resolve((0, _function.functionToJson)(readFnName));
      });
    })), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _pullStream = require('pull-stream');

var _pullStream2 = _interopRequireDefault(_pullStream);

var _pullPostmsgStream = require('pull-postmsg-stream');

var _pullPostmsgStream2 = _interopRequireDefault(_pullPostmsgStream);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _cid = require('../serialization/cid');

var _buffer = require('../serialization/buffer');

var _function = require('../serialization/function');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=ls.js.map