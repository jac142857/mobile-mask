'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return {
    add: (0, _postmsgRpc.expose)('ipfs.files.add', (0, _prepost.pre)(function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var fileFromJsonOpts = { pms: opts };

      args[0] = Array.isArray(args[0]) ? args[0].map(function (file) {
        return fileFromJson(file, fileFromJsonOpts);
      }) : fileFromJson(args[0], fileFromJsonOpts);

      return args;
    }, opts.pre('files.add'), function () {
      var _getIpfs$files;

      return (_getIpfs$files = getIpfs().files).add.apply(_getIpfs$files, arguments);
    }), opts),
    addPullStream: (0, _postmsgRpc.expose)('ipfs.files.addPullStream', (0, _prepost.pre)(opts.pre('files.addPullStream'), function () {
      var _getIpfs$files2;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var readFnName = (0, _shortid2.default)();

      (0, _pullStream2.default)(_pullPostmsgStream2.default.source(args[0].name, opts), _pullStream2.default.map(function (obj) {
        return fileFromJson(obj, { pms: opts });
      }), (_getIpfs$files2 = getIpfs().files).addPullStream.apply(_getIpfs$files2, _toConsumableArray(args.slice(1))), _pullPostmsgStream2.default.sink(readFnName, opts));

      return (0, _function.functionToJson)(readFnName);
    }), opts)
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

var _buffer = require('../../serialization/buffer');

var _function = require('../../serialization/function');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function fileFromJson(obj, opts) {
  opts = opts || {};

  if ((0, _buffer.isBufferJson)(obj)) {
    // Buffer
    return (0, _buffer.bufferFromJson)(obj);
  } else if ((0, _function.isFunctionJson)(obj)) {
    // Pull stream
    return pullStreamFromJson(obj, opts);
  } else if (obj && obj.content) {
    // Object { path?, content }
    return Object.assign({}, obj, { content: fileFromJson(obj.content, opts) });
  }

  return obj; // Object { path } maybe, but could be anything
}

function pullStreamFromJson(obj, opts) {
  opts = opts || {};

  return _pullPostmsgStream2.default.source(obj.name, Object.assign({}, opts.pms, {
    post: function post(res) {
      if ((0, _buffer.isBufferJson)(res.data)) {
        res.data = (0, _buffer.bufferFromJson)(res.data);
      }

      return res;
    }
  }));
}
//# sourceMappingURL=add.js.map