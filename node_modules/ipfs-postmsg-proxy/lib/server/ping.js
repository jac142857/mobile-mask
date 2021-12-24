'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    ping: (0, _postmsgRpc.expose)('ipfs.ping', (0, _prepost.pre)(opts.pre('ping'), function () {
      var _getIpfs;

      return (_getIpfs = getIpfs()).ping.apply(_getIpfs, arguments);
    }), opts),
    pingPullStream: (0, _postmsgRpc.expose)('ipfs.pingPullStream', (0, _prepost.pre)(opts.pre('pingPullStream'), (0, _prepost.post)(function () {
      var _getIpfs2;

      return (_getIpfs2 = getIpfs()).pingPullStream.apply(_getIpfs2, arguments);
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

var _function = require('../serialization/function');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=ping.js.map