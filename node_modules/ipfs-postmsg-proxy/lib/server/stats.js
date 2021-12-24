'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    bw: (0, _postmsgRpc.expose)('ipfs.stats.bw', (0, _prepost.pre)(opts.pre('stats.bw'), (0, _prepost.post)(function () {
      var _getIpfs$stats;

      return (_getIpfs$stats = getIpfs().stats).bw.apply(_getIpfs$stats, arguments);
    }, function (stats) {
      if (stats) {
        if ((0, _big.isBig)(stats.totalIn)) {
          stats.totalIn = (0, _big.bigToJson)(stats.totalIn);
        }

        if ((0, _big.isBig)(stats.totalOut)) {
          stats.totalOut = (0, _big.bigToJson)(stats.totalOut);
        }

        if ((0, _big.isBig)(stats.rateIn)) {
          stats.rateIn = (0, _big.bigToJson)(stats.rateIn);
        }

        if ((0, _big.isBig)(stats.rateOut)) {
          stats.rateOut = (0, _big.bigToJson)(stats.rateOut);
        }
      }

      return stats;
    })), opts),
    bwPullStream: (0, _postmsgRpc.expose)('ipfs.stats.bwPullStream', (0, _prepost.pre)(opts.pre('stats.bwPullStream'), (0, _prepost.post)(function () {
      var _getIpfs$stats2;

      return (_getIpfs$stats2 = getIpfs().stats).bwPullStream.apply(_getIpfs$stats2, arguments);
    }, function (res) {
      return new Promise(function (resolve) {
        var readFnName = (0, _shortid2.default)();

        (0, _pullStream2.default)(res, _pullPostmsgStream2.default.sink(readFnName, Object.assign({}, opts, {
          post: function post(res) {
            var stats = res.data;

            if (stats) {
              if ((0, _big.isBig)(stats.totalIn)) {
                stats.totalIn = (0, _big.bigToJson)(stats.totalIn);
              }

              if ((0, _big.isBig)(stats.totalOut)) {
                stats.totalOut = (0, _big.bigToJson)(stats.totalOut);
              }

              if ((0, _big.isBig)(stats.rateIn)) {
                stats.rateIn = (0, _big.bigToJson)(stats.rateIn);
              }

              if ((0, _big.isBig)(stats.rateOut)) {
                stats.rateOut = (0, _big.bigToJson)(stats.rateOut);
              }
            }

            return res;
          }
        })));

        resolve((0, _function.functionToJson)(readFnName));
      });
    })), opts)
  };
};

var _postmsgRpc = require('postmsg-rpc');

var _prepost = require('prepost');

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _pullStream = require('pull-stream');

var _pullStream2 = _interopRequireDefault(_pullStream);

var _pullPostmsgStream = require('pull-postmsg-stream');

var _pullPostmsgStream2 = _interopRequireDefault(_pullPostmsgStream);

var _big = require('../serialization/big');

var _function = require('../serialization/function');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=stats.js.map