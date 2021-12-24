'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    get: (0, _postmsgRpc.expose)('ipfs.files.get', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('files.get'), (0, _prepost.post)(function () {
      var _getIpfs$files;

      return (_getIpfs$files = getIpfs().files).get.apply(_getIpfs$files, arguments);
    }, function (files) {
      return files.map(function (file) {
        if (file.content) {
          file.content = (0, _buffer.bufferToJson)(file.content);
        }

        return file;
      });
    })), opts),
    getPullStream: (0, _postmsgRpc.expose)('ipfs.files.getPullStream', (0, _prepost.pre)((0, _buffer.preBufferFromJson)(0), (0, _cid.preCidFromJson)(0), opts.pre('files.getPullStream'), (0, _prepost.post)(function () {
      var _getIpfs$files2;

      return (_getIpfs$files2 = getIpfs().files).getPullStream.apply(_getIpfs$files2, arguments);
    }, function (res) {
      return new Promise(function (resolve) {
        var readFnName = (0, _shortid2.default)();

        (0, _pullStream2.default)(res, _pullStream2.default.map(function (file) {
          if (file.content) {
            var _readFnName = (0, _shortid2.default)();

            (0, _pullStream2.default)(file.content, _pullPostmsgStream2.default.sink(_readFnName, Object.assign({}, opts, {
              post: function post(res) {
                if ((0, _buffer.isBuffer)(res.data)) {
                  res.data = (0, _buffer.bufferToJson)(res.data);
                }

                return res;
              }
            })));

            file.content = (0, _function.functionToJson)(_readFnName);
          }

          return file;
        }), _pullPostmsgStream2.default.sink(readFnName, opts));

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

var _cid = require('../../serialization/cid');

var _buffer = require('../../serialization/buffer');

var _function = require('../../serialization/function');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=get.js.map