"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.outputToTrezor = exports.validateHDOutput = exports.validateTrezorOutputs = void 0;

var _bchaddrjs = _interopRequireDefault(require("bchaddrjs"));

var _pathUtils = require("../../../utils/pathUtils");

var _addressUtils = require("../../../utils/addressUtils");

var _index = require("./index");

var _paramsValidator = require("../helpers/paramsValidator");

var _constants = require("../../../constants");

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/** *****
 * SignTransaction: validation
 *******/
var validateTrezorOutputs = function validateTrezorOutputs(outputs, coinInfo) {
  var trezorOutputs = outputs.map(_index.fixPath).map(_index.convertMultisigPubKey.bind(null, coinInfo.network));

  for (var _iterator = _createForOfIteratorHelperLoose(trezorOutputs), _step; !(_step = _iterator()).done;) {
    var output = _step.value;
    (0, _paramsValidator.validateParams)(output, [{
      name: 'address_n',
      type: 'array'
    }, {
      name: 'address',
      type: 'string'
    }, {
      name: 'amount',
      type: 'string'
    }, {
      name: 'op_return_data',
      type: 'string'
    }, {
      name: 'multisig',
      type: 'object'
    }]);

    if (Object.prototype.hasOwnProperty.call(output, 'address_n') && Object.prototype.hasOwnProperty.call(output, 'address')) {
      throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'Cannot use address and address_n in one output');
    }

    if (output.address_n) {
      var scriptType = (0, _pathUtils.getOutputScriptType)(output.address_n);
      if (output.script_type !== scriptType) throw _constants.ERRORS.TypedError('Method_InvalidParameter', "Output change script_type should be set to " + scriptType);
    }

    if (typeof output.address === 'string' && !(0, _addressUtils.isValidAddress)(output.address, coinInfo)) {
      // validate address with coin info
      throw _constants.ERRORS.TypedError('Method_InvalidParameter', "Invalid " + coinInfo.label + " output address " + output.address);
    }
  }

  return trezorOutputs;
};
/** *****
 * ComposeTransaction: validation
 *******/


exports.validateTrezorOutputs = validateTrezorOutputs;

var validateHDOutput = function validateHDOutput(output, coinInfo) {
  var validateAddress = function validateAddress(address) {
    if (!(0, _addressUtils.isValidAddress)(address, coinInfo)) {
      throw _constants.ERRORS.TypedError('Method_InvalidParameter', "Invalid " + coinInfo.label + " output address format");
    }
  };

  switch (output.type) {
    case 'opreturn':
      (0, _paramsValidator.validateParams)(output, [{
        name: 'dataHex',
        type: 'string'
      }]);
      return {
        type: 'opreturn',
        dataHex: output.dataHex || ''
      };

    case 'send-max':
      (0, _paramsValidator.validateParams)(output, [{
        name: 'address',
        type: 'string',
        obligatory: true
      }]);
      validateAddress(output.address);
      return {
        type: 'send-max',
        address: output.address
      };

    case 'noaddress':
      (0, _paramsValidator.validateParams)(output, [{
        name: 'amount',
        type: 'string',
        obligatory: true
      }]);
      return {
        type: 'noaddress',
        amount: output.amount
      };

    case 'send-max-noaddress':
      return {
        type: 'send-max-noaddress'
      };

    default:
      (0, _paramsValidator.validateParams)(output, [{
        name: 'amount',
        type: 'string',
        obligatory: true
      }, {
        name: 'address',
        type: 'string',
        obligatory: true
      }]);
      validateAddress(output.address);
      return {
        type: 'complete',
        address: output.address,
        amount: output.amount
      };
  }
};
/** *****
 * Transform from hd-wallet format to Trezor
 *******/


exports.validateHDOutput = validateHDOutput;

var outputToTrezor = function outputToTrezor(output, coinInfo) {
  if (output.opReturnData) {
    if (Object.prototype.hasOwnProperty.call(output, 'value')) {
      throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'opReturn output should not contains value');
    }

    var data = output.opReturnData;
    return {
      amount: '0',
      op_return_data: data.toString('hex'),
      script_type: 'PAYTOOPRETURN'
    };
  }

  if (!output.address && !output.path) {
    throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'Both address and path of an output cannot be null.');
  }

  if (output.path) {
    return {
      address_n: output.path,
      amount: output.value,
      script_type: (0, _pathUtils.getOutputScriptType)(output.path)
    };
  }

  var address = output.address,
      value = output.value;

  if (typeof address !== 'string') {
    throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'Wrong output address type, should be string');
  }

  var isCashAddress = !!coinInfo.cashAddrPrefix;
  (0, _addressUtils.isScriptHash)(address, coinInfo); // make sure that cashaddr has prefix

  return {
    address: isCashAddress ? _bchaddrjs["default"].toCashAddress(address) : address,
    amount: value,
    script_type: 'PAYTOADDRESS'
  };
};

exports.outputToTrezor = outputToTrezor;