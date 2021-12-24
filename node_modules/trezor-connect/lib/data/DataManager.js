"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _networkUtils = require("../env/node/networkUtils");

var _ConnectSettings = require("../data/ConnectSettings");

var _CoinInfo = require("./CoinInfo");

var _FirmwareInfo = require("./FirmwareInfo");

var _TransportInfo = require("./TransportInfo");

var _parseUri = _interopRequireDefault(require("parse-uri"));

var _versionUtils = require("../utils/versionUtils");

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// TODO: transform json to flow typed object
var parseConfig = function parseConfig(json) {
  var config = json;
  return config;
};

var DataManager = /*#__PURE__*/function () {
  function DataManager() {}

  DataManager.load = /*#__PURE__*/function () {
    var _load = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(settings, withAssets) {
      var ts, config, isLocalhost, whitelist, knownHost, _iterator, _step, asset, json, _iterator2, _step2, protobuf, _json;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (withAssets === void 0) {
                withAssets = true;
              }

              ts = settings.env === 'web' ? "?r=" + settings.timestamp : '';
              this.settings = settings;
              _context.next = 5;
              return (0, _networkUtils.httpRequest)("" + settings.configSrc + ts, 'json');

            case 5:
              config = _context.sent;
              this.config = parseConfig(config); // check if origin is localhost or trusted

              isLocalhost = typeof window !== 'undefined' && window.location ? window.location.hostname === 'localhost' : true;
              whitelist = DataManager.isWhitelisted(this.settings.origin || '');
              this.settings.trustedHost = (isLocalhost || !!whitelist) && !this.settings.popup; // ensure that popup will be used

              if (!this.settings.trustedHost) {
                this.settings.popup = true;
              } // ensure that debug is disabled


              if (!this.settings.trustedHost && !whitelist) {
                this.settings.debug = false;
              }

              this.settings.priority = DataManager.getPriority(whitelist);
              knownHost = DataManager.getHostLabel(this.settings.extension || this.settings.origin || '');

              if (knownHost) {
                this.settings.hostLabel = knownHost.label;
                this.settings.hostIcon = knownHost.icon;
              } // hotfix webusb + chrome:72, allow webextensions


              if (this.settings.popup && this.settings.webusb && this.settings.env !== 'webextension') {
                this.settings.webusb = false;
              }

              if (withAssets) {
                _context.next = 18;
                break;
              }

              return _context.abrupt("return");

            case 18:
              _iterator = _createForOfIteratorHelperLoose(this.config.assets);

            case 19:
              if ((_step = _iterator()).done) {
                _context.next = 27;
                break;
              }

              asset = _step.value;
              _context.next = 23;
              return (0, _networkUtils.httpRequest)("" + asset.url + ts, asset.type || 'json');

            case 23:
              json = _context.sent;
              this.assets[asset.name] = json;

            case 25:
              _context.next = 19;
              break;

            case 27:
              _iterator2 = _createForOfIteratorHelperLoose(this.config.messages);

            case 28:
              if ((_step2 = _iterator2()).done) {
                _context.next = 36;
                break;
              }

              protobuf = _step2.value;
              _context.next = 32;
              return (0, _networkUtils.httpRequest)("" + protobuf.json + ts, 'json');

            case 32:
              _json = _context.sent;
              this.messages[protobuf.name] = _json;

            case 34:
              _context.next = 28;
              break;

            case 36:
              // parse bridge JSON
              (0, _TransportInfo.parseBridgeJSON)(this.assets['bridge']); // parse coins definitions

              (0, _CoinInfo.parseCoinsJson)(this.assets['coins']); // parse firmware definitions

              (0, _FirmwareInfo.parseFirmware)(this.assets['firmware-t1'], 1);
              (0, _FirmwareInfo.parseFirmware)(this.assets['firmware-t2'], 2);

            case 40:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function load(_x, _x2) {
      return _load.apply(this, arguments);
    }

    return load;
  }();

  DataManager.getProtobufMessages = function getProtobufMessages(version) {
    // empty array = unacquired device
    if (!version || !version.length) return this.messages['default'];
    var model = version[0] - 1;
    var messages = this.config.messages.find(function (m) {
      var min = m.range.min[model];
      var max = m.range.max ? m.range.max[model] : version;
      return (0, _versionUtils.versionCompare)(version, min) >= 0 && (0, _versionUtils.versionCompare)(version, max) <= 0;
    });
    return this.messages[messages ? messages.name : 'default'];
  };

  DataManager.isWhitelisted = function isWhitelisted(origin) {
    if (!this.config) return null;
    var uri = (0, _parseUri["default"])(origin);

    if (uri && typeof uri.host === 'string') {
      var parts = uri.host.split('.');

      if (parts.length > 2) {
        // subdomain
        uri.host = parts.slice(parts.length - 2, parts.length).join('.');
      }

      return this.config.whitelist.find(function (item) {
        return item.origin === origin || item.origin === uri.host;
      });
    }
  };

  DataManager.isManagementAllowed = function isManagementAllowed() {
    var _this = this;

    if (!this.config) return;
    var uri = (0, _parseUri["default"])(this.settings.origin);

    if (uri && typeof uri.host === 'string') {
      var parts = uri.host.split('.');

      if (parts.length > 2) {
        // subdomain
        uri.host = parts.slice(parts.length - 2, parts.length).join('.');
      }

      return this.config.management.find(function (item) {
        return item.origin === _this.settings.origin || item.origin === uri.host;
      });
    }
  };

  DataManager.getPriority = function getPriority(whitelist) {
    if (whitelist) {
      return whitelist.priority;
    }

    return _ConnectSettings.DEFAULT_PRIORITY;
  };

  DataManager.getHostLabel = function getHostLabel(origin) {
    return this.config.knownHosts.find(function (host) {
      return host.origin === origin;
    });
  };

  DataManager.getSettings = function getSettings(key) {
    if (!this.settings) return null;

    if (typeof key === 'string') {
      return this.settings[key];
    }

    return this.settings;
  };

  DataManager.getDebugSettings = function getDebugSettings(type) {
    return false;
  };

  DataManager.getConfig = function getConfig() {
    return this.config;
  };

  return DataManager;
}();

exports["default"] = DataManager;
(0, _defineProperty2["default"])(DataManager, "assets", {});
(0, _defineProperty2["default"])(DataManager, "messages", {});