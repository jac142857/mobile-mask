"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.initInvalidPassphraseView = void 0;

var _builder = require("../../message/builder");

var UI = _interopRequireWildcard(require("../../constants/ui"));

var _common = require("./common");

var initInvalidPassphraseView = function initInvalidPassphraseView(payload) {
  (0, _common.showView)('invalid-passphrase');

  var retryButton = _common.container.getElementsByClassName('retry')[0];

  var useCurrentButton = _common.container.getElementsByClassName('useCurrent')[0];

  retryButton.onclick = function () {
    (0, _common.postMessage)((0, _builder.UiMessage)(UI.INVALID_PASSPHRASE_ACTION, true));
    (0, _common.showView)('loader');
  };

  useCurrentButton.onclick = function () {
    (0, _common.postMessage)((0, _builder.UiMessage)(UI.INVALID_PASSPHRASE_ACTION, false));
    (0, _common.showView)('loader');
  };
};

exports.initInvalidPassphraseView = initInvalidPassphraseView;