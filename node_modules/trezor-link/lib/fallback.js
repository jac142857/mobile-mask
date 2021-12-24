"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _debugDecorator = require("./debug-decorator");

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

var FallbackTransport = (_class = (_temp = /*#__PURE__*/function () {
  function FallbackTransport(transports) {
    _classCallCheck(this, FallbackTransport);

    this.name = "FallbackTransport";
    this.activeName = "";
    this.debug = false;
    this.requestNeeded = false;
    this.transports = transports;
  } // first one that inits successfuly is the final one; others won't even start initing


  _createClass(FallbackTransport, [{
    key: "_tryInitTransports",
    value: function () {
      var _tryInitTransports2 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var res, lastError, _iterator, _step, transport;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                res = [];
                lastError = null;
                _iterator = _createForOfIteratorHelper(this.transports);
                _context.prev = 3;

                _iterator.s();

              case 5:
                if ((_step = _iterator.n()).done) {
                  _context.next = 18;
                  break;
                }

                transport = _step.value;
                _context.prev = 7;
                _context.next = 10;
                return transport.init(this.debug);

              case 10:
                res.push(transport);
                _context.next = 16;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](7);
                lastError = _context.t0;

              case 16:
                _context.next = 5;
                break;

              case 18:
                _context.next = 23;
                break;

              case 20:
                _context.prev = 20;
                _context.t1 = _context["catch"](3);

                _iterator.e(_context.t1);

              case 23:
                _context.prev = 23;

                _iterator.f();

                return _context.finish(23);

              case 26:
                if (!(res.length === 0)) {
                  _context.next = 28;
                  break;
                }

                throw lastError || new Error("No transport could be initialized.");

              case 28:
                return _context.abrupt("return", res);

              case 29:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 20, 23, 26], [7, 13]]);
      }));

      function _tryInitTransports() {
        return _tryInitTransports2.apply(this, arguments);
      }

      return _tryInitTransports;
    }() // first one that inits successfuly is the final one; others won't even start initing

  }, {
    key: "_tryConfigureTransports",
    value: function () {
      var _tryConfigureTransports2 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
        var lastError, _iterator2, _step2, transport;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                lastError = null;
                _iterator2 = _createForOfIteratorHelper(this._availableTransports);
                _context2.prev = 2;

                _iterator2.s();

              case 4:
                if ((_step2 = _iterator2.n()).done) {
                  _context2.next = 17;
                  break;
                }

                transport = _step2.value;
                _context2.prev = 6;
                _context2.next = 9;
                return transport.configure(data);

              case 9:
                return _context2.abrupt("return", transport);

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](6);
                lastError = _context2.t0;

              case 15:
                _context2.next = 4;
                break;

              case 17:
                _context2.next = 22;
                break;

              case 19:
                _context2.prev = 19;
                _context2.t1 = _context2["catch"](2);

                _iterator2.e(_context2.t1);

              case 22:
                _context2.prev = 22;

                _iterator2.f();

                return _context2.finish(22);

              case 25:
                throw lastError || new Error("No transport could be initialized.");

              case 26:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 19, 22, 25], [6, 12]]);
      }));

      function _tryConfigureTransports(_x) {
        return _tryConfigureTransports2.apply(this, arguments);
      }

      return _tryConfigureTransports;
    }()
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee3(debug) {
        var transports;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.debug = !!debug; // init ALL OF THEM

                _context3.next = 3;
                return this._tryInitTransports();

              case 3:
                transports = _context3.sent;
                this._availableTransports = transports; // a slight hack - configured is always false, so we force caller to call configure()
                // to find out the actual working transport (bridge falls on configure, not on info)

                this.version = transports[0].version;
                this.configured = false;

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function init(_x2) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "configure",
    value: function () {
      var _configure = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee4(signedData) {
        var pt;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                pt = this._tryConfigureTransports(signedData);
                _context4.next = 3;
                return pt;

              case 3:
                this.activeTransport = _context4.sent;
                this.configured = this.activeTransport.configured;
                this.version = this.activeTransport.version;
                this.activeName = this.activeTransport.name;
                this.requestNeeded = this.activeTransport.requestNeeded;
                this.isOutdated = this.activeTransport.isOutdated;

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function configure(_x3) {
        return _configure.apply(this, arguments);
      }

      return configure;
    }() // using async so I get Promise.recect on this.activeTransport == null (or other error), not Error

  }, {
    key: "enumerate",
    value: function () {
      var _enumerate = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", this.activeTransport.enumerate());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function enumerate() {
        return _enumerate.apply(this, arguments);
      }

      return enumerate;
    }()
  }, {
    key: "listen",
    value: function () {
      var _listen = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee6(old) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this.activeTransport.listen(old));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function listen(_x4) {
        return _listen.apply(this, arguments);
      }

      return listen;
    }()
  }, {
    key: "acquire",
    value: function () {
      var _acquire = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee7(input, debugLink) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", this.activeTransport.acquire(input, debugLink));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function acquire(_x5, _x6) {
        return _acquire.apply(this, arguments);
      }

      return acquire;
    }()
  }, {
    key: "release",
    value: function () {
      var _release = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee8(session, onclose, debugLink) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", this.activeTransport.release(session, onclose, debugLink));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function release(_x7, _x8, _x9) {
        return _release.apply(this, arguments);
      }

      return release;
    }()
  }, {
    key: "call",
    value: function () {
      var _call = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee9(session, name, data, debugLink) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", this.activeTransport.call(session, name, data, debugLink));

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function call(_x10, _x11, _x12, _x13) {
        return _call.apply(this, arguments);
      }

      return call;
    }()
  }, {
    key: "post",
    value: function () {
      var _post = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee10(session, name, data, debugLink) {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", this.activeTransport.post(session, name, data, debugLink));

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function post(_x14, _x15, _x16, _x17) {
        return _post.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: "read",
    value: function () {
      var _read = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee11(session, debugLink) {
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", this.activeTransport.read(session, debugLink));

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function read(_x18, _x19) {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: "requestDevice",
    value: function () {
      var _requestDevice = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", this.activeTransport.requestDevice());

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function requestDevice() {
        return _requestDevice.apply(this, arguments);
      }

      return requestDevice;
    }()
  }, {
    key: "setBridgeLatestUrl",
    value: function setBridgeLatestUrl(url) {
      var _iterator3 = _createForOfIteratorHelper(this.transports),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var transport = _step3.value;
          transport.setBridgeLatestUrl(url);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "setBridgeLatestVersion",
    value: function setBridgeLatestVersion(version) {
      var _iterator4 = _createForOfIteratorHelper(this.transports),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var transport = _step4.value;
          transport.setBridgeLatestVersion(version);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      var _iterator5 = _createForOfIteratorHelper(this.transports),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var transport = _step5.value;
          transport.stop();
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }]);

  return FallbackTransport;
}(), _temp), (_applyDecoratedDescriptor(_class.prototype, "init", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "init"), _class.prototype)), _class);
exports["default"] = FallbackTransport;
module.exports = exports.default;