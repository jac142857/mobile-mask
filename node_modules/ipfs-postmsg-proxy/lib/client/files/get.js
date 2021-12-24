'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  var api = {
    get: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.files.get', opts), function (files) {
      return files.map(function (file) {
        if (file.content) {
          file.content = (0, _buffer.bufferFromJson)(file.content);
        }

        return file;
      });
    }))),
    getReadableStream: function getReadableStream() {
      return _pullStreamToStream2.default.source((0, _pullStream2.default)(api.getPullStream.apply(api, arguments), _pullStream2.default.map(function (file) {
        if (file.content) {
          file.content = _pullStreamToStream2.default.source(file.content);
        }
        return file;
      })));
    },

    getPullStream: function () {
      var getPullStream = (0, _prepost.pre)((0, _buffer.preBufferToJson)(0), (0, _cid.preCidToJson)(0), (0, _prepost.post)((0, _postmsgRpc.caller)('ipfs.files.getPullStream', opts), function (res) {
        return (0, _pullStream2.default)(_pullPostmsgStream2.default.source(res.name, opts), _pullStream2.default.map(function (file) {
          if (file.content) {
            file.content = _pullPostmsgStream2.default.source(file.content.name, Object.assign({}, opts, {
              post: function post(res) {
                if ((0, _buffer.isBufferJson)(res.data)) {
                  res.data = (0, _buffer.bufferFromJson)(res.data);
                }

                return res;
              }
            }));
          }

          return file;
        }));
      }));

      return function () {
        var deferred = _pullDefer2.default.source();

        getPullStream.apply(undefined, arguments).then(function (res) {
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

var _pullStream = require('pull-stream');

var _pullStream2 = _interopRequireDefault(_pullStream);

var _pullStreamToStream = require('pull-stream-to-stream');

var _pullStreamToStream2 = _interopRequireDefault(_pullStreamToStream);

var _pullPostmsgStream = require('pull-postmsg-stream');

var _pullPostmsgStream2 = _interopRequireDefault(_pullPostmsgStream);

var _prepost = require('prepost');

var _cid = require('../../serialization/cid');

var _buffer = require('../../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=get.js.map