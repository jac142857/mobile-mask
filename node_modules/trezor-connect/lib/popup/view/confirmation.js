"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.initConfirmationView = void 0;

var _builder = require("../../message/builder");

var UI = _interopRequireWildcard(require("../../constants/ui"));

var _common = require("./common");

var initConfirmationView = function initConfirmationView(data) {
  // Confirmation views:
  // - export xpub
  // - export account info
  // - no backup
  // TODO: Check if correct class names for HTML views
  (0, _common.showView)(data.view);

  var h3 = _common.container.getElementsByTagName('h3')[0];

  var confirmButton = _common.container.getElementsByClassName('confirm')[0];

  var cancelButton = _common.container.getElementsByClassName('cancel')[0];

  var label = data.label,
      customConfirmButton = data.customConfirmButton,
      customCancelButton = data.customCancelButton;

  if (customConfirmButton) {
    confirmButton.innerText = customConfirmButton.label;
    confirmButton.classList.add(customConfirmButton.className);
  }

  if (customCancelButton) {
    confirmButton.innerText = customCancelButton.label;
    confirmButton.classList.add(customCancelButton.className);
  }

  if (label) {
    h3.innerHTML = label;
  }

  confirmButton.onclick = function () {
    (0, _common.postMessage)((0, _builder.UiMessage)(UI.RECEIVE_CONFIRMATION, true));
    (0, _common.showView)('loader');
  };

  cancelButton.onclick = function () {
    (0, _common.postMessage)((0, _builder.UiMessage)(UI.RECEIVE_CONFIRMATION, false));
    (0, _common.showView)('loader');
  };
};

exports.initConfirmationView = initConfirmationView;