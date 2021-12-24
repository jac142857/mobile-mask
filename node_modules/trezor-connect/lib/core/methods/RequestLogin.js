"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _AbstractMethod2 = _interopRequireDefault(require("./AbstractMethod"));

var _paramsValidator = require("./helpers/paramsValidator");

var _constants = require("../../constants");

var _builder = require("../../message/builder");

var _DataManager = _interopRequireDefault(require("../../data/DataManager"));

var RequestLogin = /*#__PURE__*/function (_AbstractMethod) {
  (0, _inheritsLoose2["default"])(RequestLogin, _AbstractMethod);

  function RequestLogin(message) {
    var _this;

    _this = _AbstractMethod.call(this, message) || this;
    _this.requiredPermissions = ['read', 'write'];
    _this.firmwareRange = (0, _paramsValidator.getFirmwareRange)(_this.name, null, _this.firmwareRange);
    _this.info = 'Login';
    _this.useEmptyPassphrase = true;
    var payload = message.payload;
    var identity = {};

    var settings = _DataManager["default"].getSettings();

    if (settings.origin) {
      var uri = settings.origin.split(':');
      identity.proto = uri[0];
      identity.host = uri[1].substring(2);

      if (uri[2]) {
        identity.port = uri[2];
      }

      identity.index = 0;
    } // validate incoming parameters


    (0, _paramsValidator.validateParams)(payload, [{
      name: 'challengeHidden',
      type: 'string'
    }, {
      name: 'challengeVisual',
      type: 'string'
    }, {
      name: 'asyncChallenge',
      type: 'boolean'
    }]);
    _this.params = {
      identity: identity,
      challenge_hidden: payload.challengeHidden || '',
      challenge_visual: payload.challengeVisual || ''
    };
    _this.asyncChallenge = payload.asyncChallenge;
    return _this;
  }

  var _proto = RequestLogin.prototype;

  _proto.run = /*#__PURE__*/function () {
    var _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var uiPromise, uiResp, payload, cmd, _yield$cmd$typedCall, message;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this.asyncChallenge) {
                _context.next = 12;
                break;
              }

              // create ui promise
              uiPromise = this.createUiPromise(_constants.UI.LOGIN_CHALLENGE_RESPONSE, this.device); // send request to developer

              this.postMessage((0, _builder.UiMessage)(_constants.UI.LOGIN_CHALLENGE_REQUEST)); // wait for response from developer

              _context.next = 5;
              return uiPromise.promise;

            case 5:
              uiResp = _context.sent;
              payload = uiResp.payload.payload; // error handler

              if (!(typeof payload === 'string')) {
                _context.next = 9;
                break;
              }

              throw _constants.ERRORS.TypedError('Runtime', "TrezorConnect.requestLogin callback error: " + payload);

            case 9:
              // validate incoming parameters
              (0, _paramsValidator.validateParams)(payload, [{
                name: 'challengeHidden',
                type: 'string',
                obligatory: true
              }, {
                name: 'challengeVisual',
                type: 'string',
                obligatory: true
              }]);
              this.params.challenge_hidden = payload.challengeHidden;
              this.params.challenge_visual = payload.challengeVisual;

            case 12:
              cmd = this.device.getCommands();
              _context.next = 15;
              return cmd.typedCall('SignIdentity', 'SignedIdentity', this.params);

            case 15:
              _yield$cmd$typedCall = _context.sent;
              message = _yield$cmd$typedCall.message;
              return _context.abrupt("return", {
                address: message.address,
                publicKey: message.public_key,
                signature: message.signature
              });

            case 18:
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

  return RequestLogin;
}(_AbstractMethod2["default"]);

exports["default"] = RequestLogin;