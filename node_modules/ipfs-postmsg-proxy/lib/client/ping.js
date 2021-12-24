'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  var api = {
    ping: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.ping', opts)),
    pingPullStream: function () {
      var pingPullStream = (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.pingPullStream', opts), function (res) {
        return _pullPostmsgStream2.default.source(res.name, opts);
      });

      return function () {
        var deferred = _pullDefer2.default.source();

        pingPullStream.apply(undefined, arguments).then(function (res) {
          return deferred.resolve(res);
        }).catch(function (err) {
          return deferred.abort(err);
        });

        return deferred;
      };
    }(),
    pingReadableStream: function pingReadableStream() {
      return _pullStreamToStream2.default.source(api.pingPullStream.apply(api, arguments));
    }
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=ping.js.map