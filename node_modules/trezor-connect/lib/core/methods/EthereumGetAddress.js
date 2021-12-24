"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _AbstractMethod2 = _interopRequireDefault(require("./AbstractMethod"));

var _paramsValidator = require("./helpers/paramsValidator");

var _pathUtils = require("../../utils/pathUtils");

var _ethereumUtils = require("../../utils/ethereumUtils");

var _CoinInfo = require("../../data/CoinInfo");

var _formatUtils = require("../../utils/formatUtils");

var _constants = require("../../constants");

var _builder = require("../../message/builder");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var EthereumGetAddress = /*#__PURE__*/function (_AbstractMethod) {
  (0, _inheritsLoose2["default"])(EthereumGetAddress, _AbstractMethod);

  function EthereumGetAddress(message) {
    var _this;

    _this = _AbstractMethod.call(this, message) || this;
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "params", []);
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "progress", 0);
    _this.requiredPermissions = ['read']; // create a bundle with only one batch if bundle doesn't exists

    _this.hasBundle = Object.prototype.hasOwnProperty.call(message.payload, 'bundle');
    var payload = !_this.hasBundle ? _objectSpread(_objectSpread({}, message.payload), {}, {
      bundle: [message.payload]
    }) : message.payload; // validate bundle type

    (0, _paramsValidator.validateParams)(payload, [{
      name: 'bundle',
      type: 'array'
    }, {
      name: 'useEventListener',
      type: 'boolean'
    }]);
    payload.bundle.forEach(function (batch) {
      // validate incoming parameters for each batch
      (0, _paramsValidator.validateParams)(batch, [{
        name: 'path',
        obligatory: true
      }, {
        name: 'address',
        type: 'string'
      }, {
        name: 'showOnTrezor',
        type: 'boolean'
      }]);
      var path = (0, _pathUtils.validatePath)(batch.path, 3);
      var network = (0, _CoinInfo.getEthereumNetwork)(path);
      _this.firmwareRange = (0, _paramsValidator.getFirmwareRange)(_this.name, network, _this.firmwareRange);
      var showOnTrezor = true;

      if (Object.prototype.hasOwnProperty.call(batch, 'showOnTrezor')) {
        showOnTrezor = batch.showOnTrezor;
      }

      _this.params.push({
        address_n: path,
        show_display: showOnTrezor,
        address: batch.address,
        network: network
      });
    }); // set info

    if (_this.params.length === 1) {
      _this.info = (0, _ethereumUtils.getNetworkLabel)('Export #NETWORK address', _this.params[0].network);
    } else {
      var requestedNetworks = _this.params.map(function (b) {
        return b.network;
      });

      var uniqNetworks = (0, _CoinInfo.getUniqueNetworks)(requestedNetworks);

      if (uniqNetworks.length === 1 && uniqNetworks[0]) {
        _this.info = (0, _ethereumUtils.getNetworkLabel)('Export multiple #NETWORK addresses', uniqNetworks[0]);
      } else {
        _this.info = 'Export multiple addresses';
      }
    }

    var useEventListener = payload.useEventListener && _this.params.length === 1 && typeof _this.params[0].address === 'string' && _this.params[0].show_display;
    _this.confirmed = useEventListener;
    _this.useUi = !useEventListener;
    return _this;
  }

  var _proto = EthereumGetAddress.prototype;

  _proto.getButtonRequestData = function getButtonRequestData(code) {
    if (code === 'ButtonRequest_Address') {
      var data = {
        type: 'address',
        serializedPath: (0, _pathUtils.getSerializedPath)(this.params[this.progress].address_n),
        address: this.params[this.progress].address || 'not-set'
      };
      return data;
    }

    return null;
  };

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
                view: 'export-address',
                label: this.info
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

  _proto.noBackupConfirmation = /*#__PURE__*/function () {
    var _noBackupConfirmation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var uiPromise, uiResp;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.getPopupPromise().promise;

            case 2:
              // initialize user response promise
              uiPromise = this.createUiPromise(_constants.UI.RECEIVE_CONFIRMATION, this.device); // request confirmation view

              this.postMessage((0, _builder.UiMessage)(_constants.UI.REQUEST_CONFIRMATION, {
                view: 'no-backup'
              })); // wait for user action

              _context2.next = 6;
              return uiPromise.promise;

            case 6:
              uiResp = _context2.sent;
              return _context2.abrupt("return", uiResp.payload);

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function noBackupConfirmation() {
      return _noBackupConfirmation.apply(this, arguments);
    }

    return noBackupConfirmation;
  }();

  _proto._call = /*#__PURE__*/function () {
    var _call2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref) {
      var address_n, show_display, network, cmd;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              address_n = _ref.address_n, show_display = _ref.show_display, network = _ref.network;
              cmd = this.device.getCommands();
              return _context3.abrupt("return", cmd.ethereumGetAddress({
                address_n: address_n,
                show_display: show_display
              }, network));

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function _call(_x) {
      return _call2.apply(this, arguments);
    }

    return _call;
  }();

  _proto.run = /*#__PURE__*/function () {
    var _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var responses, i, batch, silent, response;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              responses = [];
              i = 0;

            case 2:
              if (!(i < this.params.length)) {
                _context4.next = 23;
                break;
              }

              batch = this.params[i]; // silently get address and compare with requested address
              // or display as default inside popup

              if (!batch.show_display) {
                _context4.next = 14;
                break;
              }

              _context4.next = 7;
              return this._call(_objectSpread(_objectSpread({}, batch), {}, {
                show_display: false
              }));

            case 7:
              silent = _context4.sent;

              if (!(typeof batch.address === 'string')) {
                _context4.next = 13;
                break;
              }

              if (!((0, _formatUtils.stripHexPrefix)(batch.address).toLowerCase() !== (0, _formatUtils.stripHexPrefix)(silent.address).toLowerCase())) {
                _context4.next = 11;
                break;
              }

              throw _constants.ERRORS.TypedError('Method_AddressNotMatch');

            case 11:
              _context4.next = 14;
              break;

            case 13:
              // save address for future verification in "getButtonRequestData"
              batch.address = silent.address;

            case 14:
              _context4.next = 16;
              return this._call(batch);

            case 16:
              response = _context4.sent;
              responses.push(response);

              if (this.hasBundle) {
                // send progress
                this.postMessage((0, _builder.UiMessage)(_constants.UI.BUNDLE_PROGRESS, {
                  progress: i,
                  response: response
                }));
              }

              this.progress++;

            case 20:
              i++;
              _context4.next = 2;
              break;

            case 23:
              return _context4.abrupt("return", this.hasBundle ? responses : responses[0]);

            case 24:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function run() {
      return _run.apply(this, arguments);
    }

    return run;
  }();

  return EthereumGetAddress;
}(_AbstractMethod2["default"]);

exports["default"] = EthereumGetAddress;