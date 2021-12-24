"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

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

var helper = _interopRequireWildcard(require("./helpers/eosSignTx"));

var EosSignTransaction = /*#__PURE__*/function (_AbstractMethod) {
  (0, _inheritsLoose2["default"])(EosSignTransaction, _AbstractMethod);

  function EosSignTransaction(message) {
    var _this;

    _this = _AbstractMethod.call(this, message) || this;
    _this.requiredPermissions = ['read', 'write'];
    _this.firmwareRange = (0, _paramsValidator.getFirmwareRange)(_this.name, (0, _CoinInfo.getMiscNetwork)('EOS'), _this.firmwareRange);
    _this.info = 'Sign EOS transaction';
    var payload = message.payload; // validate incoming parameters

    (0, _paramsValidator.validateParams)(payload, [{
      name: 'path',
      obligatory: true
    }, {
      name: 'transaction',
      obligatory: true
    }]);
    var path = (0, _pathUtils.validatePath)(payload.path, 3);

    var _helper$validate = helper.validate(path, payload.transaction),
        chain_id = _helper$validate.chain_id,
        header = _helper$validate.header,
        ack = _helper$validate.ack;

    _this.params = {
      path: path,
      chain_id: chain_id,
      header: header,
      ack: ack
    };
    return _this;
  }

  var _proto = EosSignTransaction.prototype;

  _proto.run = /*#__PURE__*/function () {
    var _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var response;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return helper.signTx(this.device.getCommands().typedCall.bind(this.device.getCommands()), this.params.path, this.params.chain_id, this.params.header, this.params.ack);

            case 2:
              response = _context.sent;
              return _context.abrupt("return", {
                signature: response.signature
              });

            case 4:
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

  return EosSignTransaction;
}(_AbstractMethod2["default"]);

exports["default"] = EosSignTransaction;