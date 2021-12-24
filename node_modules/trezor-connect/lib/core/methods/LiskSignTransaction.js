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

var _liskSignTx = require("./helpers/liskSignTx");

var LiskSignTransaction = /*#__PURE__*/function (_AbstractMethod) {
  (0, _inheritsLoose2["default"])(LiskSignTransaction, _AbstractMethod);

  function LiskSignTransaction(message) {
    var _this;

    _this = _AbstractMethod.call(this, message) || this;
    _this.requiredPermissions = ['read', 'write'];
    _this.firmwareRange = (0, _paramsValidator.getFirmwareRange)(_this.name, (0, _CoinInfo.getMiscNetwork)('Lisk'), _this.firmwareRange);
    var payload = message.payload; // validate incoming parameters

    (0, _paramsValidator.validateParams)(payload, [{
      name: 'path',
      obligatory: true
    }, {
      name: 'transaction',
      obligatory: true
    }]);
    var path = (0, _pathUtils.validatePath)(payload.path, 3);
    _this.info = 'Sign Lisk transaction';
    var tx = payload.transaction;
    (0, _paramsValidator.validateParams)(tx, [{
      name: 'type',
      type: 'number',
      obligatory: true
    }, {
      name: 'fee',
      type: 'string',
      obligatory: true
    }, {
      name: 'amount',
      type: 'amount',
      obligatory: true
    }, {
      name: 'timestamp',
      type: 'number',
      obligatory: true
    }, {
      name: 'recipientId',
      type: 'string'
    }, {
      name: 'signature',
      type: 'string'
    }, {
      name: 'asset',
      type: 'object'
    }]);
    var transaction = (0, _liskSignTx.prepareTx)(tx);
    if (!transaction.asset) transaction.asset = {};
    _this.params = {
      address_n: path,
      transaction: transaction
    };
    return _this;
  }

  var _proto = LiskSignTransaction.prototype;

  _proto.run = /*#__PURE__*/function () {
    var _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var cmd, response;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              cmd = this.device.getCommands();
              _context.next = 3;
              return cmd.typedCall('LiskSignTx', 'LiskSignedTx', this.params);

            case 3:
              response = _context.sent;
              return _context.abrupt("return", response.message);

            case 5:
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

  return LiskSignTransaction;
}(_AbstractMethod2["default"]);

exports["default"] = LiskSignTransaction;