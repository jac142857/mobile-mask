"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ReactNativeUsbPlugin = exports.WebUsbPlugin = void 0;

var _sharedConnectionWorker = _interopRequireDefault(require("sharedworker-loader?name=workers/shared-connection-worker.[hash].js!trezor-link/lib/lowlevel/sharedConnectionWorker"));

var _index = _interopRequireDefault(require("worker-loader?filename=workers/blockbook-worker.[hash].js!@trezor/blockchain-link/lib/workers/blockbook/index.js"));

exports.BlockbookWorker = _index["default"];

var _index2 = _interopRequireDefault(require("worker-loader?filename=workers/ripple-worker.[hash].js!@trezor/blockchain-link/lib/workers/ripple/index.js"));

exports.RippleWorker = _index2["default"];

var _trezorLink = _interopRequireDefault(require("trezor-link"));

/* eslint-disable no-unused-vars */
var WebUsbPlugin = function WebUsbPlugin() {
  return new _trezorLink["default"].Lowlevel(new _trezorLink["default"].WebUsb(), typeof SharedWorker !== 'undefined' ? function () {
    return new _sharedConnectionWorker["default"]();
  } : null);
};

exports.WebUsbPlugin = WebUsbPlugin;
var ReactNativeUsbPlugin = undefined;
exports.ReactNativeUsbPlugin = ReactNativeUsbPlugin;