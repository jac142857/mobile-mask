// bridge v2 is half-way between lowlevel and not
// however, it is not doing actual sending in/to the devices
// and it refers enumerate to bridge
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _semverCompare = _interopRequireDefault(require("semver-compare"));

var _http = require("./http");

var check = _interopRequireWildcard(require("../highlevel-checks"));

var _send = require("../lowlevel/send");

var _parse_protocol = require("../lowlevel/protobuf/parse_protocol");

var _receive = require("../lowlevel/receive");

var _debugDecorator = require("../debug-decorator");

var _class, _temp;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

var DEFAULT_URL = "http://127.0.0.1:21325";
var DEFAULT_VERSION_URL = "https://wallet.trezor.io/data/bridge/latest.txt";
var BridgeTransport = (_class = (_temp = /*#__PURE__*/function () {
  function BridgeTransport(url, newestVersionUrl) {
    _classCallCheck(this, BridgeTransport);

    this.name = "BridgeTransport";
    this.version = "";
    this.debug = false;
    this.configured = false;
    this.stopped = false;
    this.requestNeeded = false;
    this.url = url == null ? DEFAULT_URL : url;
    this.newestVersionUrl = newestVersionUrl == null ? DEFAULT_VERSION_URL : newestVersionUrl;
  }

  _createClass(BridgeTransport, [{
    key: "_post",
    value: function () {
      var _post2 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee(options) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.stopped) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", Promise.reject("Transport stopped."));

              case 2:
                _context.next = 4;
                return (0, _http.request)(_objectSpread(_objectSpread({}, options), {}, {
                  method: "POST",
                  url: this.url + options.url,
                  skipContentTypeHeader: true
                }));

              case 4:
                return _context.abrupt("return", _context.sent);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _post(_x) {
        return _post2.apply(this, arguments);
      }

      return _post;
    }()
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee2(debug) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.debug = !!debug;
                _context2.next = 3;
                return this._silentInit();

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function init(_x2) {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "_silentInit",
    value: function () {
      var _silentInit2 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        var infoS, info, newVersion;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _http.request)({
                  url: this.url,
                  method: "POST"
                });

              case 2:
                infoS = _context3.sent;
                info = check.info(infoS);
                this.version = info.version;

                if (!(typeof this.bridgeVersion === "string")) {
                  _context3.next = 9;
                  break;
                }

                _context3.t0 = this.bridgeVersion;
                _context3.next = 14;
                break;

              case 9:
                _context3.t1 = check;
                _context3.next = 12;
                return (0, _http.request)({
                  url: "".concat(this.newestVersionUrl, "?").concat(Date.now()),
                  method: "GET"
                });

              case 12:
                _context3.t2 = _context3.sent;
                _context3.t0 = _context3.t1.version.call(_context3.t1, _context3.t2);

              case 14:
                newVersion = _context3.t0;
                this.isOutdated = (0, _semverCompare["default"])(this.version, newVersion) < 0;

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _silentInit() {
        return _silentInit2.apply(this, arguments);
      }

      return _silentInit;
    }()
  }, {
    key: "configure",
    value: function () {
      var _configure = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee4(signedData) {
        var messages;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                messages = (0, _parse_protocol.parseConfigure)(signedData);
                this.configured = true;
                this._messages = messages;

              case 3:
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
    }()
  }, {
    key: "listen",
    value: function () {
      var _listen = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee5(old) {
        var devicesS, devices;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(old == null)) {
                  _context5.next = 2;
                  break;
                }

                throw new Error("Bridge v2 does not support listen without previous.");

              case 2:
                _context5.next = 4;
                return this._post({
                  url: "/listen",
                  body: old
                });

              case 4:
                devicesS = _context5.sent;
                devices = check.devices(devicesS);
                return _context5.abrupt("return", devices);

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function listen(_x4) {
        return _listen.apply(this, arguments);
      }

      return listen;
    }()
  }, {
    key: "enumerate",
    value: function () {
      var _enumerate = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        var devicesS, devices;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._post({
                  url: "/enumerate"
                });

              case 2:
                devicesS = _context6.sent;
                devices = check.devices(devicesS);
                return _context6.abrupt("return", devices);

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function enumerate() {
        return _enumerate.apply(this, arguments);
      }

      return enumerate;
    }()
  }, {
    key: "_acquireMixed",
    value: function () {
      var _acquireMixed2 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee7(input, debugLink) {
        var previousStr, url;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                previousStr = input.previous == null ? "null" : input.previous;
                url = (debugLink ? "/debug" : "") + "/acquire/" + input.path + "/" + previousStr;
                return _context7.abrupt("return", this._post({
                  url: url
                }));

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function _acquireMixed(_x5, _x6) {
        return _acquireMixed2.apply(this, arguments);
      }

      return _acquireMixed;
    }()
  }, {
    key: "acquire",
    value: function () {
      var _acquire = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee8(input, debugLink) {
        var acquireS;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this._acquireMixed(input, debugLink);

              case 2:
                acquireS = _context8.sent;
                return _context8.abrupt("return", check.acquire(acquireS));

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function acquire(_x7, _x8) {
        return _acquire.apply(this, arguments);
      }

      return acquire;
    }()
  }, {
    key: "release",
    value: function () {
      var _release = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee9(session, onclose, debugLink) {
        var res;
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                res = this._post({
                  url: (debugLink ? "/debug" : "") + "/release/" + session
                });

                if (!onclose) {
                  _context9.next = 3;
                  break;
                }

                return _context9.abrupt("return");

              case 3:
                _context9.next = 5;
                return res;

              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function release(_x9, _x10, _x11) {
        return _release.apply(this, arguments);
      }

      return release;
    }()
  }, {
    key: "call",
    value: function () {
      var _call = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee10(session, name, data, debugLink) {
        var messages, outData, resData, jsonData;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (!(this._messages == null)) {
                  _context10.next = 2;
                  break;
                }

                throw new Error("Transport not configured.");

              case 2:
                messages = this._messages;
                outData = (0, _send.buildOne)(messages, name, data).toString("hex");
                _context10.next = 6;
                return this._post({
                  url: (debugLink ? "/debug" : "") + "/call/" + session,
                  body: outData
                });

              case 6:
                resData = _context10.sent;

                if (!(typeof resData !== "string")) {
                  _context10.next = 9;
                  break;
                }

                throw new Error("Returning data is not string.");

              case 9:
                jsonData = (0, _receive.receiveOne)(messages, new Buffer(resData, "hex"));
                return _context10.abrupt("return", check.call(jsonData));

              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function call(_x12, _x13, _x14, _x15) {
        return _call.apply(this, arguments);
      }

      return call;
    }()
  }, {
    key: "post",
    value: function () {
      var _post3 = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee11(session, name, data, debugLink) {
        var messages, outData;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                if (!(this._messages == null)) {
                  _context11.next = 2;
                  break;
                }

                throw new Error("Transport not configured.");

              case 2:
                messages = this._messages;
                outData = (0, _send.buildOne)(messages, name, data).toString("hex");
                _context11.next = 6;
                return this._post({
                  url: (debugLink ? "/debug" : "") + "/post/" + session,
                  body: outData
                });

              case 6:
                return _context11.abrupt("return");

              case 7:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function post(_x16, _x17, _x18, _x19) {
        return _post3.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: "read",
    value: function () {
      var _read = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee12(session, debugLink) {
        var messages, resData, jsonData;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                if (!(this._messages == null)) {
                  _context12.next = 2;
                  break;
                }

                throw new Error("Transport not configured.");

              case 2:
                messages = this._messages;
                _context12.next = 5;
                return this._post({
                  url: (debugLink ? "/debug" : "") + "/read/" + session
                });

              case 5:
                resData = _context12.sent;

                if (!(typeof resData !== "string")) {
                  _context12.next = 8;
                  break;
                }

                throw new Error("Returning data is not string.");

              case 8:
                jsonData = (0, _receive.receiveOne)(messages, new Buffer(resData, "hex"));
                return _context12.abrupt("return", check.call(jsonData));

              case 10:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function read(_x20, _x21) {
        return _read.apply(this, arguments);
      }

      return read;
    }()
  }, {
    key: "requestDevice",
    value: function requestDevice() {
      return Promise.reject();
    }
  }, {
    key: "setBridgeLatestUrl",
    value: function setBridgeLatestUrl(url) {
      this.newestVersionUrl = url;
    }
  }, {
    key: "setBridgeLatestVersion",
    value: function setBridgeLatestVersion(version) {
      this.bridgeVersion = version;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.stopped = true;
    }
  }], [{
    key: "setFetch",
    value: function setFetch(fetch, isNode) {
      (0, _http.setFetch)(fetch, isNode);
    }
  }]);

  return BridgeTransport;
}(), _temp), (_applyDecoratedDescriptor(_class.prototype, "init", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "init"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "configure", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "configure"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "listen", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "listen"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "enumerate", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "enumerate"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "acquire", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "acquire"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "release", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "release"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "call", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "call"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "post", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "post"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "read", [_debugDecorator.debugInOut], Object.getOwnPropertyDescriptor(_class.prototype, "read"), _class.prototype)), _class);
exports["default"] = BridgeTransport;
module.exports = exports.default;