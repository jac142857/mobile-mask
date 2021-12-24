"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.selectAccount = void 0;

var _builder = require("../../message/builder");

var UI = _interopRequireWildcard(require("../../constants/ui"));

var _common = require("./common");

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } it = o[Symbol.iterator](); return it.next.bind(it); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var setHeader = function setHeader(payload) {
  var h3 = _common.container.getElementsByTagName('h3')[0];

  if (payload.type === 'end') {
    h3.innerHTML = "Select " + payload.coinInfo.label + " account";
  } else {
    h3.innerHTML = "Loading " + payload.coinInfo.label + " accounts...";
  }
};

var selectAccount = function selectAccount(payload) {
  if (!payload) return;
  var accountTypes = payload.accountTypes,
      defaultAccountType = payload.defaultAccountType,
      accounts = payload.accounts; // first render
  // show "select-account" view
  // configure tabs

  if (Array.isArray(accountTypes)) {
    (0, _common.showView)('select-account'); // setHeader(payload);

    if (accountTypes.length > 1) {
      (function () {
        var tabs = _common.container.getElementsByClassName('tabs')[0];

        tabs.style.display = 'flex';

        var selectAccountContainer = _common.container.getElementsByClassName('select-account')[0];

        var buttons = tabs.getElementsByClassName('tab-selection');
        var button;
        var selectedType = defaultAccountType || (accountTypes.includes('segwit') ? 'segwit' : 'normal');
        selectAccountContainer.className = 'select-account ' + selectedType;

        if (accountTypes.includes('segwit')) {
          var bech32warn = _common.container.getElementsByClassName('bech32-warning')[0];

          bech32warn.removeAttribute('style'); // remove default 'display: none' from element
        }

        var _loop = function _loop() {
          button = _step.value;
          var type = button.getAttribute('data-tab');

          if (type && accountTypes.indexOf(type) >= 0) {
            button.onclick = function (event) {
              selectAccountContainer.className = 'select-account ' + type;
            };
          } else {
            tabs.removeChild(button);
          }
        };

        for (var _iterator = _createForOfIteratorHelperLoose(buttons), _step; !(_step = _iterator()).done;) {
          _loop();
        }
      })();
    } // return;

  } // set header


  setHeader(payload);
  if (!accounts) return;
  var buttons = {
    'normal': _common.container.querySelectorAll('.select-account-list.normal')[0],
    'segwit': _common.container.querySelectorAll('.select-account-list.segwit')[0],
    'legacy': _common.container.querySelectorAll('.select-account-list.legacy')[0]
  };

  var handleClick = function handleClick(event) {
    if (!(event.currentTarget instanceof HTMLElement)) return;
    var index = event.currentTarget.getAttribute('data-index');
    (0, _common.postMessage)((0, _builder.UiMessage)(UI.RECEIVE_ACCOUNT, parseInt(index)));
    (0, _common.showView)('loader');
  };

  var removeEmptyButton = function removeEmptyButton(buttonContainer) {
    var defaultButton = buttonContainer.querySelectorAll('.account-default')[0];

    if (defaultButton) {
      buttonContainer.removeChild(defaultButton);
    }
  };

  var updateButtonValue = function updateButtonValue(button, account) {
    if (button.innerHTML.length < 1) {
      button.innerHTML = "\n                <span class=\"account-title\"></span>\n                <span class=\"account-status\"></span>";
    }

    var title = button.getElementsByClassName('account-title')[0];
    var status = button.getElementsByClassName('account-status')[0];
    title.innerHTML = account.label; // TODO: Disable button once an account is fully loaded and its balance is 0

    if (typeof account.balance !== 'string') {
      status.innerHTML = 'Loading...';
      button.disabled = true;
    } else {
      status.innerHTML = account.empty ? 'New account' : account.balance;
      button.disabled = false;

      if (payload.preventEmpty) {
        button.disabled = account.empty === true;
      } else {
        button.disabled = false;
      }

      if (!button.disabled) {
        button.onclick = handleClick;
      }
    }
  };

  for (var _iterator2 = _createForOfIteratorHelperLoose(accounts.entries()), _step2; !(_step2 = _iterator2()).done;) {
    var _step2$value = _step2.value,
        index = _step2$value[0],
        account = _step2$value[1];
    var buttonContainer = buttons[account.type];
    var existed = buttonContainer.querySelectorAll("[data-index=\"" + index + "\"]")[0];

    if (!existed) {
      var button = document.createElement('button');
      button.className = 'list';
      button.setAttribute('data-index', index.toString());
      updateButtonValue(button, account);
      removeEmptyButton(buttonContainer);
      buttonContainer.appendChild(button);
    } else {
      updateButtonValue(existed, account);
    }
  }
};

exports.selectAccount = selectAccount;