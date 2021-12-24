"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _hdWallet = require("hd-wallet");

var _Fees = _interopRequireDefault(require("./Fees"));

var _BlockchainLink = _interopRequireDefault(require("../../../backend/BlockchainLink"));

var _pathUtils = require("../../../utils/pathUtils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var TransactionComposer = /*#__PURE__*/function () {
  function TransactionComposer(options) {
    (0, _defineProperty2["default"])(this, "blockHeight", 0);
    (0, _defineProperty2["default"])(this, "composed", {});
    this.account = options.account;
    this.outputs = options.outputs;
    this.coinInfo = options.coinInfo;
    this.blockHeight = 0;
    this.baseFee = options.baseFee || 0;
    this.feeLevels = new _Fees["default"](options.coinInfo); // map to hd-wallet/buildTx format

    var addresses = options.account.addresses;
    var allAddresses = !addresses ? [] : addresses.used.concat(addresses.unused).concat(addresses.change).map(function (a) {
      return a.address;
    });
    this.utxos = options.utxo.map(function (u) {
      var addressPath = (0, _pathUtils.getHDPath)(u.path);
      return {
        index: u.vout,
        transactionHash: u.txid,
        value: u.amount,
        addressPath: [addressPath[3], addressPath[4]],
        height: u.blockHeight,
        tsize: 0,
        // doesn't matter
        vsize: 0,
        // doesn't matter
        coinbase: typeof u.coinbase === 'boolean' ? u.coinbase : false,
        // decide it it can be spent immediately (false) or after 100 conf (true)
        own: allAddresses.indexOf(u.address) >= 0 // decide if it can be spent immediately (own) or after 6 conf (not own)

      };
    });
  }

  var _proto = TransactionComposer.prototype;

  _proto.init = /*#__PURE__*/function () {
    var _init = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(blockchain) {
      var _yield$blockchain$get, blockHeight;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return blockchain.getNetworkInfo();

            case 2:
              _yield$blockchain$get = _context.sent;
              blockHeight = _yield$blockchain$get.blockHeight;
              this.blockHeight = blockHeight;
              _context.next = 7;
              return this.feeLevels.load(blockchain);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function init(_x) {
      return _init.apply(this, arguments);
    }

    return init;
  }() // Composing fee levels for SelectFee view in popup
  ;

  _proto.composeAllFeeLevels = function composeAllFeeLevels() {
    var levels = this.feeLevels.levels;
    if (this.utxos.length < 1) return false;
    this.composed = {};
    var atLeastOneValid = false;

    for (var _iterator = _createForOfIteratorHelperLoose(levels), _step; !(_step = _iterator()).done;) {
      var level = _step.value;

      if (level.feePerUnit !== '0') {
        var _tx = this.compose(level.feePerUnit);

        if (_tx.type === 'final') {
          atLeastOneValid = true;
        }

        this.composed[level.label] = _tx;
      }
    }

    if (!atLeastOneValid) {
      var lastLevel = levels[levels.length - 1];
      var lastFee = new _bignumber["default"](lastLevel.feePerUnit);

      while (lastFee.gt(this.coinInfo.minFee) && this.composed['custom'] === undefined) {
        lastFee = lastFee.minus(1);
        var tx = this.compose(lastFee.toString());

        if (tx.type === 'final') {
          this.feeLevels.updateCustomFee(lastFee.toString());
          this.composed['custom'] = tx;
          return true;
        }
      }

      return false;
    }

    return true;
  };

  _proto.composeCustomFee = function composeCustomFee(fee) {
    var tx = this.compose(fee);
    this.composed['custom'] = tx;

    if (tx.type === 'final') {
      this.feeLevels.updateCustomFee(tx.feePerByte);
    } else {
      this.feeLevels.updateCustomFee(fee);
    }
  };

  _proto.getFeeLevelList = function getFeeLevelList() {
    var _this = this;

    var list = [];
    var levels = this.feeLevels.levels;
    levels.forEach(function (level) {
      var tx = _this.composed[level.label];

      if (tx && tx.type === 'final') {
        list.push({
          name: level.label,
          fee: tx.fee,
          feePerByte: level.feePerUnit,
          minutes: level.blocks * _this.coinInfo.blocktime,
          total: tx.totalSpent
        });
      } else {
        list.push({
          name: level.label,
          fee: '0',
          disabled: true
        });
      }
    });
    return list;
  };

  _proto.compose = function compose(feeRate) {
    var account = this.account,
        coinInfo = this.coinInfo,
        baseFee = this.baseFee;
    var addresses = account.addresses;
    if (!addresses) return {
      type: 'error',
      error: 'ADDRESSES-NOT-SET'
    }; // find not used change address or fallback to the last in the list

    var changeAddress = addresses.change.find(function (a) {
      return a.transfers < 1;
    }) || addresses.change[addresses.change.length - 1];
    var changeId = (0, _pathUtils.getHDPath)(changeAddress.path).slice(-1)[0]; // get address id from the path
    // const inputAmounts = coinInfo.segwit || coinInfo.forkid !== null || coinInfo.network.consensusBranchId !== null;

    var enhancement = {
      baseFee: baseFee,
      floorBaseFee: false,
      dustOutputFee: 0
    }; // DOGE changed fee policy and requires:

    if (coinInfo.shortcut === 'DOGE') {
      enhancement.floorBaseFee = enhancement.baseFee === 0; // fee rounded down not to overprice tx (see hd-wallet) use only if baseFee is not specified

      enhancement.baseFee = enhancement.baseFee || 100000000; // default 1 DOGE base fee

      enhancement.dustOutputFee = 100000000; // 1 DOGE for every output lower than dust (dust = 1 DOGE)
    }

    var result = (0, _hdWallet.buildTx)(_objectSpread({
      utxos: this.utxos,
      outputs: this.outputs,
      height: this.blockHeight,
      feeRate: feeRate,
      segwit: coinInfo.segwit && account.type !== 'legacy',
      inputAmounts: true,
      // since 2.3.4 every utxo needs to have "amount" field
      basePath: account.address_n,
      network: coinInfo.network,
      changeId: changeId,
      changeAddress: changeAddress.address,
      dustThreshold: coinInfo.dustLimit
    }, enhancement)); // hd-wallet returns `max = -1` when sendMax is not requested
    // https://github.com/trezor/hd-wallet/blob/master/src/build-tx/coinselect.js#L101
    // delete this value from the result, it should be either string or undefined

    if (result.type !== 'error' && result.max === -1) delete result.max;
    return result;
  };

  _proto.dispose = function dispose() {// TODO
  };

  return TransactionComposer;
}();

exports["default"] = TransactionComposer;