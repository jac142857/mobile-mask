"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reactNative = require("react-native");

// $FlowIssue: 'react-native' is not a dependency
var bufferToHex = function bufferToHex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), function (x) {
    return ('00' + x.toString(16)).slice(-2);
  }).join('');
};

var toArrayBuffer = function toArrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  var len = buffer.length;

  for (var i = 0; i < len; ++i) {
    view[i] = buffer[i];
  }

  return ab;
};

var ReactNativePlugin = /*#__PURE__*/function () {
  function ReactNativePlugin() {
    (0, _defineProperty2["default"])(this, "name", 'ReactNativePlugin');
    (0, _defineProperty2["default"])(this, "version", '1.0.0');
    (0, _defineProperty2["default"])(this, "debug", false);
    (0, _defineProperty2["default"])(this, "allowsWriteAndEnumerate", true);
    (0, _defineProperty2["default"])(this, "requestNeeded", false);
    this.usb = _reactNative.NativeModules.RNBridge;
  }

  var _proto = ReactNativePlugin.prototype;

  _proto.init = /*#__PURE__*/function () {
    var _init = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(debug) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.debug = !!debug;

              if (this.usb) {
                _context.next = 3;
                break;
              }

              throw new Error('ReactNative plugin is not available');

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function init(_x) {
      return _init.apply(this, arguments);
    }

    return init;
  }();

  _proto.enumerate = /*#__PURE__*/function () {
    var _enumerate = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", this.usb.enumerate());

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function enumerate() {
      return _enumerate.apply(this, arguments);
    }

    return enumerate;
  }();

  _proto.send = /*#__PURE__*/function () {
    var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(path, data, debugLink) {
      var dataHex;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              dataHex = bufferToHex(data);
              return _context3.abrupt("return", this.usb.write(path, debugLink, dataHex));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function send(_x2, _x3, _x4) {
      return _send.apply(this, arguments);
    }

    return send;
  }();

  _proto.receive = /*#__PURE__*/function () {
    var _receive = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(path, debugLink) {
      var _yield$this$usb$read, data;

      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.usb.read(path, debugLink);

            case 2:
              _yield$this$usb$read = _context4.sent;
              data = _yield$this$usb$read.data;
              return _context4.abrupt("return", toArrayBuffer(Buffer.from(data, 'hex')));

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function receive(_x5, _x6) {
      return _receive.apply(this, arguments);
    }

    return receive;
  }();

  _proto.connect = /*#__PURE__*/function () {
    var _connect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(path, debugLink) {
      var _this = this;

      var _loop, i, _ret;

      return _regenerator["default"].wrap(function _callee5$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop(i) {
                return _regenerator["default"].wrap(function _loop$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        if (!(i > 0)) {
                          _context5.next = 3;
                          break;
                        }

                        _context5.next = 3;
                        return new Promise(function (resolve) {
                          return setTimeout(function () {
                            return resolve();
                          }, i * 200);
                        });

                      case 3:
                        _context5.prev = 3;
                        _context5.next = 6;
                        return _this.usb.acquire(path, debugLink);

                      case 6:
                        return _context5.abrupt("return", {
                          v: void 0
                        });

                      case 9:
                        _context5.prev = 9;
                        _context5.t0 = _context5["catch"](3);

                        if (!(i === 4)) {
                          _context5.next = 13;
                          break;
                        }

                        throw _context5.t0;

                      case 13:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _loop, null, [[3, 9]]);
              });
              i = 0;

            case 2:
              if (!(i < 5)) {
                _context6.next = 10;
                break;
              }

              return _context6.delegateYield(_loop(i), "t0", 4);

            case 4:
              _ret = _context6.t0;

              if (!(typeof _ret === "object")) {
                _context6.next = 7;
                break;
              }

              return _context6.abrupt("return", _ret.v);

            case 7:
              i++;
              _context6.next = 2;
              break;

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee5);
    }));

    function connect(_x7, _x8) {
      return _connect.apply(this, arguments);
    }

    return connect;
  }();

  _proto.disconnect = /*#__PURE__*/function () {
    var _disconnect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(path, debugLink, last) {
      return _regenerator["default"].wrap(function _callee6$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              return _context7.abrupt("return", this.usb.release(path, debugLink, last));

            case 1:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee6, this);
    }));

    function disconnect(_x9, _x10, _x11) {
      return _disconnect.apply(this, arguments);
    }

    return disconnect;
  }();

  return ReactNativePlugin;
}();

exports["default"] = ReactNativePlugin;