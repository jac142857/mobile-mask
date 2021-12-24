'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  var api = {
    bw: _callbackify2.default.variadic((0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.stats.bw', opts), function (stats) {
      if (stats) {
        if ((0, _big.isBigJson)(stats.totalIn)) {
          stats.totalIn = (0, _big.bigFromJson)(stats.totalIn);
        }

        if ((0, _big.isBigJson)(stats.totalOut)) {
          stats.totalOut = (0, _big.bigFromJson)(stats.totalOut);
        }

        if ((0, _big.isBigJson)(stats.rateIn)) {
          stats.rateIn = (0, _big.bigFromJson)(stats.rateIn);
        }

        if ((0, _big.isBigJson)(stats.rateOut)) {
          stats.rateOut = (0, _big.bigFromJson)(stats.rateOut);
        }
      }

      return stats;
    })),
    bwReadableStream: function bwReadableStream() {
      return _pullStreamToStream2.default.source(api.bwPullStream.apply(api, arguments));
    },

    bwPullStream: function () {
      var bwPullStream = (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.stats.bwPullStream', opts), function (res) {
        return _pullPostmsgStream2.default.source(res.name, Object.assign({}, opts, {
          post: function post(res) {
            var stats = res.data;

            if (stats) {
              if ((0, _big.isBigJson)(stats.totalIn)) {
                stats.totalIn = (0, _big.bigFromJson)(stats.totalIn);
              }

              if ((0, _big.isBigJson)(stats.totalOut)) {
                stats.totalOut = (0, _big.bigFromJson)(stats.totalOut);
              }

              if ((0, _big.isBigJson)(stats.rateIn)) {
                stats.rateIn = (0, _big.bigFromJson)(stats.rateIn);
              }

              if ((0, _big.isBigJson)(stats.rateOut)) {
                stats.rateOut = (0, _big.bigFromJson)(stats.rateOut);
              }
            }

            return res;
          }
        }));
      });

      return function () {
        var deferred = _pullDefer2.default.source();

        bwPullStream.apply(undefined, arguments).then(function (res) {
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

var _prepost = require('prepost');

var _pullDefer = require('pull-defer');

var _pullDefer2 = _interopRequireDefault(_pullDefer);

var _pullPostmsgStream = require('pull-postmsg-stream');

var _pullPostmsgStream2 = _interopRequireDefault(_pullPostmsgStream);

var _pullStreamToStream = require('pull-stream-to-stream');

var _pullStreamToStream2 = _interopRequireDefault(_pullStreamToStream);

var _big = require('../serialization/big');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=stats.js.map