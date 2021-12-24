'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  var api = {
    read: _callbackify2.default.variadic((0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.files.read', opts), _buffer.bufferFromJson)),
    readReadableStream: function readReadableStream() {
      return _pullStreamToStream2.default.source(api.readPullStream.apply(api, arguments));
    },

    readPullStream: function () {
      var readPullStream = (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.files.readPullStream', opts), function (res) {
        return _pullPostmsgStream2.default.source(res.name, Object.assign({}, opts, {
          post: function post(res) {
            if ((0, _buffer.isBufferJson)(res.data)) {
              res.data = (0, _buffer.bufferFromJson)(res.data);
            }

            return res;
          }
        }));
      });

      return function () {
        var deferred = _pullDefer2.default.source();

        readPullStream.apply(undefined, arguments).then(function (res) {
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

var _pullPostmsgStream = require('pull-postmsg-stream');

var _pullPostmsgStream2 = _interopRequireDefault(_pullPostmsgStream);

var _pullStreamToStream = require('pull-stream-to-stream');

var _pullStreamToStream2 = _interopRequireDefault(_pullStreamToStream);

var _prepost = require('prepost');

var _buffer = require('../../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=read.js.map