'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  var subs = [
    /*
      {
        topic,      // name of the topic subscribed to
        handler,    // the handler provided by the subscriber - rpc.exposedFn calls this function
        rpc: {      // details of the exposed RPC function created to receive updates
          fnName,   // the RPC function name
          exposedFn // the exposed RPC function created by postmsg-rpc
        }
      }
    */
  ];

  var api = {
    publish: _callbackify2.default.variadic((0, _prepost.pre)((0, _buffer.preBufferToJson)(1), (0, _postmsgRpc.caller)('ipfs.pubsub.publish', opts))),
    subscribe: function subscribe(topic, handler, options, cb) {
      var sub = void 0;

      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      var stub = (0, _prepost.pre)(function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var fnName = 'ipfs.pubsub.subscribe.handler.' + (0, _shortid2.default)();

        sub = {
          topic: topic,
          handler: handler,
          rpc: {
            fnName: fnName,
            exposedFn: (0, _postmsgRpc.expose)(fnName, (0, _prepost.pre)(function () {
              for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              if (args[0]) {
                if ((0, _buffer.isBufferJson)(args[0].data)) {
                  args[0].data = (0, _buffer.bufferFromJson)(args[0].data);
                }

                if ((0, _buffer.isBufferJson)(args[0].seqno)) {
                  args[0].seqno = (0, _buffer.bufferFromJson)(args[0].seqno);
                }
              }

              return args;
            }, function () {
              for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
              }

              process.nextTick(function () {
                return handler.apply(undefined, args);
              });
              return Promise.resolve();
            }), opts)
          }
        };

        subs.push(sub);

        args[1] = (0, _function.functionToJson)(fnName);

        return args;
      },
      // If error, then remove subscription handler
      function () {
        return (0, _postmsgRpc.caller)('ipfs.pubsub.subscribe', opts).apply(undefined, arguments).catch(function (err) {
          sub.rpc.exposedFn.close();
          subs.splice(subs.indexOf(sub), 1);
          throw err;
        });
      });

      if (cb) {
        stub(topic, handler, options).then(function (res) {
          return process.nextTick(function () {
            return cb(null, res);
          });
        }).catch(function (err) {
          return process.nextTick(function () {
            return cb(err);
          });
        });
      } else {
        return stub(topic, handler, options);
      }
    },
    unsubscribe: _callbackify2.default.variadic((0, _prepost.pre)(function () {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      var topic = args[0];
      var sub = subs.find(function (s) {
        return s.topic === topic && s.handler === args[1];
      });

      if (sub) {
        args[1] = (0, _function.functionToJson)(sub.rpc.fnName);
        sub.rpc.exposedFn.close();
        subs.splice(subs.indexOf(sub), 1);
      }

      return args;
    }, (0, _postmsgRpc.caller)('ipfs.pubsub.unsubscribe', opts))),
    peers: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.pubsub.peers', opts)),
    ls: _callbackify2.default.variadic((0, _postmsgRpc.caller)('ipfs.pubsub.ls', opts)),
    // interface-ipfs-core tests use this function
    // noop since we're not an EventEmitter
    setMaxListeners: function setMaxListeners() {
      return api;
    }
  };

  return api;
};

var _postmsgRpc = require('postmsg-rpc');

var _callbackify = require('callbackify');

var _callbackify2 = _interopRequireDefault(_callbackify);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

var _prepost = require('prepost');

var _function = require('../serialization/function');

var _buffer = require('../serialization/buffer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=pubsub.js.map