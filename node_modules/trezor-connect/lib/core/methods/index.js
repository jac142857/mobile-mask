"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.find = void 0;

var _constants = require("../../constants");

var _AbstractMethod = _interopRequireDefault(require("./AbstractMethod"));

var _BlockchainDisconnect = _interopRequireDefault(require("./blockchain/BlockchainDisconnect"));

var _BlockchainEstimateFee = _interopRequireDefault(require("./blockchain/BlockchainEstimateFee"));

var _BlockchainGetAccountBalanceHistory = _interopRequireDefault(require("./blockchain/BlockchainGetAccountBalanceHistory"));

var _BlockchainGetCurrentFiatRates = _interopRequireDefault(require("./blockchain/BlockchainGetCurrentFiatRates"));

var _BlockchainGetFiatRatesForTimestamps = _interopRequireDefault(require("./blockchain/BlockchainGetFiatRatesForTimestamps"));

var _BlockchainGetTransactions = _interopRequireDefault(require("./blockchain/BlockchainGetTransactions"));

var _BlockchainSetCustomBackend = _interopRequireDefault(require("./blockchain/BlockchainSetCustomBackend"));

var _BlockchainSubscribe = _interopRequireDefault(require("./blockchain/BlockchainSubscribe"));

var _BlockchainSubscribeFiatRates = _interopRequireDefault(require("./blockchain/BlockchainSubscribeFiatRates"));

var _BlockchainUnsubscribe = _interopRequireDefault(require("./blockchain/BlockchainUnsubscribe"));

var _BlockchainUnsubscribeFiatRates = _interopRequireDefault(require("./blockchain/BlockchainUnsubscribeFiatRates"));

var _CardanoGetAddress = _interopRequireDefault(require("./CardanoGetAddress"));

var _CardanoGetPublicKey = _interopRequireDefault(require("./CardanoGetPublicKey"));

var _CardanoSignTransaction = _interopRequireDefault(require("./CardanoSignTransaction"));

var _CipherKeyValue = _interopRequireDefault(require("./CipherKeyValue"));

var _ComposeTransaction = _interopRequireDefault(require("./ComposeTransaction"));

var _CustomMessage = _interopRequireDefault(require("./CustomMessage"));

var _DebugLinkDecision = _interopRequireDefault(require("./debuglink/DebugLinkDecision"));

var _DebugLinkGetState = _interopRequireDefault(require("./debuglink/DebugLinkGetState"));

var _EthereumGetAddress = _interopRequireDefault(require("./EthereumGetAddress"));

var _EthereumGetPublicKey = _interopRequireDefault(require("./EthereumGetPublicKey"));

var _EthereumSignMessage = _interopRequireDefault(require("./EthereumSignMessage"));

var _EthereumSignTransaction = _interopRequireDefault(require("./EthereumSignTransaction"));

var _EthereumVerifyMessage = _interopRequireDefault(require("./EthereumVerifyMessage"));

var _GetAccountInfo = _interopRequireDefault(require("./GetAccountInfo"));

var _GetAddress = _interopRequireDefault(require("./GetAddress"));

var _GetDeviceState = _interopRequireDefault(require("./GetDeviceState"));

var _GetFeatures = _interopRequireDefault(require("./GetFeatures"));

var _GetPublicKey = _interopRequireDefault(require("./GetPublicKey"));

var _GetSettings = _interopRequireDefault(require("./GetSettings"));

var _LiskGetAddress = _interopRequireDefault(require("./LiskGetAddress"));

var _LiskGetPublicKey = _interopRequireDefault(require("./LiskGetPublicKey"));

var _LiskSignMessage = _interopRequireDefault(require("./LiskSignMessage"));

var _LiskVerifyMessage = _interopRequireDefault(require("./LiskVerifyMessage"));

var _LiskSignTransaction = _interopRequireDefault(require("./LiskSignTransaction"));

var _LoadDevice = _interopRequireDefault(require("./LoadDevice"));

var _PushTransaction = _interopRequireDefault(require("./PushTransaction"));

var _RequestLogin = _interopRequireDefault(require("./RequestLogin"));

var _ResetDevice = _interopRequireDefault(require("./ResetDevice"));

var _RippleGetAddress = _interopRequireDefault(require("./RippleGetAddress"));

var _RippleSignTransaction = _interopRequireDefault(require("./RippleSignTransaction"));

var _NEMGetAddress = _interopRequireDefault(require("./NEMGetAddress"));

var _NEMSignTransaction = _interopRequireDefault(require("./NEMSignTransaction"));

var _SignMessage = _interopRequireDefault(require("./SignMessage"));

var _SignTransaction = _interopRequireDefault(require("./SignTransaction"));

var _StellarGetAddress = _interopRequireDefault(require("./StellarGetAddress"));

var _StellarSignTransaction = _interopRequireDefault(require("./StellarSignTransaction"));

var _TezosGetAddress = _interopRequireDefault(require("./TezosGetAddress"));

var _TezosGetPublicKey = _interopRequireDefault(require("./TezosGetPublicKey"));

var _TezosSignTransaction = _interopRequireDefault(require("./TezosSignTransaction"));

var _EosGetPublicKey = _interopRequireDefault(require("./EosGetPublicKey"));

var _EosSignTransaction = _interopRequireDefault(require("./EosSignTransaction"));

var _BinanceGetPublicKey = _interopRequireDefault(require("./BinanceGetPublicKey"));

var _BinanceGetAddress = _interopRequireDefault(require("./BinanceGetAddress"));

var _BinanceSignTransaction = _interopRequireDefault(require("./BinanceSignTransaction"));

var _VerifyMessage = _interopRequireDefault(require("./VerifyMessage"));

var _WipeDevice = _interopRequireDefault(require("./WipeDevice"));

var _ApplyFlags = _interopRequireDefault(require("./ApplyFlags"));

var _ApplySettings = _interopRequireDefault(require("./ApplySettings"));

var _BackupDevice = _interopRequireDefault(require("./BackupDevice"));

var _ChangePin = _interopRequireDefault(require("./ChangePin"));

var _FirmwareUpdate = _interopRequireDefault(require("./FirmwareUpdate"));

var _RecoveryDevice = _interopRequireDefault(require("./RecoveryDevice"));

var _GetCoinInfo = _interopRequireDefault(require("./GetCoinInfo"));

var classes = {
  'blockchainDisconnect': _BlockchainDisconnect["default"],
  'blockchainEstimateFee': _BlockchainEstimateFee["default"],
  'blockchainGetAccountBalanceHistory': _BlockchainGetAccountBalanceHistory["default"],
  'blockchainGetCurrentFiatRates': _BlockchainGetCurrentFiatRates["default"],
  'blockchainGetFiatRatesForTimestamps': _BlockchainGetFiatRatesForTimestamps["default"],
  'blockchainGetTransactions': _BlockchainGetTransactions["default"],
  'blockchainSetCustomBackend': _BlockchainSetCustomBackend["default"],
  'blockchainSubscribe': _BlockchainSubscribe["default"],
  'blockchainSubscribeFiatRates': _BlockchainSubscribeFiatRates["default"],
  'blockchainUnsubscribe': _BlockchainUnsubscribe["default"],
  'blockchainUnsubscribeFiatRates': _BlockchainUnsubscribeFiatRates["default"],
  'cardanoGetAddress': _CardanoGetAddress["default"],
  'cardanoGetPublicKey': _CardanoGetPublicKey["default"],
  'cardanoSignTransaction': _CardanoSignTransaction["default"],
  'cipherKeyValue': _CipherKeyValue["default"],
  'composeTransaction': _ComposeTransaction["default"],
  'customMessage': _CustomMessage["default"],
  'debugLinkDecision': _DebugLinkDecision["default"],
  'debugLinkGetState': _DebugLinkGetState["default"],
  'ethereumGetAddress': _EthereumGetAddress["default"],
  'ethereumGetPublicKey': _EthereumGetPublicKey["default"],
  'ethereumSignMessage': _EthereumSignMessage["default"],
  'ethereumSignTransaction': _EthereumSignTransaction["default"],
  'ethereumVerifyMessage': _EthereumVerifyMessage["default"],
  'getAccountInfo': _GetAccountInfo["default"],
  'getAddress': _GetAddress["default"],
  'getDeviceState': _GetDeviceState["default"],
  'getFeatures': _GetFeatures["default"],
  'getPublicKey': _GetPublicKey["default"],
  'getSettings': _GetSettings["default"],
  'liskGetAddress': _LiskGetAddress["default"],
  'liskGetPublicKey': _LiskGetPublicKey["default"],
  'liskSignMessage': _LiskSignMessage["default"],
  'liskSignTransaction': _LiskSignTransaction["default"],
  'liskVerifyMessage': _LiskVerifyMessage["default"],
  'loadDevice': _LoadDevice["default"],
  'pushTransaction': _PushTransaction["default"],
  'requestLogin': _RequestLogin["default"],
  'resetDevice': _ResetDevice["default"],
  'rippleGetAddress': _RippleGetAddress["default"],
  'rippleSignTransaction': _RippleSignTransaction["default"],
  'nemGetAddress': _NEMGetAddress["default"],
  'nemSignTransaction': _NEMSignTransaction["default"],
  'signMessage': _SignMessage["default"],
  'signTransaction': _SignTransaction["default"],
  'stellarGetAddress': _StellarGetAddress["default"],
  'stellarSignTransaction': _StellarSignTransaction["default"],
  'tezosGetAddress': _TezosGetAddress["default"],
  'tezosGetPublicKey': _TezosGetPublicKey["default"],
  'tezosSignTransaction': _TezosSignTransaction["default"],
  'eosGetPublicKey': _EosGetPublicKey["default"],
  'eosSignTransaction': _EosSignTransaction["default"],
  'binanceGetPublicKey': _BinanceGetPublicKey["default"],
  'binanceGetAddress': _BinanceGetAddress["default"],
  'binanceSignTransaction': _BinanceSignTransaction["default"],
  'verifyMessage': _VerifyMessage["default"],
  'wipeDevice': _WipeDevice["default"],
  'applyFlags': _ApplyFlags["default"],
  'applySettings': _ApplySettings["default"],
  'backupDevice': _BackupDevice["default"],
  'changePin': _ChangePin["default"],
  'firmwareUpdate': _FirmwareUpdate["default"],
  'recoveryDevice': _RecoveryDevice["default"],
  'getCoinInfo': _GetCoinInfo["default"]
};

var find = function find(message) {
  if (!message.payload) {
    throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'Message payload not found');
  }

  if (!message.payload.method || typeof message.payload.method !== 'string') {
    throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'Message method is not set');
  }

  if (classes[message.payload.method]) {
    return new classes[message.payload.method](message);
  }

  throw _constants.ERRORS.TypedError('Method_InvalidParameter', "Method " + message.payload.method + " not found");
};

exports.find = find;
var _default = find;
exports["default"] = _default;