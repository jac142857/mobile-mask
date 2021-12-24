"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.suggestBridgeInstaller = exports.getBrowserState = exports.state = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _bowser = _interopRequireDefault(require("bowser"));

var _TransportInfo = require("../../data/TransportInfo");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var state = {
  name: 'unknown',
  osname: 'unknown',
  supported: false,
  outdated: false,
  mobile: false
};
exports.state = state;

var getBrowserState = function getBrowserState(supportedBrowsers) {
  if (typeof window === 'undefined') return state;

  var _Bowser$parse = _bowser["default"].parse(window.navigator.userAgent),
      browser = _Bowser$parse.browser,
      os = _Bowser$parse.os,
      platform = _Bowser$parse.platform;

  var mobile = platform.type !== 'desktop';
  var supported = !!supportedBrowsers[browser.name.toLowerCase()];
  var outdated = false;

  if (mobile && typeof navigator.usb === 'undefined') {
    supported = false;
  }

  if (supported) {
    var version = supportedBrowsers[browser.name.toLowerCase()].version;
    outdated = version > parseInt(browser.version, 10);
    supported = !outdated;
  }

  return {
    name: browser.name + ": " + browser.version + "; " + os.name + ": " + os.version + ";",
    osname: os.name,
    mobile: mobile,
    supported: supported,
    outdated: outdated
  };
};

exports.getBrowserState = getBrowserState;

var getSuggestedBridgeInstaller = function getSuggestedBridgeInstaller() {
  if (!navigator || !navigator.userAgent) return; // Find preferred platform using bowser and userAgent

  var agent = navigator.userAgent;

  var browser = _bowser["default"].getParser(agent);

  var name = browser.getOS().name.toLowerCase();

  switch (name) {
    case 'linux':
      {
        var isRpm = agent.match(/CentOS|Fedora|Mandriva|Mageia|Red Hat|Scientific|SUSE/) ? 'rpm' : 'deb';
        var is64x = agent.match(/Linux i[3456]86/) ? '32' : '64';
        return "" + isRpm + is64x;
      }

    case 'macos':
      return 'mac';

    case 'windows':
      {
        var arch = agent.match(/(Win64|WOW64)/) ? '64' : '32';
        return "win" + arch;
      }

    default:
      break;
  }
};

var suggestBridgeInstaller = function suggestBridgeInstaller() {
  var info = (0, _TransportInfo.getBridgeInfo)(); // check if preferred field was already added

  if (!info.packages.find(function (p) {
    return p.preferred;
  })) {
    var preferred = getSuggestedBridgeInstaller();

    if (preferred) {
      // override BridgeInfo packages, add preferred field
      info.packages = info.packages.map(function (p) {
        return _objectSpread(_objectSpread({}, p), {}, {
          preferred: p.platform.indexOf(preferred) >= 0
        });
      });
    }
  }

  return info;
};

exports.suggestBridgeInstaller = suggestBridgeInstaller;