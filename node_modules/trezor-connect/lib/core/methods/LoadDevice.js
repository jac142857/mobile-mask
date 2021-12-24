"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _AbstractMethod2 = _interopRequireDefault(require("./AbstractMethod"));

var _constants = require("../../constants");

var _builder = require("../../message/builder");

var _paramsValidator = require("./helpers/paramsValidator");

var LoadDevice = /*#__PURE__*/function (_AbstractMethod) {
  (0, _inheritsLoose2["default"])(LoadDevice, _AbstractMethod);

  function LoadDevice(message) {
    var _this;

    _this = _AbstractMethod.call(this, message) || this;
    _this.allowDeviceMode = [_constants.UI.INITIALIZE, _constants.UI.SEEDLESS];
    _this.useDeviceState = false;
    _this.requiredPermissions = ['management'];
    _this.info = 'Load device';
    var payload = message.payload; // validate bundle type

    (0, _paramsValidator.validateParams)(payload, [{
      name: 'mnemonics',
      type: 'array'
    }, {
      name: 'node',
      type: 'object'
    }, {
      name: 'pin',
      type: 'string'
    }, {
      name: 'passphraseProtection',
      type: 'boolean'
    }, {
      name: 'language',
      type: 'string'
    }, {
      name: 'label',
      type: 'string'
    }, {
      name: 'skipChecksum',
      type: 'boolean'
    }, {
      name: 'u2fCounter',
      type: 'number'
    }]);
    _this.params = {
      mnemonics: payload.mnemonics,
      node: payload.node,
      pin: payload.pin,
      passphrase_protection: payload.passphraseProtection,
      language: payload.language,
      label: payload.label,
      skip_checksum: payload.skipChecksum,
      u2f_counter: payload.u2fCounter || Math.floor(Date.now() / 1000)
    };
    return _this;
  }

  var _proto = LoadDevice.prototype;

  _proto.confirmation = /*#__PURE__*/function () {
    var _confirmation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var uiPromise, uiResp;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this.confirmed) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", true);

            case 2:
              _context.next = 4;
              return this.getPopupPromise().promise;

            case 4:
              // initialize user response promise
              uiPromise = this.createUiPromise(_constants.UI.RECEIVE_CONFIRMATION, this.device); // request confirmation view

              this.postMessage((0, _builder.UiMessage)(_constants.UI.REQUEST_CONFIRMATION, {
                view: 'device-management',
                customConfirmButton: {
                  className: 'wipe',
                  label: "Load " + this.device.toMessageObject().label
                },
                label: 'Are you sure you want to load your device?'
              })); // wait for user action

              _context.next = 8;
              return uiPromise.promise;

            case 8:
              uiResp = _context.sent;
              this.confirmed = uiResp.payload;
              return _context.abrupt("return", this.confirmed);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function confirmation() {
      return _confirmation.apply(this, arguments);
    }

    return confirmation;
  }();

  _proto.run = /*#__PURE__*/function () {
    var _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var cmd, response;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (this.device.atLeast(['1.8.2', '2.1.2'])) {
                _context2.next = 5;
                break;
              }

              if (!(!this.params.mnemonics || typeof this.params.mnemonics[0] !== 'string')) {
                _context2.next = 3;
                break;
              }

              throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'invalid mnemonic array. should contain at least one mnemonic string');

            case 3:
              // $FlowIssue older protobuf messages requires mnemonic as string
              this.params.mnemonic = this.params.mnemonics[0]; // $FlowIssue older protobuf messages doesn't have mnemonics field

              delete this.params.mnemonics;

            case 5:
              cmd = this.device.getCommands();
              _context2.next = 8;
              return cmd.typedCall('LoadDevice', 'Success', this.params);

            case 8:
              response = _context2.sent;
              return _context2.abrupt("return", response.message);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function run() {
      return _run.apply(this, arguments);
    }

    return run;
  }();

  return LoadDevice;
}(_AbstractMethod2["default"]);

exports["default"] = LoadDevice;