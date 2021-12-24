"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _AbstractMethod2 = _interopRequireDefault(require("./AbstractMethod"));

var _paramsValidator = require("./helpers/paramsValidator");

var _CoinInfo = require("../../data/CoinInfo");

var _pathUtils = require("../../utils/pathUtils");

var _cardanoAddressParameters = require("./helpers/cardanoAddressParameters");

var _cardanoCertificate = require("./helpers/cardanoCertificate");

var _cardanoTokens = require("./helpers/cardanoTokens");

var _constants = require("../../constants");

var _cardano = require("../../constants/cardano");

// todo: remove when listed firmwares become mandatory for cardanoSignTransaction
var CardanoSignTransactionFeatures = Object.freeze({
  SignStakePoolRegistrationAsOwner: ['0', '2.3.5'],
  ValidityIntervalStart: ['0', '2.3.5'],
  MultiassetOutputs: ['0', '2.3.5']
});

var CardanoSignTransaction = /*#__PURE__*/function (_AbstractMethod) {
  (0, _inheritsLoose2["default"])(CardanoSignTransaction, _AbstractMethod);

  function CardanoSignTransaction(message) {
    var _this;

    _this = _AbstractMethod.call(this, message) || this;
    _this.requiredPermissions = ['read', 'write'];
    _this.firmwareRange = (0, _paramsValidator.getFirmwareRange)(_this.name, (0, _CoinInfo.getMiscNetwork)('Cardano'), _this.firmwareRange);
    _this.info = 'Sign Cardano transaction';
    var payload = message.payload; // validate incoming parameters

    (0, _paramsValidator.validateParams)(payload, [{
      name: 'inputs',
      type: 'array',
      obligatory: true
    }, {
      name: 'outputs',
      type: 'array',
      obligatory: true,
      allowEmpty: true
    }, {
      name: 'fee',
      type: 'amount',
      obligatory: true
    }, {
      name: 'ttl',
      type: 'amount'
    }, {
      name: 'certificates',
      type: 'array',
      allowEmpty: true
    }, {
      name: 'withdrawals',
      type: 'array',
      allowEmpty: true
    }, {
      name: 'metadata',
      type: 'string'
    }, {
      name: 'validityIntervalStart',
      type: 'amount'
    }, {
      name: 'protocolMagic',
      type: 'number',
      obligatory: true
    }, {
      name: 'networkId',
      type: 'number',
      obligatory: true
    }]);
    var inputs = payload.inputs.map(function (input) {
      (0, _paramsValidator.validateParams)(input, [{
        name: 'prev_hash',
        type: 'string',
        obligatory: true
      }, {
        name: 'prev_index',
        type: 'number',
        obligatory: true
      }]);
      return {
        address_n: input.path ? (0, _pathUtils.validatePath)(input.path, 5) : undefined,
        prev_hash: input.prev_hash,
        prev_index: input.prev_index,
        type: input.type
      };
    });
    var outputs = payload.outputs.map(function (output) {
      (0, _paramsValidator.validateParams)(output, [{
        name: 'address',
        type: 'string'
      }, {
        name: 'amount',
        type: 'amount',
        obligatory: true
      }, {
        name: 'tokenBundle',
        type: 'array',
        allowEmpty: true
      }]);
      var result = {
        amount: output.amount,
        token_bundle: []
      };

      if (output.addressParameters) {
        (0, _cardanoAddressParameters.validateAddressParameters)(output.addressParameters);
        result.address_parameters = (0, _cardanoAddressParameters.addressParametersToProto)(output.addressParameters);
      } else {
        result.address = output.address;
      }

      if (output.tokenBundle) {
        (0, _cardanoTokens.validateTokenBundle)(output.tokenBundle);
        result.token_bundle = (0, _cardanoTokens.tokenBundleToProto)(output.tokenBundle);
      }

      return result;
    });
    var certificates = [];

    if (payload.certificates) {
      certificates = payload.certificates.map(_cardanoCertificate.transformCertificate);
    }

    var withdrawals = [];

    if (payload.withdrawals) {
      withdrawals = payload.withdrawals.map(function (withdrawal) {
        (0, _paramsValidator.validateParams)(withdrawal, [{
          name: 'path',
          obligatory: true
        }, {
          name: 'amount',
          type: 'amount',
          obligatory: true
        }]);
        return {
          path: (0, _pathUtils.validatePath)(withdrawal.path, 5),
          amount: withdrawal.amount
        };
      });
    }

    _this.params = {
      inputs: inputs,
      outputs: outputs,
      fee: payload.fee,
      ttl: payload.ttl,
      certificates: certificates,
      withdrawals: withdrawals,
      metadata: payload.metadata,
      validity_interval_start: payload.validityIntervalStart,
      protocol_magic: payload.protocolMagic,
      network_id: payload.networkId
    };
    return _this;
  }

  var _proto = CardanoSignTransaction.prototype;

  _proto._ensureFeatureIsSupported = function _ensureFeatureIsSupported(feature) {
    if (!this.device.atLeast(CardanoSignTransactionFeatures[feature])) {
      throw _constants.ERRORS.TypedError('Method_InvalidParameter', "Feature " + feature + " not supported by device firmware");
    }
  };

  _proto._ensureFirmwareSupportsParams = function _ensureFirmwareSupportsParams() {
    var _this2 = this;

    var params = this.params;
    params.certificates.map(function (certificate) {
      if (certificate.type === _cardano.CERTIFICATE_TYPE.StakePoolRegistration) {
        _this2._ensureFeatureIsSupported('SignStakePoolRegistrationAsOwner');
      }
    });

    if (params.validity_interval_start != null) {
      this._ensureFeatureIsSupported('ValidityIntervalStart');
    }

    params.outputs.map(function (output) {
      if (output.token_bundle && output.token_bundle.length > 0) {
        _this2._ensureFeatureIsSupported('MultiassetOutputs');
      }
    });
  };

  _proto.run = /*#__PURE__*/function () {
    var _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var cmd, _yield$cmd$typedCall, message;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this._ensureFirmwareSupportsParams();

              cmd = this.device.getCommands();
              _context.next = 4;
              return cmd.typedCall('CardanoSignTx', 'CardanoSignedTx', this.params);

            case 4:
              _yield$cmd$typedCall = _context.sent;
              message = _yield$cmd$typedCall.message;
              return _context.abrupt("return", {
                hash: message.tx_hash,
                serializedTx: message.serialized_tx
              });

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function run() {
      return _run.apply(this, arguments);
    }

    return run;
  }();

  return CardanoSignTransaction;
}(_AbstractMethod2["default"]);

exports["default"] = CardanoSignTransaction;