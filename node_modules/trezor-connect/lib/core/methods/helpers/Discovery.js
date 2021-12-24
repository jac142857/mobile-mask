"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _events = _interopRequireDefault(require("events"));

var _constants = require("../../../constants");

var _BlockchainLink = _interopRequireDefault(require("../../../backend/BlockchainLink"));

var _DeviceCommands = _interopRequireDefault(require("../../../device/DeviceCommands"));

var _accountUtils = require("../../../utils/accountUtils");

var _formatUtils = require("../../../utils/formatUtils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Discovery = /*#__PURE__*/function (_EventEmitter) {
  (0, _inheritsLoose2["default"])(Discovery, _EventEmitter);

  function Discovery(options) {
    var _this;

    _this = _EventEmitter.call(this) || this;
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "types", []);
    _this.accounts = [];
    _this.index = 0;
    _this.typeIndex = 0;
    _this.interrupted = false;
    _this.completed = false;
    _this.blockchain = options.blockchain;
    _this.commands = options.commands;
    _this.coinInfo = options.blockchain.coinInfo;

    var _assertThisInitialize = (0, _assertThisInitialized2["default"])(_this),
        coinInfo = _assertThisInitialize.coinInfo; // set discovery types


    if (coinInfo.type === 'bitcoin') {
      // Bitcoin-like coins could have multiple discovery types (bech32, segwit, legacy)
      // path utility wrapper. bip44 purpose can be set as well
      var getDescriptor = function getDescriptor(purpose, index) {
        return (0, _accountUtils.getAccountAddressN)(coinInfo, index, {
          purpose: purpose
        });
      }; // add bech32 discovery type


      if (coinInfo.xPubMagicSegwitNative) {
        _this.types.push({
          type: 'normal',
          getPath: getDescriptor.bind((0, _assertThisInitialized2["default"])(_this), 84)
        });
      } // add segwit discovery type (normal if bech32 is not supported)


      if (coinInfo.xPubMagicSegwit) {
        _this.types.push({
          type: _this.types.length > 0 ? 'segwit' : 'normal',
          getPath: getDescriptor.bind((0, _assertThisInitialized2["default"])(_this), 49)
        });
      } // add legacy discovery type (normal if bech32 and segwit are not supported)


      _this.types.push({
        type: _this.types.length > 0 ? 'legacy' : 'normal',
        getPath: getDescriptor.bind((0, _assertThisInitialized2["default"])(_this), 44)
      });
    } else {
      // other coins has only normal discovery type
      _this.types.push({
        type: 'normal',
        getPath: _accountUtils.getAccountAddressN.bind((0, _assertThisInitialized2["default"])(_this), coinInfo)
      });
    }

    return _this;
  }

  var _proto = Discovery.prototype;

  _proto.start = /*#__PURE__*/function () {
    var _start = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(details) {
      var _this2 = this;

      var limit, _loop, _ret;

      return _regenerator["default"].wrap(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              limit = 10; // TODO: move to options

              this.interrupted = false;
              _loop = /*#__PURE__*/_regenerator["default"].mark(function _loop() {
                var accountType, label, overTheLimit, path, descriptor, account, info, balance;
                return _regenerator["default"].wrap(function _loop$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        accountType = _this2.types[_this2.typeIndex];
                        label = "Account #" + (_this2.index + 1);
                        overTheLimit = _this2.index >= limit; // get descriptor from device

                        path = accountType.getPath(_this2.index);
                        _context.next = 6;
                        return _this2.commands.getAccountDescriptor(_this2.coinInfo, path);

                      case 6:
                        descriptor = _context.sent;

                        if (descriptor) {
                          _context.next = 9;
                          break;
                        }

                        throw _constants.ERRORS.TypedError('Runtime', 'Discovery: descriptor not found');

                      case 9:
                        if (!_this2.interrupted) {
                          _context.next = 11;
                          break;
                        }

                        return _context.abrupt("return", {
                          v: void 0
                        });

                      case 11:
                        account = _objectSpread(_objectSpread({}, descriptor), {}, {
                          type: accountType.type,
                          label: label
                        }); // remove duplicates (restore uncompleted discovery)

                        _this2.accounts = _this2.accounts.filter(function (a) {
                          return a.descriptor !== account.descriptor;
                        }); // if index is below visible limit
                        // add incomplete account info (without balance) and emit "progress"
                        // this should render "Loading..." status

                        if (!overTheLimit) {
                          _this2.accounts.push(account);

                          _this2.emit('progress', _this2.accounts);
                        } // get account info from backend


                        _context.next = 16;
                        return _this2.blockchain.getAccountInfo({
                          descriptor: account.descriptor,
                          details: details
                        });

                      case 16:
                        info = _context.sent;

                        if (!_this2.interrupted) {
                          _context.next = 19;
                          break;
                        }

                        return _context.abrupt("return", {
                          v: void 0
                        });

                      case 19:
                        // remove previously added incomplete account info
                        _this2.accounts = _this2.accounts.filter(function (a) {
                          return a.descriptor !== account.descriptor;
                        }); // check if account should be displayed
                        // eg: empty account with index 11 should not be rendered

                        if (!overTheLimit || overTheLimit && !info.empty) {
                          balance = (0, _formatUtils.formatAmount)(info.availableBalance, _this2.coinInfo);

                          _this2.accounts.push(_objectSpread(_objectSpread({}, account), {}, {
                            empty: info.empty,
                            balance: balance,
                            addresses: info.addresses
                          }));

                          _this2.emit('progress', _this2.accounts);
                        } // last account was empty. switch to next discovery type or complete the discovery process


                        if (info.empty) {
                          if (_this2.typeIndex + 1 < _this2.types.length) {
                            _this2.typeIndex++;
                            _this2.index = 0;
                          } else {
                            _this2.emit('complete');

                            _this2.completed = true;
                          }
                        } else {
                          _this2.index++;
                        }

                      case 22:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _loop);
              });

            case 3:
              if (!(!this.completed && !this.interrupted)) {
                _context2.next = 10;
                break;
              }

              return _context2.delegateYield(_loop(), "t0", 5);

            case 5:
              _ret = _context2.t0;

              if (!(typeof _ret === "object")) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt("return", _ret.v);

            case 8:
              _context2.next = 3;
              break;

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee, this);
    }));

    function start(_x) {
      return _start.apply(this, arguments);
    }

    return start;
  }();

  _proto.stop = function stop() {
    this.interrupted = !this.completed;
  };

  _proto.dispose = function dispose() {
    this.accounts = [];
  };

  return Discovery;
}(_events["default"]);

exports["default"] = Discovery;