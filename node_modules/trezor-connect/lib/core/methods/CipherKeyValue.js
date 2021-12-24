"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var UI = _interopRequireWildcard(require("../../constants/ui"));

var _builder = require("../../message/builder");

var _AbstractMethod2 = _interopRequireDefault(require("./AbstractMethod"));

var _paramsValidator = require("./helpers/paramsValidator");

var _pathUtils = require("../../utils/pathUtils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var CipherKeyValue = /*#__PURE__*/function (_AbstractMethod) {
  (0, _inheritsLoose2["default"])(CipherKeyValue, _AbstractMethod);

  function CipherKeyValue(message) {
    var _this;

    _this = _AbstractMethod.call(this, message) || this;
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "params", []);
    _this.requiredPermissions = ['read', 'write'];
    _this.firmwareRange = (0, _paramsValidator.getFirmwareRange)(_this.name, null, _this.firmwareRange);
    _this.info = 'Cypher key value';
    _this.useEmptyPassphrase = true; // create a bundle with only one batch if bundle doesn't exists

    _this.hasBundle = Object.prototype.hasOwnProperty.call(message.payload, 'bundle');
    var payload = !_this.hasBundle ? _objectSpread(_objectSpread({}, message.payload), {}, {
      bundle: [message.payload]
    }) : message.payload; // validate bundle type

    (0, _paramsValidator.validateParams)(payload, [{
      name: 'bundle',
      type: 'array'
    }]);
    payload.bundle.forEach(function (batch) {
      // validate incoming parameters for each batch
      (0, _paramsValidator.validateParams)(batch, [{
        name: 'path',
        obligatory: true
      }, {
        name: 'key',
        type: 'string'
      }, {
        name: 'value',
        type: 'string'
      }, {
        name: 'encrypt',
        type: 'boolean'
      }, {
        name: 'askOnEncrypt',
        type: 'boolean'
      }, {
        name: 'askOnDecrypt',
        type: 'boolean'
      }, {
        name: 'iv',
        type: 'string'
      }]);

      _this.params.push({
        address_n: (0, _pathUtils.validatePath)(batch.path),
        key: batch.key,
        value: batch.value instanceof Buffer ? batch.value.toString('hex') : batch.value,
        encrypt: batch.encrypt,
        ask_on_encrypt: batch.askOnEncrypt,
        ask_on_decrypt: batch.askOnDecrypt,
        iv: batch.iv instanceof Buffer ? batch.iv.toString('hex') : batch.iv
      });
    });
    return _this;
  }

  var _proto = CipherKeyValue.prototype;

  _proto.run = /*#__PURE__*/function () {
    var _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var responses, cmd, i, response;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              responses = [];
              cmd = this.device.getCommands();
              i = 0;

            case 3:
              if (!(i < this.params.length)) {
                _context.next = 12;
                break;
              }

              _context.next = 6;
              return cmd.typedCall('CipherKeyValue', 'CipheredKeyValue', this.params[i]);

            case 6:
              response = _context.sent;
              responses.push(response.message);

              if (this.hasBundle) {
                // send progress
                this.postMessage((0, _builder.UiMessage)(UI.BUNDLE_PROGRESS, {
                  progress: i,
                  response: response
                }));
              }

            case 9:
              i++;
              _context.next = 3;
              break;

            case 12:
              return _context.abrupt("return", this.hasBundle ? responses : responses[0]);

            case 13:
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

  return CipherKeyValue;
}(_AbstractMethod2["default"]);

exports["default"] = CipherKeyValue;