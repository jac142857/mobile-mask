"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _debug = _interopRequireWildcard(require("./debug"));

var _log = (0, _debug.init)('InteractionTimeout');

var InteractionTimeout = /*#__PURE__*/function () {
  function InteractionTimeout(seconds) {
    (0, _defineProperty2["default"])(this, "timeout", null);
    (0, _defineProperty2["default"])(this, "seconds", 0);

    if (seconds) {
      this.seconds = seconds;
    }
  }

  var _proto = InteractionTimeout.prototype;

  /**
   * Start the interaction timer.
   * The timer will fire the cancel function once reached
   * @param {function} cancelFn Function called once the timeout is reached
   * @param {number} seconds Optional parameter to override the seconds property
   * @returns {void}
   */
  _proto.start = function start(cancelFn, seconds) {
    var time = seconds || this.seconds; // Not worth running for less than a second

    if (time < 1) {
      return;
    } // Clear any previous timeouts set (reset)


    this.stop();

    _log.log("starting interaction timeout for " + time + " seconds");

    this.timeout = setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _log.log('interaction timed out');

              cancelFn();

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), 1000 * time);
  }
  /**
   * Stop the interaction timer
   * @returns {void}
   */
  ;

  _proto.stop = function stop() {
    if (this.timeout) {
      _log.log('clearing interaction timeout');

      clearTimeout(this.timeout);
    }
  };

  (0, _createClass2["default"])(InteractionTimeout, [{
    key: "seconds",
    get: function get() {
      return this.seconds;
    },
    set: function set(seconds) {
      this.seconds = seconds;
    }
  }]);
  return InteractionTimeout;
}();

exports["default"] = InteractionTimeout;