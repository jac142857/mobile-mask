'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  var api = {
    add: function () {
      var add = _callbackify2.default.variadic((0, _prepost.pre)(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var fileToJsonOpts = { pms: opts

          // FIXME: implement progress properly
        };if (args[1] && args[1].progress) {
          fileToJsonOpts.onProgressIncrement = createOnProgressIncrement(args[1].progress);
          delete args[1].progress;
        }

        args[0] = Array.isArray(args[0]) ? args[0].map(function (file) {
          return fileToJson(file, fileToJsonOpts);
        }) : fileToJson(args[0], fileToJsonOpts);

        return args;
      }, (0, _postmsgRpc.caller)('ipfs.files.add', opts)));

      return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        // Pull streams are just functions and so callbackify.variadic thinks
        // the stream is a callback function! Instead explicitly pass null for
        // the options arg.
        if (args.length === 1 && (0, _isPullStream.isSource)(args[0])) {
          args = args.concat(null);
        }

        return add.apply(undefined, _toConsumableArray(args));
      };
    }(),
    // FIXME: implement add readable stream properly
    addReadableStream: function addReadableStream() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var content = [];
      return new _stream.Transform({
        objectMode: true,
        transform: function transform(file, enc, cb) {
          content.push(file);
          cb();
        },
        flush: function flush(cb) {
          var _this = this;

          api.add.apply(api, [content].concat(args, function (err, res) {
            if (err) return cb(err);
            res.forEach(function (file) {
              return _this.push(file);
            });
            cb();
          }));
        }
      });
    },

    addPullStream: function () {
      var addPullStream = (0, _postmsgRpc.caller)('ipfs.files.addPullStream', opts);

      return function () {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        var deferred = _pullDefer2.default.source();
        var abortable = (0, _pullAbortable2.default)();
        var fileToJsonOpts = { pms: opts

          // FIXME: implement progress properly
        };if (args[0] && args[0].progress) {
          fileToJsonOpts.onProgressIncrement = createOnProgressIncrement(args[0].progress);
          delete args[0].progress;
        }

        var readFnName = (0, _shortid2.default)();

        // Create the through stream what will connect the client to the
        // server, our source is deferred, until the server responds to tell
        // us the name of the read function we can use to pull added file
        // info from.
        var through = function through(read) {
          _pullPostmsgStream2.default.sink(readFnName, opts)(read);
          return deferred;
        };

        // Call addPullStream on the server, sending the name of the read
        // function it can use to pull files to add from.
        addPullStream.apply(undefined, [(0, _function.functionToJson)(readFnName)].concat(args)).then(function (res) {
          return deferred.resolve(_pullPostmsgStream2.default.source(res.name, opts));
        }).catch(function (err) {
          return abortable.abort(err);
        });

        return (0, _pullStream2.default)(_pullStream2.default.map(function (file) {
          return fileToJson(file, fileToJsonOpts);
        }), through, abortable);
      };
    }()
  };

  return api;
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _stream = require('stream');

var _pullStream = require('pull-stream');

var _pullStream2 = _interopRequireDefault(_pullStream);

var _pullPostmsgStream = require('pull-postmsg-stream');

var _pullPostmsgStream2 = _interopRequireDefault(_pullPostmsgStream);

var _streamToPullStream = require('stream-to-pull-stream');

var _streamToPullStream2 = _interopRequireDefault(_streamToPullStream);

var _isStream = require('is-stream');

var _isStream2 = _interopRequireDefault(_isStream);

var _isPullStream = require('is-pull-stream');

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _prepost = require('prepost');

var _pullDefer = require('pull-defer');

var _pullDefer2 = _interopRequireDefault(_pullDefer);

var _pullAbortable = require('pull-abortable');

var _pullAbortable2 = _interopRequireDefault(_pullAbortable);

var _buffer = require('../../serialization/buffer');

var _function = require('../../serialization/function');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createOnProgressIncrement(onProgress) {
  var bytes = 0;
  return function (incrementBytes) {
    bytes += incrementBytes;
    onProgress(bytes);
    return bytes;
  };
}

function fileToJson(file, opts) {
  opts = opts || {};

  if ((0, _buffer.isBuffer)(file)) {
    // Buffer
    if (opts.onProgressIncrement) opts.onProgressIncrement(file.length);
    return (0, _buffer.bufferToJson)(file);
  } else if (_isStream2.default.readable(file)) {
    // Node stream
    return pullStreamToJson(_streamToPullStream2.default.source(file), opts);
  } else if ((0, _isPullStream.isSource)(file)) {
    // Pull stream
    return pullStreamToJson(file, opts);
  } else if (file && file.content) {
    // Object { path?, content }
    return Object.assign({}, file, { content: fileToJson(file.content, opts) });
  }

  return file; // Object { path } maybe, but could be anything
}

var pullStreamToJson = function pullStreamToJson(source, opts) {
  opts = opts || {};
  var readFnName = (0, _shortid2.default)();

  (0, _pullStream2.default)(source, _pullPostmsgStream2.default.sink(readFnName, Object.assign({}, opts.pms, {
    post: function post(res) {
      if ((0, _buffer.isBuffer)(res.data)) {
        if (opts.onProgressIncrement) opts.onProgressIncrement(res.data.length);
        res.data = (0, _buffer.bufferToJson)(res.data);
      }

      return res;
    }
  })));

  return (0, _function.functionToJson)(readFnName);
};
//# sourceMappingURL=add.js.map