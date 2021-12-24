"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _monkey_patch = require("./protobuf/monkey_patch");

var _defered = require("../defered");

var _parse_protocol = require("./protobuf/parse_protocol");

var _send = require("./send");

var _receive = require("./receive");

var _debugDecorator = require("../debug-decorator");

var _sharedConnectionWorker = require("./sharedConnectionWorker");

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

(0, _monkey_patch.patch)();

// eslint-disable-next-line quotes
var stringify = require('json-stable-stringify');

function stableStringify(devices) {
  if (devices == null) {
    return "null";
  }

  var pureDevices = devices.map(function (device) {
    var path = device.path;
    var session = device.session == null ? null : device.session;
    return {
      path: path,
      session: session
    };
  });
  return stringify(pureDevices);
}

function compare(a, b) {
  if (!isNaN(parseInt(a.path))) {
    return parseInt(a.path) - parseInt(b.path);
  } else {
    return a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
  }
}

var ITER_MAX = 60;
var ITER_DELAY = 500;
var LowlevelTransportWithSharedConnections = (_class = (_temp = /*#__PURE__*/function () {
  // path => promise rejecting on release
  function LowlevelTransportWithSharedConnections(plugin, sharedWorkerFactory) {
    _classCallCheck(this, LowlevelTransportWithSharedConnections);

    this.name = "LowlevelTransportWithSharedConnections";
    this.debug = false;
    this.deferedDebugOnRelease = {};
    this.deferedNormalOnRelease = {};
    this.configured = false;
    this.stopped = false;
    this._lastStringified = "";
    this.requestNeeded = false;
    this.latestId = 0;
    this.defereds = {};
    this.isOutdated = false;
    this.plugin = plugin;
    this.version = plugin.version;
    this._sharedWorkerFactory = sharedWorkerFactory;

    if (!this.plugin.allowsWriteAndEnumerate) {
      // This should never happen anyway
      throw new Error("Plugin with shared connections cannot disallow write and enumerate");
    }
  }

  _createClass(LowlevelTransportWithSharedConnections, [{
    key: "enumerate",
    value: function enumerate() {
      return this._silentEnumerate();
    }
  }, {
    key: "_silentEnumerate",
    value: function () {
      var _silentEnumerate2 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var devices, sessionsM, debugSessions, normalSessions, devicesWithSessions;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.sendToWorker({
                  type: "enumerate-intent"
                });

              case 2:
                devices = [];
                _context.prev = 3;
                _context.next = 6;
                return this.plugin.enumerate();

              case 6:
                devices = _context.sent;

              case 7:
                _context.prev = 7;
                _context.next = 10;
                return this.sendToWorker({
                  type: "enumerate-done"
                });

              case 10:
                return _context.finish(7);

              case 11:
                _context.next = 13;
                return this.sendToWorker({
                  type: "get-sessions-and-disconnect",
                  devices: devices
                });

              case 13:
                sessionsM = _context.sent;

                if (!(sessionsM.type !== "sessions")) {
                  _context.next = 16;
                  break;
                }

                throw new Error("Wrong reply");

              case 16:
                debugSessions = sessionsM.debugSessions;
                normalSessions = sessionsM.normalSessions;
                devicesWithSessions = devices.map(function (device) {
                  var session = normalSessions[device.path];
                  var debugSession = debugSessions[device.path];
                  return {
                    path: device.path,
                    session: session,
                    debug: device.debug,
                    debugSession: debugSession
                  };
                });

                this._releaseDisconnected(devicesWithSessions);

                return _context.abrupt("return", devicesWithSessions.sort(compare));

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3,, 7, 11]]);
      }));

      function _silentEnumerate() {
        return _silentEnumerate2.apply(this, arguments);
      }

      return _silentEnumerate;
    }()
  }, {
    key: "_releaseDisconnected",
    value: function _releaseDisconnected(devices) {
      var _this = this;

      var connected = {};
      devices.forEach(function (device) {
        if (device.session != null) {
          connected[device.session] = true;
        }
      });
      Object.keys(this.deferedDebugOnRelease).forEach(function (session) {
        if (connected[session] == null) {
          _this._releaseCleanup(session, true);
        }
      });
      Object.keys(this.deferedNormalOnRelease).forEach(function (session) {
        if (connected[session] == null) {
          _this._releaseCleanup(session, false);
        }
      });
    }
  }, {
    key: "listen",
    value: function () {
      var _listen = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee2(old) {
        var oldStringified, last;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                oldStringified = stableStringify(old);
                last = old == null ? this._lastStringified : oldStringified;
                return _context2.abrupt("return", this._runIter(0, last));

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function listen(_x) {
        return _listen.apply(this, arguments);
      }

      return listen;
    }()
  }, {
    key: "_runIter",
    value: function () {
      var _runIter2 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee3(iteration, oldStringified) {
        var devices, stringified;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._silentEnumerate();

              case 2:
                devices = _context3.sent;
                stringified = stableStringify(devices);

                if (!(stringified !== oldStringified || iteration === ITER_MAX)) {
                  _context3.next = 7;
                  break;
                }

                this._lastStringified = stringified;
                return _context3.abrupt("return", devices);

              case 7:
                _context3.next = 9;
                return (0, _defered.resolveTimeoutPromise)(ITER_DELAY, null);

              case 9:
                return _context3.abrupt("return", this._runIter(iteration + 1, stringified));

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _runIter(_x2, _x3) {
        return _runIter2.apply(this, arguments);
      }

      return _runIter;
    }()
  }, {
    key: "acquire",
    value: function () {
      var _acquire = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee4(input, debugLink) {
        var messBack, reset, messBack2, session;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.sendToWorker({
                  type: "acquire-intent",
                  path: input.path,
                  previous: input.previous,
                  debug: debugLink
                });

              case 2:
                messBack = _context4.sent;

                if (!(messBack.type === "wrong-previous-session")) {
                  _context4.next = 5;
                  break;
                }

                throw new Error("wrong previous session");

              case 5:
                if (!(messBack.type !== "other-session")) {
                  _context4.next = 7;
                  break;
                }

                throw new Error("Strange reply");

              case 7:
                reset = messBack.otherSession == null;
                _context4.prev = 8;
                _context4.next = 11;
                return this.plugin.connect(input.path, debugLink, reset);

              case 11:
                _context4.next = 18;
                break;

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](8);
                _context4.next = 17;
                return this.sendToWorker({
                  type: "acquire-failed"
                });

              case 17:
                throw _context4.t0;

              case 18:
                _context4.next = 20;
                return this.sendToWorker({
                  type: "acquire-done"
                });

              case 20:
                messBack2 = _context4.sent;

                if (!(messBack2.type !== "session-number")) {
                  _context4.next = 23;
                  break;
                }

                throw new Error("Strange reply.");

              case 23:
                session = messBack2.number;

                if (debugLink) {
                  this.deferedDebugOnRelease[session] = (0, _defered.create)();
                } else {
                  this.deferedNormalOnRelease[session] = (0, _defered.create)();
                }

                return _context4.abrupt("return", session);

              case 26:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[8, 13]]);
      }));

      function acquire(_x4, _x5) {
        return _acquire.apply(this, arguments);
      }

      return acquire;
    }()
  }, {
    key: "release",
    value: function () {
      var _release = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee5(session, onclose, debugLink) {
        var messback, path, otherSession, last;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(onclose && !debugLink)) {
                  _context5.next = 3;
                  break;
                }

                // if we wait for worker messages, shared worker survives
                // and delays closing
                // so we "fake" release
                this.sendToWorker({
                  type: "release-onclose",
                  session: session
                });
                return _context5.abrupt("return");

              case 3:
                _context5.next = 5;
                return this.sendToWorker({
                  type: "release-intent",
                  session: session,
                  debug: debugLink
                });

              case 5:
                messback = _context5.sent;

                if (!(messback.type === "double-release")) {
                  _context5.next = 8;
                  break;
                }

                throw new Error("Trying to double release.");

              case 8:
                if (!(messback.type !== "path")) {
                  _context5.next = 10;
                  break;
                }

                throw new Error("Strange reply.");

              case 10:
                path = messback.path;
                otherSession = messback.otherSession;
                last = otherSession == null;

                this._releaseCleanup(session, debugLink);

                _context5.prev = 14;
                _context5.next = 17;
                return this.plugin.disconnect(path, debugLink, last);

              case 17:
                _context5.next = 21;
                break;

              case 19:
                _context5.prev = 19;
                _context5.t0 = _context5["catch"](14);

              case 21:
                _context5.next = 23;
                return this.sendToWorker({
                  type: "release-done"
                });

              case 23:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[14, 19]]);
      }));

      function release(_x6, _x7, _x8) {
        return _release.apply(this, arguments);
      }

      return release;
    }()
  }, {
    key: "_releaseCleanup",
    value: function _releaseCleanup(session, debugLink) {
      var table = debugLink ? this.deferedDebugOnRelease : this.deferedNormalOnRelease;

      if (table[session] != null) {
        table[session].reject(new Error("Device released or disconnected"));
        delete table[session];
      }
    }
  }, {
    key: "configure",
    value: function () {
      var _configure = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee6(signedData) {
        var messages;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                messages = (0, _parse_protocol.parseConfigure)(signedData);
                this._messages = messages;
                this.configured = true;

              case 3:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function configure(_x9) {
        return _configure.apply(this, arguments);
      }

      return configure;
    }()
  }, {
    key: "_sendLowlevel",
    value: function _sendLowlevel(path, debug) {
      var _this2 = this;

      return function (data) {
        return _this2.plugin.send(path, data, debug);
      };
    }
  }, {
    key: "_receiveLowlevel",
    value: function _receiveLowlevel(path, debug) {
      var _this3 = this;

      return function () {
        return _this3.plugin.receive(path, debug);
      };
    }
  }, {
    key: "messages",
    value: function messages() {
      if (this._messages == null) {
        throw new Error("Transport not configured.");
      }

      return this._messages;
    }
  }, {
    key: "doWithSession",
    value: function () {
      var _doWithSession = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee7(session, debugLink, inside) {
        var sessionsM, sessionsMM, path_, path, resPromise, defered;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.sendToWorker({
                  type: "get-sessions"
                });

              case 2:
                sessionsM = _context7.sent;

                if (!(sessionsM.type !== "sessions")) {
                  _context7.next = 5;
                  break;
                }

                throw new Error("Wrong reply");

              case 5:
                sessionsMM = debugLink ? sessionsM.debugSessions : sessionsM.normalSessions;
                path_ = null;
                Object.keys(sessionsMM).forEach(function (kpath) {
                  if (sessionsMM[kpath] === session) {
                    path_ = kpath;
                  }
                });

                if (!(path_ == null)) {
                  _context7.next = 10;
                  break;
                }

                throw new Error("Session not available.");

              case 10:
                path = path_;
                _context7.next = 13;
                return inside(path);

              case 13:
                resPromise = _context7.sent;
                defered = debugLink ? this.deferedDebugOnRelease[session] : this.deferedNormalOnRelease[session];
                return _context7.abrupt("return", Promise.race([defered.rejectingPromise, resPromise]));

              case 16:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function doWithSession(_x10, _x11, _x12) {
        return _doWithSession.apply(this, arguments);
      }

      return doWithSession;
    }()
  }, {
    key: "call",
    value: function () {
      var _call = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee9(session, name, data, debugLink) {
        var _this4 = this;

        var callInside;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                callInside = /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee8(path) {
                    var messages, message;
                    return _regenerator["default"].wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            messages = _this4.messages();
                            _context8.next = 3;
                            return (0, _send.buildAndSend)(messages, _this4._sendLowlevel(path, debugLink), name, data);

                          case 3:
                            _context8.next = 5;
                            return (0, _receive.receiveAndParse)(messages, _this4._receiveLowlevel(path, debugLink));

                          case 5:
                            message = _context8.sent;
                            return _context8.abrupt("return", message);

                          case 7:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8);
                  }));

                  return function callInside(_x17) {
                    return _ref.apply(this, arguments);
                  };
                }();

                return _context9.abrupt("return", this.doWithSession(session, debugLink, callInside));

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function call(_x13, _x14, _x15, _x16) {
        return _call.apply(this, arguments);
      }

      return call;
    }()
  }, {
    key: "post",
    value: function () {
      var _post = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee11(session, name, data, debugLink) {
        var _this5 = this;

        var callInside;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                callInside = /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee10(path) {
                    var messages;
                    return _regenerator["default"].wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            messages = _this5.messages();
                            _context10.next = 3;
                            return (0, _send.buildAndSend)(messages, _this5._sendLowlevel(path, debugLink), name, data);

                          case 3:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10);
                  }));

                  return function callInside(_x22) {
                    return _ref2.apply(this, arguments);
                  };
                }();

                return _context11.abrupt("return", this.doWithSession(session, debugLink, callInside));

              case 2:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function post(_x18, _x19, _x20, _x21) {
        return _post.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: "read",
    value: function () {
      var _read = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee13(session, debugLink) {
        var _this6 = this;

        var callInside;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                callInside = /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee12(path) {
                    var messages, message;
                    return _regenerator["default"].wrap(function _callee12$(_context12) {
                      while (1) {
                        switch (_context12.prev = _context12.next) {
                          case 0:
                            messages = _this6.messages();
                            _context12.next = 3;
                            return (0, _receive.receiveAndParse)(messages, _this6._receiveLowlevel(path, debugLink));

                          case 3:
                            message = _context12.sent;
                            return _context12.abrupt("return", message);

                          case 5:
                          case "end":
                            return _context12.stop();
                        }
                      }
                    }, _callee12);
                  }));

                  return function callInside(_x25) {
                    return _ref3.apply(this, arguments);
                  };
                }();

                return _context13.abrupt("return", this.doWithSession(session, debugLink, callInside));

              case 2:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function read(_x23, _x24) {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee14(debug) {
        var _this7 = this;

        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                this.debug = !!debug;
                this.requestNeeded = this.plugin.requestNeeded;
                _context14.next = 4;
                return this.plugin.init(debug);

              case 4:
                // create the worker ONLY when the plugin is successfully inited
                if (this._sharedWorkerFactory != null) {
                  this.sharedWorker = this._sharedWorkerFactory();

                  if (this.sharedWorker != null) {
                    this.sharedWorker.port.onmessage = function (e) {
                      // $FlowIssue
                      _this7.receiveFromWorker(e.data);
                    };
                  }
                }

              case 5:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function init(_x26) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "requestDevice",
    value: function () {
      var _requestDevice = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt("return", this.plugin.requestDevice());

              case 1:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function requestDevice() {
        return _requestDevice.apply(this, arguments);
      }

      return requestDevice;
    }()
  }, {
    key: "sendToWorker",
    value: function sendToWorker(message) {
      var _this8 = this;

      if (this.stopped) {
        return Promise.reject("Transport stopped.");
      }

      this.latestId++;
      var id = this.latestId;
      this.defereds[id] = (0, _defered.create)(); // when shared worker is not loaded as a shared loader, use it as a module instead

      if (this.sharedWorker != null) {
        this.sharedWorker.port.postMessage({
          id: id,
          message: message
        });
      } else {
        (0, _sharedConnectionWorker.postModuleMessage)({
          id: id,
          message: message
        }, function (m) {
          return _this8.receiveFromWorker(m);
        });
      }

      return this.defereds[id].promise;
    }
  }, {
    key: "receiveFromWorker",
    value: function receiveFromWorker(m) {
      this.defereds[m.id].resolve(m.message);
      delete this.defereds[m.id];
    }
  }, {
    key: "setBridgeLatestUrl",
    value: function setBridgeLatestUrl(url) {}
  }, {
    key: "setBridgeLatestVersion",
    value: function setBridgeLatestVersion(version) {}
  }, {
    key: "stop",
    value: function stop() {
      this.stopped = true;
      this.sharedWorker = null;
    }
  }]);

  return LowlevelTransportWithSharedConnections;
}(), _temp), (_applyDecoratedDescriptor(_class.prototype, "enumerate", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "enumerate"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "listen", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "listen"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "acquire", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "acquire"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "release", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "release"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "configure", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "configure"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "call", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "call"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "post", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "post"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "read", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "read"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "init", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "init"), _class.prototype)), _class);
exports["default"] = LowlevelTransportWithSharedConnections;
module.exports = exports.default;