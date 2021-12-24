'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  var api = {
    ls: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _postmsgRpc.caller)('ipfs.ls', opts))),
    lsReadableStream: function lsReadableStream() {
      return _pullStreamToStream2.default.source(api.lsPullStream.apply(api, arguments));
    },

    lsPullStream: function () {
      var lsPullStream = (0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.lsPullStream', opts), function (res) {
        return _pullPostmsgStream2.default.source(res.name, opts);
      }));

      return function () {
        var deferred = _pullDefer2.default.source();

        lsPullStream.apply(undefined, arguments).then(function (res) {
          return deferred.resolve(res);
        }).catch(function (err) {
          return deferred.abort(err);
        });

        return deferred;
      };
    }()
  };

  return api;
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _pullDefer = require('pull-defer');

var _pullDefer2 = _interopRequireDefault(_pullDefer);

var _pullStreamToStream = require('pull-stream-to-stream');

var _pullStreamToStream2 = _interopRequireDefault(_pullStreamToStream);

var _pullPostmsgStream = require('pull-postmsg-stream');

var _pullPostmsgStream2 = _interopRequireDefault(_pullPostmsgStream);

var _prepost = require('prepost');

var _cid = require('../serialization/cid');

var _buffer = require('../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=ls.js.map