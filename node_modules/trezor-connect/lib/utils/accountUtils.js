"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getAccountLabel = exports.getAccountAddressN = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pathUtils = require("./pathUtils");

var _constants = require("../constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var getAccountAddressN = function getAccountAddressN(coinInfo, accountIndex, bip44) {
  if (!coinInfo) {
    throw _constants.ERRORS.TypedError('Method_UnknownCoin');
  }

  var index = typeof accountIndex === 'number' ? accountIndex : 0;

  var options = _objectSpread({
    purpose: 44,
    coinType: coinInfo.slip44
  }, bip44);

  if (coinInfo.type === 'bitcoin') {
    return [(0, _pathUtils.toHardened)(options.purpose), (0, _pathUtils.toHardened)(options.coinType), (0, _pathUtils.toHardened)(index)];
  } else if (coinInfo.type === 'ethereum') {
    return [(0, _pathUtils.toHardened)(options.purpose), (0, _pathUtils.toHardened)(options.coinType), (0, _pathUtils.toHardened)(0), 0, index];
  } else if (coinInfo.shortcut === 'tXRP') {
    // FW bug: https://github.com/trezor/trezor-firmware/issues/321
    return [(0, _pathUtils.toHardened)(options.purpose), (0, _pathUtils.toHardened)(144), (0, _pathUtils.toHardened)(index), 0, 0];
  } else {
    // TODO: cover all misc coins or throw error
    return [(0, _pathUtils.toHardened)(options.purpose), (0, _pathUtils.toHardened)(options.coinType), (0, _pathUtils.toHardened)(index), 0, 0];
  }
};

exports.getAccountAddressN = getAccountAddressN;

var getAccountLabel = function getAccountLabel(path, coinInfo) {
  if (coinInfo.type === 'bitcoin') {
    var accountType = (0, _pathUtils.fromHardened)(path[0]);
    var account = (0, _pathUtils.fromHardened)(path[2]);
    var prefix = '';

    if (accountType === 48) {
      prefix = 'multisig';
    } else if (accountType === 49 && coinInfo.segwit) {
      prefix = 'segwit';
    } else if (accountType === 44 && coinInfo.segwit) {
      prefix = 'legacy';
    }

    return prefix + " <span>account #" + (account + 1) + "</span>";
  } else {
    var _account = (0, _pathUtils.fromHardened)(path[4]);

    return "account #" + (_account + 1);
  }
};

exports.getAccountLabel = getAccountLabel;