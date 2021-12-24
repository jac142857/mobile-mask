'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    read: (0, _postmsgRpc.expose)('ipfs.files.read', (0, _prepost.pre)(opts.pre('files.read'), (0, _prepost.post)(function () {
      var _getIpfs$files;

      return (_getIpfs$files = getIpfs().files).read.apply(_getIpfs$files, arguments);
    }, _buffer.bufferToJson)), opts),
    readPullStream: (0, _postmsgRpc.expose)('ipfs.files.readPullStream', (0, _prepost.pre)(opts.pre('files.readPullStream'), (0, _prepost.post)(function () {
      var _getIpfs$files2;

      return (_getIpfs$files2 = getIpfs().files).readPullStream.apply(_getIpfs$files2, arguments);
    }, function (res) {
      return new Promise(function (resolve) {
        var readFnName = (0, _shortid2.default)();

        (0, _pullStream2.default)(res, _pullPostmsgStream2.default.sink(readFnName, Object.assign({}, opts, {
          post: function post(res) {
            if ((0, _buffer.isBuffer)(res.data)) {
              res.data = (0, _buffer.bufferToJson)(res.data);
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

var _buffer = require('../../serialization/buffer');

var _function = require('../../serialization/function');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=read.js.map