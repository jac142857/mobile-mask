'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  var api = {
    cat: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.files.cat', opts), _buffer.bufferFromJson))),
    catReadableStream: function catReadableStream() {
      return _pullStreamToStream2.default.source(api.catPullStream.apply(api, arguments));
    },

    catPullStream: function () {
      var catPullStream = (0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.files.catPullStream', opts), function (res) {
        return _pullPostmsgStream2.default.source(res.name, Object.assign({}, opts, {
          post: function post(res) {
            if ((0, _buffer.isBufferJson)(res.data)) {
              res.data = (0, _buffer.bufferFromJson)(res.data);
            }

            return res;
          }
        }));
      }));

      return function () {
        var deferred = _pullDefer2.default.source();

        catPullStream.apply(undefined, arguments).then(function (res) {
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

var _cid = require('../../serialization/cid');

var _buffer = require('../../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=cat.js.map