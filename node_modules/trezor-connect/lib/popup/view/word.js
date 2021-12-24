"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.initWordView = void 0;

var _builder = require("../../message/builder");

var UI = _interopRequireWildcard(require("../../constants/ui"));

var _common = require("./common");

var _bip = _interopRequireDefault(require("../../utils/bip39"));

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var initWordPlainView = function initWordPlainView(payload) {
  (0, _common.showView)('word-plain');

  var deviceName = _common.container.getElementsByClassName('device-name')[0];

  var datalist = _common.container.getElementsByClassName('bip-words')[0];

  var input = _common.container.getElementsByClassName('word-input')[0];

  deviceName.innerText = payload.device.label;

  var clearWord = function clearWord() {
    input.value = '';
    input.focus();
  };

  var submit = function submit() {
    (0, _common.postMessage)((0, _builder.UiMessage)(UI.RECEIVE_WORD, input.value));
    clearWord(); // eslint-disable-next-line no-use-before-define

    window.removeEventListener('keydown', wordKeyboardHandler);
  };

  var wordKeyboardHandler = function wordKeyboardHandler(event) {
    switch (event.keyCode) {
      case 13: // enter,

      case 9:
        // tab
        event.preventDefault();
        submit();
        break;
    }
  };

  _bip["default"].forEach(function (word) {
    var item = document.createElement('option');
    item.value = word;
    datalist.appendChild(item);
  });

  input.focus();
  window.addEventListener('keydown', wordKeyboardHandler, false);
};

var initWordMatrixView = function initWordMatrixView(payload) {
  (0, _common.showView)('word-matrix');

  var submit = function submit(val) {
    (0, _common.postMessage)((0, _builder.UiMessage)(UI.RECEIVE_WORD, val)); // eslint-disable-next-line no-use-before-define

    window.addEventListener('keydown', keyboardHandler, true);
  };

  var keyboardHandler = function keyboardHandler(event) {
    event.preventDefault();

    switch (event.keyCode) {
      // numeric and numpad
      case 49:
      case 97:
        submit('1');
        break;

      case 50:
      case 98:
        submit('2');
        break;

      case 51:
      case 99:
        submit('3');
        break;

      case 52:
      case 100:
        submit('4');
        break;

      case 53:
      case 101:
        submit('5');
        break;

      case 54:
      case 102:
        submit('6');
        break;

      case 55:
      case 103:
        submit('7');
        break;

      case 56:
      case 104:
        submit('8');
        break;

      case 57:
      case 105:
        submit('9');
        break;
    }
  };

  var deviceName = _common.container.getElementsByClassName('device-name')[0];

  var buttons = _common.container.querySelectorAll('[data-value]');

  var wordsOnRight = _common.container.getElementsByClassName('word-right');

  deviceName.innerText = payload.device.label;

  for (var i = 0; i < buttons.length; i++) {
    buttons.item(i).addEventListener('click', function (event) {
      if (event.target instanceof HTMLElement) {
        var val = event.target.getAttribute('data-value');

        if (val) {
          submit(val);
        }
      }
    });
  }

  for (var _iterator = _createForOfIteratorHelperLoose(wordsOnRight), _step; !(_step = _iterator()).done;) {
    var word = _step.value;
    word.style.display = payload.type !== 'WordRequestType_Matrix9' ? 'none' : 'initial';
  }

  window.addEventListener('keydown', keyboardHandler, true);
};

var initWordView = function initWordView(payload) {
  if (payload.type === 'WordRequestType_Plain') {
    initWordPlainView(payload);
  } else {
    initWordMatrixView(payload);
  }
};

exports.initWordView = initWordView;