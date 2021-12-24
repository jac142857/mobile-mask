"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.initTransport = exports.init = exports.initData = exports.initCore = exports.Core = exports.onCall = exports.handleMessage = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _events = _interopRequireDefault(require("events"));

var _DataManager = _interopRequireDefault(require("../data/DataManager"));

var _DeviceList = _interopRequireDefault(require("../device/DeviceList"));

var _Device = _interopRequireDefault(require("../device/Device"));

var _constants = require("../constants");

var _builder = require("../message/builder");

var _AbstractMethod = _interopRequireDefault(require("./methods/AbstractMethod"));

var _methods = require("./methods");

var _deferred = require("../utils/deferred");

var _promiseUtils = require("../utils/promiseUtils");

var _debug = _interopRequireWildcard(require("../utils/debug"));

var _interactionTimeout2 = _interopRequireDefault(require("../utils/interactionTimeout"));

// Public variables
// eslint-disable-next-line no-use-before-define
var _core; // Class with event emitter


var _deviceList; // Instance of DeviceList


var _popupPromise; // Waiting for popup handshake


var _uiPromises = []; // Waiting for ui response

var _callMethods = [];

var _preferredDevice; // TODO: type


var _interactionTimeout; // custom log


var _log = (0, _debug.init)('Core');
/**
 * Emit message to listener (parent).
 * Clear method reference from _callMethods
 * @param {CoreMessage} message
 * @returns {void}
 * @memberof Core
 */


var postMessage = function postMessage(message) {
  if (message.event === _constants.RESPONSE_EVENT) {
    var index = _callMethods.findIndex(function (call) {
      return call && call.responseID === message.id;
    });

    if (index >= 0) {
      _callMethods.splice(index, 1);
    }
  }

  _core.emit(_constants.CORE_EVENT, message);
};
/**
 * Creates an instance of _popupPromise.
 * If Core is used without popup this promise should be always resolved automatically
 * @param {boolean} requestWindow
 * @returns {Promise<void>}
 * @memberof Core
 */


var getPopupPromise = function getPopupPromise(requestWindow) {
  if (requestWindow === void 0) {
    requestWindow = true;
  }

  // request ui window (used with modal)
  if (requestWindow) {
    postMessage((0, _builder.UiMessage)(_constants.UI.REQUEST_UI_WINDOW));
  }

  if (!_popupPromise) {
    _popupPromise = (0, _deferred.create)();
  }

  return _popupPromise;
};
/**
 * Start interaction timeout timer
 */


var interactionTimeout = function interactionTimeout() {
  return _interactionTimeout.start(function () {
    // eslint-disable-next-line no-use-before-define
    onPopupClosed('Interaction timeout');
  });
};
/**
 * Creates an instance of uiPromise.
 * @param {string} promiseEvent
 * @param {Device} device
 * @returns {Promise<UiPromiseResponse>}
 * @memberof Core
 */


var createUiPromise = function createUiPromise(promiseEvent, device) {
  var uiPromise = (0, _deferred.create)(promiseEvent, device);

  _uiPromises.push(uiPromise); // Interaction timeout


  interactionTimeout();
  return uiPromise;
};
/**
 * Finds an instance of uiPromise.
 * @param {number} callId
 * @param {string} promiseEvent
 * @returns {Promise<UiPromiseResponse>}
 * @memberof Core
 */


var findUiPromise = function findUiPromise(callId, promiseEvent) {
  return _uiPromises.find(function (p) {
    return p.id === promiseEvent;
  });
};

var removeUiPromise = function removeUiPromise(promise) {
  _uiPromises = _uiPromises.filter(function (p) {
    return p !== promise;
  });
};
/**
 * Handle incoming message.
 * @param {CoreMessage} message
 * @param {boolean} isTrustedOrigin
 * @returns {void}
 * @memberof Core
 */


var _handleMessage = function handleMessage(message, isTrustedOrigin) {
  if (isTrustedOrigin === void 0) {
    isTrustedOrigin = false;
  }

  _log.log('handle message in core', isTrustedOrigin, message);

  var safeMessages = [_constants.IFRAME.CALL, _constants.POPUP.CLOSED, // UI.CHANGE_SETTINGS,
  _constants.UI.CUSTOM_MESSAGE_RESPONSE, _constants.UI.LOGIN_CHALLENGE_RESPONSE, _constants.TRANSPORT.DISABLE_WEBUSB];

  if (!isTrustedOrigin && safeMessages.indexOf(message.type) === -1) {
    return;
  }

  switch (message.type) {
    case _constants.POPUP.HANDSHAKE:
      getPopupPromise(false).resolve();
      break;

    case _constants.POPUP.CLOSED:
      // eslint-disable-next-line no-use-before-define
      onPopupClosed(message.payload ? message.payload.error : null);
      break;
    // case UI.CHANGE_SETTINGS :
    //     enableLog(parseSettings(message.payload).debug);
    //     break;

    case _constants.TRANSPORT.DISABLE_WEBUSB:
      // eslint-disable-next-line no-use-before-define
      disableWebUSBTransport();
      break;
    // messages from UI (popup/modal...)

    case _constants.UI.RECEIVE_DEVICE:
    case _constants.UI.RECEIVE_CONFIRMATION:
    case _constants.UI.RECEIVE_PERMISSION:
    case _constants.UI.RECEIVE_PIN:
    case _constants.UI.RECEIVE_PASSPHRASE:
    case _constants.UI.INVALID_PASSPHRASE_ACTION:
    case _constants.UI.RECEIVE_ACCOUNT:
    case _constants.UI.CHANGE_ACCOUNT:
    case _constants.UI.RECEIVE_FEE:
    case _constants.UI.CUSTOM_MESSAGE_RESPONSE:
    case _constants.UI.RECEIVE_WORD:
    case _constants.UI.LOGIN_CHALLENGE_RESPONSE:
      {
        var uiPromise = findUiPromise(0, message.type);

        if (uiPromise) {
          uiPromise.resolve({
            event: message.type,
            payload: message.payload
          });
          removeUiPromise(uiPromise);
        }

        break;
      }
    // message from index

    case _constants.IFRAME.CALL:
      // eslint-disable-next-line no-use-before-define
      onCall(message)["catch"](function (error) {
        _log.debug('onCall error', error);
      });
      break;
  }
};
/**
 * Find device by device path. Returned device may be unacquired.
 * @param {AbstractMethod} method
 * @returns {Promise<Device>}
 * @memberof Core
 */


exports.handleMessage = _handleMessage;

var initDevice = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(method) {
    var isWebUsb, device, devicesCount, selectedDevicePath, uiPromise, uiResp;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (_deviceList) {
              _context.next = 2;
              break;
            }

            throw _constants.ERRORS.TypedError('Transport_Missing');

          case 2:
            isWebUsb = _deviceList.transportType() === 'WebUsbPlugin';

            if (!method.devicePath) {
              _context.next = 7;
              break;
            }

            device = _deviceList.getDevice(method.devicePath);
            _context.next = 31;
            break;

          case 7:
            devicesCount = _deviceList.length();

            if (!(devicesCount === 1 && !isWebUsb)) {
              _context.next = 13;
              break;
            }

            // there is only one device available. use it
            selectedDevicePath = _deviceList.getFirstDevicePath();
            device = _deviceList.getDevice(selectedDevicePath);
            _context.next = 31;
            break;

          case 13:
            // no devices available
            // initialize uiPromise instance which will catch changes in _deviceList (see: handleDeviceSelectionChanges function)
            // but do not wait for resolve yet
            createUiPromise(_constants.UI.RECEIVE_DEVICE); // wait for popup handshake

            _context.next = 16;
            return getPopupPromise().promise;

          case 16:
            // check again for available devices
            // there is a possible race condition before popup open
            devicesCount = _deviceList.length();

            if (!(devicesCount === 1 && !isWebUsb)) {
              _context.next = 22;
              break;
            }

            // there is one device available. use it
            selectedDevicePath = _deviceList.getFirstDevicePath();
            device = _deviceList.getDevice(selectedDevicePath);
            _context.next = 31;
            break;

          case 22:
            // request select device view
            postMessage((0, _builder.UiMessage)(_constants.UI.SELECT_DEVICE, {
              webusb: isWebUsb,
              devices: _deviceList.asArray()
            })); // wait for device selection

            uiPromise = findUiPromise(method.responseID, _constants.UI.RECEIVE_DEVICE);

            if (!uiPromise) {
              _context.next = 31;
              break;
            }

            _context.next = 27;
            return uiPromise.promise;

          case 27:
            uiResp = _context.sent;

            if (uiResp.payload.remember) {
              if (!uiResp.payload.device.state) {
                delete uiResp.payload.device.state;
              }

              _preferredDevice = uiResp.payload.device;
            }

            selectedDevicePath = uiResp.payload.device.path;
            device = _deviceList.getDevice(selectedDevicePath);

          case 31:
            if (device) {
              _context.next = 33;
              break;
            }

            throw _constants.ERRORS.TypedError('Device_NotFound');

          case 33:
            return _context.abrupt("return", device);

          case 34:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function initDevice(_x) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Processing incoming message.
 * This method is async that's why it returns Promise but the real response is passed by postMessage(ResponseMessage)
 * @param {CoreMessage} message
 * @returns {Promise<void>}
 * @memberof Core
 */


var onCall = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(message) {
    var responseID, trustedHost, isUsingPopup, method, messageResponse, _response, device, _response2, previousCall, overrideError, PIN_TRIES, MAX_PIN_TRIES, inner, _response4;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(!message.id || !message.payload)) {
              _context3.next = 2;
              break;
            }

            throw _constants.ERRORS.TypedError('Method_InvalidParameter', 'onCall: message.id or message.payload is missing');

          case 2:
            responseID = message.id;
            trustedHost = _DataManager["default"].getSettings('trustedHost');
            isUsingPopup = _DataManager["default"].getSettings('popup');

            if (_preferredDevice && !message.payload.device) {
              message.payload.device = _preferredDevice;
            } // find method and parse incoming params


            _context3.prev = 6;
            method = (0, _methods.find)(message); // bind callbacks

            method.postMessage = postMessage;
            method.getPopupPromise = getPopupPromise;
            method.createUiPromise = createUiPromise;
            method.findUiPromise = findUiPromise;
            method.removeUiPromise = removeUiPromise;
            _context3.next = 20;
            break;

          case 15:
            _context3.prev = 15;
            _context3.t0 = _context3["catch"](6);
            postMessage((0, _builder.UiMessage)(_constants.POPUP.CANCEL_POPUP_REQUEST));
            postMessage((0, _builder.ResponseMessage)(responseID, false, {
              error: _context3.t0
            }));
            return _context3.abrupt("return", Promise.resolve());

          case 20:
            _callMethods.push(method); // this method is not using the device, there is no need to acquire


            if (method.useDevice) {
              _context3.next = 40;
              break;
            }

            _context3.prev = 22;

            if (!method.useUi) {
              _context3.next = 28;
              break;
            }

            _context3.next = 26;
            return getPopupPromise().promise;

          case 26:
            _context3.next = 29;
            break;

          case 28:
            // cancel popup request
            postMessage((0, _builder.UiMessage)(_constants.POPUP.CANCEL_POPUP_REQUEST));

          case 29:
            _context3.next = 31;
            return method.run();

          case 31:
            _response = _context3.sent;
            messageResponse = (0, _builder.ResponseMessage)(method.responseID, true, _response);
            _context3.next = 38;
            break;

          case 35:
            _context3.prev = 35;
            _context3.t1 = _context3["catch"](22);
            messageResponse = (0, _builder.ResponseMessage)(method.responseID, false, {
              error: _context3.t1
            });

          case 38:
            postMessage(messageResponse);
            return _context3.abrupt("return", Promise.resolve());

          case 40:
            if (!(!_deviceList && !_DataManager["default"].getSettings('transportReconnect'))) {
              _context3.next = 43;
              break;
            }

            _context3.next = 43;
            return initTransport(_DataManager["default"].getSettings());

          case 43:
            if (!(isUsingPopup && method.requiredPermissions.includes('management') && !_DataManager["default"].isManagementAllowed())) {
              _context3.next = 47;
              break;
            }

            postMessage((0, _builder.UiMessage)(_constants.POPUP.CANCEL_POPUP_REQUEST));
            postMessage((0, _builder.ResponseMessage)(responseID, false, {
              error: _constants.ERRORS.TypedError('Method_NotAllowed')
            }));
            return _context3.abrupt("return", Promise.resolve());

          case 47:
            _context3.prev = 47;
            _context3.next = 50;
            return initDevice(method);

          case 50:
            device = _context3.sent;
            _context3.next = 64;
            break;

          case 53:
            _context3.prev = 53;
            _context3.t2 = _context3["catch"](47);

            if (!(_context3.t2.code === 'Transport_Missing')) {
              _context3.next = 61;
              break;
            }

            _context3.next = 58;
            return getPopupPromise().promise;

          case 58:
            // show message about transport
            postMessage((0, _builder.UiMessage)(_constants.UI.TRANSPORT));
            _context3.next = 62;
            break;

          case 61:
            // cancel popup request
            postMessage((0, _builder.UiMessage)(_constants.POPUP.CANCEL_POPUP_REQUEST));

          case 62:
            // TODO: this should not be returned here before user agrees on "read" perms...
            postMessage((0, _builder.ResponseMessage)(responseID, false, {
              error: _context3.t2
            }));
            throw _context3.t2;

          case 64:
            method.setDevice(device); // method is a debug link message

            if (!method.debugLink) {
              _context3.next = 79;
              break;
            }

            _context3.prev = 66;
            _context3.next = 69;
            return method.run();

          case 69:
            _response2 = _context3.sent;
            messageResponse = (0, _builder.ResponseMessage)(method.responseID, true, _response2);
            postMessage(messageResponse);
            return _context3.abrupt("return", Promise.resolve());

          case 75:
            _context3.prev = 75;
            _context3.t3 = _context3["catch"](66);
            postMessage((0, _builder.ResponseMessage)(method.responseID, false, {
              error: _context3.t3
            }));
            throw _context3.t3;

          case 79:
            // find pending calls to this device
            previousCall = _callMethods.filter(function (call) {
              return call && call !== method && call.devicePath === method.devicePath;
            });

            if (!(previousCall.length > 0 && method.overridePreviousCall)) {
              _context3.next = 90;
              break;
            }

            // set flag for each pending method
            previousCall.forEach(function (call) {
              call.overridden = true;
            }); // interrupt potential communication with device. this should throw error in try/catch block below
            // this error will apply to the last item of pending methods

            overrideError = _constants.ERRORS.TypedError('Method_Override');
            _context3.next = 85;
            return device.override(overrideError);

          case 85:
            if (!method.overridden) {
              _context3.next = 88;
              break;
            }

            postMessage((0, _builder.ResponseMessage)(method.responseID, false, {
              error: overrideError
            }));
            throw overrideError;

          case 88:
            _context3.next = 98;
            break;

          case 90:
            if (!device.isRunning()) {
              _context3.next = 98;
              break;
            }

            if (device.isLoaded()) {
              _context3.next = 96;
              break;
            }

            _context3.next = 94;
            return device.waitForFirstRun();

          case 94:
            _context3.next = 98;
            break;

          case 96:
            // cancel popup request
            // postMessage(UiMessage(POPUP.CANCEL_POPUP_REQUEST));
            postMessage((0, _builder.ResponseMessage)(responseID, false, {
              error: _constants.ERRORS.TypedError('Device_CallInProgress')
            }));
            throw _constants.ERRORS.TypedError('Device_CallInProgress');

          case 98:
            // set device instance. default is 0
            device.setInstance(method.deviceInstance);

            if (method.hasExpectedDeviceState) {
              device.setExternalState(method.deviceState);
            } // device is available
            // set public variables, listeners and run method

            /* eslint-disable no-use-before-define */


            device.on(_constants.DEVICE.BUTTON, function (device, code) {
              onDeviceButtonHandler(device, code, method);
            });
            device.on(_constants.DEVICE.PIN, onDevicePinHandler);
            device.on(_constants.DEVICE.WORD, onDeviceWordHandler);
            device.on(_constants.DEVICE.PASSPHRASE, method.useEmptyPassphrase ? onEmptyPassphraseHandler : onDevicePassphraseHandler);
            device.on(_constants.DEVICE.PASSPHRASE_ON_DEVICE, function () {
              postMessage((0, _builder.UiMessage)(_constants.UI.REQUEST_PASSPHRASE_ON_DEVICE, {
                device: device.toMessageObject()
              }));
            });
            /* eslint-enable no-use-before-define */
            // try to reconfigure messages before Initialize

            if (!_deviceList) {
              _context3.next = 108;
              break;
            }

            _context3.next = 108;
            return _deviceList.reconfigure(device.getVersion());

          case 108:
            _context3.prev = 108;
            PIN_TRIES = 1;
            MAX_PIN_TRIES = 3; // This function will run inside Device.run() after device will be acquired and initialized

            inner = /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
                var firmwareException, unexpectedMode, permitted, deviceNeedsBackup, _permitted, confirmed, invalidDeviceState, uiPromise, uiResp, resp, customMessages, _response3;

                return _regenerator["default"].wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return method.checkFirmwareRange(isUsingPopup);

                      case 2:
                        firmwareException = _context2.sent;

                        if (!firmwareException) {
                          _context2.next = 14;
                          break;
                        }

                        if (!isUsingPopup) {
                          _context2.next = 13;
                          break;
                        }

                        _context2.next = 7;
                        return getPopupPromise().promise;

                      case 7:
                        // show unexpected state information
                        postMessage((0, _builder.UiMessage)(firmwareException, device.toMessageObject())); // wait for device disconnect

                        _context2.next = 10;
                        return createUiPromise(_constants.DEVICE.DISCONNECT, device).promise;

                      case 10:
                        return _context2.abrupt("return", Promise.reject(_constants.ERRORS.TypedError('Method_Cancel')));

                      case 13:
                        return _context2.abrupt("return", Promise.reject(_constants.ERRORS.TypedError('Device_FwException', firmwareException)));

                      case 14:
                        // check if device is in unexpected mode [bootloader, not-initialized, required firmware]
                        unexpectedMode = device.hasUnexpectedMode(method.allowDeviceMode, method.requireDeviceMode);

                        if (!unexpectedMode) {
                          _context2.next = 27;
                          break;
                        }

                        device.keepSession = false;

                        if (!isUsingPopup) {
                          _context2.next = 26;
                          break;
                        }

                        _context2.next = 20;
                        return getPopupPromise().promise;

                      case 20:
                        // show unexpected state information
                        postMessage((0, _builder.UiMessage)(unexpectedMode, device.toMessageObject())); // wait for device disconnect

                        _context2.next = 23;
                        return createUiPromise(_constants.DEVICE.DISCONNECT, device).promise;

                      case 23:
                        return _context2.abrupt("return", Promise.reject(_constants.ERRORS.TypedError('Device_ModeException', unexpectedMode)));

                      case 26:
                        return _context2.abrupt("return", Promise.reject(_constants.ERRORS.TypedError('Device_ModeException', unexpectedMode)));

                      case 27:
                        // check and request permissions [read, write...]
                        method.checkPermissions();

                        if (!(!trustedHost && method.requiredPermissions.length > 0)) {
                          _context2.next = 34;
                          break;
                        }

                        _context2.next = 31;
                        return method.requestPermissions();

                      case 31:
                        permitted = _context2.sent;

                        if (permitted) {
                          _context2.next = 34;
                          break;
                        }

                        return _context2.abrupt("return", Promise.reject(_constants.ERRORS.TypedError('Method_PermissionsNotGranted')));

                      case 34:
                        deviceNeedsBackup = device.features.needs_backup;

                        if (!(deviceNeedsBackup && typeof method.noBackupConfirmation === 'function')) {
                          _context2.next = 41;
                          break;
                        }

                        _context2.next = 38;
                        return method.noBackupConfirmation();

                      case 38:
                        _permitted = _context2.sent;

                        if (_permitted) {
                          _context2.next = 41;
                          break;
                        }

                        return _context2.abrupt("return", Promise.reject(_constants.ERRORS.TypedError('Method_PermissionsNotGranted')));

                      case 41:
                        if (!deviceNeedsBackup) {
                          _context2.next = 45;
                          break;
                        }

                        _context2.next = 44;
                        return getPopupPromise().promise;

                      case 44:
                        // show notification
                        postMessage((0, _builder.UiMessage)(_constants.UI.DEVICE_NEEDS_BACKUP, device.toMessageObject()));

                      case 45:
                        if (!(device.firmwareStatus === 'outdated')) {
                          _context2.next = 49;
                          break;
                        }

                        _context2.next = 48;
                        return getPopupPromise().promise;

                      case 48:
                        // show notification
                        postMessage((0, _builder.UiMessage)(_constants.UI.FIRMWARE_OUTDATED, device.toMessageObject()));

                      case 49:
                        if (!(!trustedHost && typeof method.confirmation === 'function')) {
                          _context2.next = 55;
                          break;
                        }

                        _context2.next = 52;
                        return method.confirmation();

                      case 52:
                        confirmed = _context2.sent;

                        if (confirmed) {
                          _context2.next = 55;
                          break;
                        }

                        return _context2.abrupt("return", Promise.reject(_constants.ERRORS.TypedError('Method_Cancel')));

                      case 55:
                        if (!_deviceList) {
                          _context2.next = 58;
                          break;
                        }

                        _context2.next = 58;
                        return _deviceList.reconfigure(device.getVersion());

                      case 58:
                        _context2.prev = 58;

                        if (!method.useDeviceState) {
                          _context2.next = 65;
                          break;
                        }

                        _context2.next = 62;
                        return device.validateState(method.network);

                      case 62:
                        _context2.t0 = _context2.sent;
                        _context2.next = 66;
                        break;

                      case 65:
                        _context2.t0 = undefined;

                      case 66:
                        invalidDeviceState = _context2.t0;

                        if (!invalidDeviceState) {
                          _context2.next = 86;
                          break;
                        }

                        if (!isUsingPopup) {
                          _context2.next = 85;
                          break;
                        }

                        // initialize user response promise
                        uiPromise = createUiPromise(_constants.UI.INVALID_PASSPHRASE_ACTION, device); // request action view

                        postMessage((0, _builder.UiMessage)(_constants.UI.INVALID_PASSPHRASE, {
                          device: device.toMessageObject()
                        })); // wait for user response

                        _context2.next = 73;
                        return uiPromise.promise;

                      case 73:
                        uiResp = _context2.sent;
                        resp = uiResp.payload;

                        if (!resp) {
                          _context2.next = 82;
                          break;
                        }

                        // reset internal device state and try again
                        device.setInternalState(undefined);
                        _context2.next = 79;
                        return device.initialize(method.useEmptyPassphrase);

                      case 79:
                        return _context2.abrupt("return", inner());

                      case 82:
                        // set new state as requested
                        device.setExternalState(invalidDeviceState);

                      case 83:
                        _context2.next = 86;
                        break;

                      case 85:
                        throw _constants.ERRORS.TypedError('Device_InvalidState');

                      case 86:
                        _context2.next = 98;
                        break;

                      case 88:
                        _context2.prev = 88;
                        _context2.t1 = _context2["catch"](58);

                        if (!(_context2.t1.message === _constants.ERRORS.INVALID_PIN_ERROR_MESSAGE && PIN_TRIES < MAX_PIN_TRIES)) {
                          _context2.next = 96;
                          break;
                        }

                        PIN_TRIES++;
                        postMessage((0, _builder.UiMessage)(_constants.UI.INVALID_PIN, {
                          device: device.toMessageObject()
                        }));
                        return _context2.abrupt("return", inner());

                      case 96:
                        // other error
                        // postMessage(ResponseMessage(method.responseID, false, { error }));
                        // eslint-disable-next-line no-use-before-define
                        // closePopup();
                        // clear cached passphrase. it's not valid
                        device.setInternalState(undefined); // interrupt process and go to "final" block

                        return _context2.abrupt("return", Promise.reject(_context2.t1));

                      case 98:
                        if (!method.useUi) {
                          _context2.next = 103;
                          break;
                        }

                        _context2.next = 101;
                        return getPopupPromise().promise;

                      case 101:
                        _context2.next = 104;
                        break;

                      case 103:
                        // popup is not required
                        postMessage((0, _builder.UiMessage)(_constants.POPUP.CANCEL_POPUP_REQUEST));

                      case 104:
                        _context2.prev = 104;
                        // for CustomMessage method reconfigure transport with custom messages definitions
                        customMessages = method.getCustomMessages();

                        if (!(_deviceList && customMessages)) {
                          _context2.next = 109;
                          break;
                        }

                        _context2.next = 109;
                        return _deviceList.reconfigure(customMessages, true);

                      case 109:
                        _context2.next = 111;
                        return method.run();

                      case 111:
                        _response3 = _context2.sent;
                        messageResponse = (0, _builder.ResponseMessage)(method.responseID, true, _response3);
                        _context2.next = 118;
                        break;

                      case 115:
                        _context2.prev = 115;
                        _context2.t2 = _context2["catch"](104);
                        return _context2.abrupt("return", Promise.reject(_context2.t2));

                      case 118:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[58, 88], [104, 115]]);
              }));

              return function inner() {
                return _ref3.apply(this, arguments);
              };
            }(); // run inner function


            _context3.next = 114;
            return device.run(inner, {
              keepSession: method.keepSession,
              useEmptyPassphrase: method.useEmptyPassphrase,
              skipFinalReload: method.skipFinalReload
            });

          case 114:
            _context3.next = 120;
            break;

          case 116:
            _context3.prev = 116;
            _context3.t4 = _context3["catch"](108);

            // corner case: Device was disconnected during authorization
            // this device_id needs to be stored and penalized with delay on future connection
            // this solves issue with U2F login (leaves space for requests from services which aren't using trezord)
            if (_deviceList && _context3.t4.code === 'Device_Disconnected') {
              _deviceList.addAuthPenalty(device);
            }

            if (method) {
              // corner case:
              // thrown while acquiring device
              // it's a race condition between two tabs
              // workaround is to enumerate transport again and report changes to get a valid session number
              if (_deviceList && _context3.t4.message === _constants.ERRORS.WRONG_PREVIOUS_SESSION_ERROR_MESSAGE) {
                _deviceList.enumerate();
              }

              messageResponse = (0, _builder.ResponseMessage)(method.responseID, false, {
                error: _context3.t4
              });
            }

          case 120:
            _context3.prev = 120;

            // Work done
            _log.log('onCall::finally', messageResponse);

            _response4 = messageResponse;

            if (!_response4) {
              _context3.next = 134;
              break;
            }

            _context3.next = 126;
            return device.cleanup();

          case 126:
            // eslint-disable-next-line no-use-before-define
            closePopup(); // eslint-disable-next-line no-use-before-define

            cleanup();

            if (method) {
              method.dispose();
            } // restore default messages


            if (!_deviceList) {
              _context3.next = 133;
              break;
            }

            if (_response4.success) {
              _deviceList.removeAuthPenalty(device);
            }

            _context3.next = 133;
            return _deviceList.restoreMessages();

          case 133:
            postMessage(_response4);

          case 134:
            return _context3.finish(120);

          case 135:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[6, 15], [22, 35], [47, 53], [66, 75], [108, 116, 120, 135]]);
  }));

  return function onCall(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Clean up all variables and references.
 * @returns {void}
 * @memberof Core
 */


exports.onCall = onCall;

var cleanup = function cleanup() {
  // closePopup(); // this causes problem when action is interrupted (example: bootloader mode)
  _popupPromise = null;
  _uiPromises = []; // TODO: remove only promises with params callId

  _interactionTimeout.stop();

  _log.log('Cleanup...');
};
/**
 * Force close popup.
 * @returns {void}
 * @memberof Core
 */


var closePopup = function closePopup() {
  if (_popupPromise) {
    postMessage((0, _builder.UiMessage)(_constants.POPUP.CANCEL_POPUP_REQUEST));
  }

  postMessage((0, _builder.UiMessage)(_constants.UI.CLOSE_UI_WINDOW));
};
/**
 * Handle button request from Device.
 * @param {Device} device
 * @param {string} code
 * @returns {Promise<void>}
 * @memberof Core
 */


var onDeviceButtonHandler = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(device, code, method) {
    var addressRequest, data;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // wait for popup handshake
            addressRequest = code === 'ButtonRequest_Address';

            if (!(!addressRequest || addressRequest && method.useUi)) {
              _context4.next = 4;
              break;
            }

            _context4.next = 4;
            return getPopupPromise().promise;

          case 4:
            data = typeof method.getButtonRequestData === 'function' ? method.getButtonRequestData(code) : null; // interaction timeout

            interactionTimeout(); // request view

            postMessage((0, _builder.DeviceMessage)(_constants.DEVICE.BUTTON, {
              device: device.toMessageObject(),
              code: code
            }));
            postMessage((0, _builder.UiMessage)(_constants.UI.REQUEST_BUTTON, {
              device: device.toMessageObject(),
              code: code,
              data: data
            }));

            if (addressRequest && !method.useUi) {
              postMessage((0, _builder.UiMessage)(_constants.UI.ADDRESS_VALIDATION, data));
            }

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function onDeviceButtonHandler(_x3, _x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();
/**
 * Handle pin request from Device.
 * @param {Device} device
 * @param {string} type
 * @param {Function} callback
 * @returns {Promise<void>}
 * @memberof Core
 */


var onDevicePinHandler = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(device, type, callback) {
    var uiPromise, uiResp, pin;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getPopupPromise().promise;

          case 2:
            // create ui promise
            uiPromise = createUiPromise(_constants.UI.RECEIVE_PIN, device); // request pin view

            postMessage((0, _builder.UiMessage)(_constants.UI.REQUEST_PIN, {
              device: device.toMessageObject(),
              type: type
            })); // wait for pin

            _context5.next = 6;
            return uiPromise.promise;

          case 6:
            uiResp = _context5.sent;
            pin = uiResp.payload; // callback.apply(null, [null, pin]);

            callback(null, pin);

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function onDevicePinHandler(_x6, _x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();

var onDeviceWordHandler = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(device, type, callback) {
    var uiPromise, uiResp, word;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getPopupPromise().promise;

          case 2:
            // create ui promise
            uiPromise = createUiPromise(_constants.UI.RECEIVE_WORD, device);
            postMessage((0, _builder.UiMessage)(_constants.UI.REQUEST_WORD, {
              device: device.toMessageObject(),
              type: type
            })); // wait for word

            _context6.next = 6;
            return uiPromise.promise;

          case 6:
            uiResp = _context6.sent;
            word = uiResp.payload;
            callback(null, word);

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function onDeviceWordHandler(_x9, _x10, _x11) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * Handle passphrase request from Device.
 * @param {Device} device
 * @param {Function} callback
 * @returns {Promise<void>}
 * @memberof Core
 */


var onDevicePassphraseHandler = /*#__PURE__*/function () {
  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(device, callback) {
    var uiPromise, uiResp, passphrase, passphraseOnDevice, cache;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return getPopupPromise().promise;

          case 2:
            // create ui promise
            uiPromise = createUiPromise(_constants.UI.RECEIVE_PASSPHRASE, device); // request passphrase view

            postMessage((0, _builder.UiMessage)(_constants.UI.REQUEST_PASSPHRASE, {
              device: device.toMessageObject()
            })); // wait for passphrase

            _context7.next = 6;
            return uiPromise.promise;

          case 6:
            uiResp = _context7.sent;
            passphrase = uiResp.payload.value;
            passphraseOnDevice = uiResp.payload.passphraseOnDevice;
            cache = uiResp.payload.save; // send as PassphrasePromptResponse

            callback({
              passphrase: passphrase.normalize('NFKD'),
              passphraseOnDevice: passphraseOnDevice,
              cache: cache
            });

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function onDevicePassphraseHandler(_x12, _x13) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * Handle passphrase request from Device and use empty
 * @param {Device} device
 * @param {Function} callback
 * @returns {Promise<void>}
 * @memberof Core
 */


var onEmptyPassphraseHandler = /*#__PURE__*/function () {
  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(device, callback) {
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            // send as PassphrasePromptResponse
            callback({
              passphrase: ''
            });

          case 1:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function onEmptyPassphraseHandler(_x14, _x15) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * Handle popup closed by user.
 * @returns {void}
 * @memberof Core
 */


var onPopupClosed = function onPopupClosed(customErrorMessage) {
  var error = customErrorMessage ? _constants.ERRORS.TypedError('Method_Cancel', customErrorMessage) : _constants.ERRORS.TypedError('Method_Interrupted'); // Device was already acquired. Try to interrupt running action which will throw error from onCall try/catch block

  if (_deviceList && _deviceList.asArray().length > 0) {
    _deviceList.allDevices().forEach(function (d) {
      d.keepSession = false; // clear session on release

      if (d.isUsedHere()) {
        d.interruptionFromUser(error);
      } else {
        var uiPromise = findUiPromise(0, _constants.DEVICE.DISCONNECT);

        if (uiPromise) {
          uiPromise.resolve({
            event: error.message,
            payload: null
          });
        } else {
          _callMethods.forEach(function (m) {
            postMessage((0, _builder.ResponseMessage)(m.responseID, false, {
              error: error
            }));
          });

          _callMethods.splice(0, _callMethods.length);
        }
      }
    });

    cleanup(); // Waiting for device. Throw error before onCall try/catch block
  } else {
    if (_uiPromises.length > 0) {
      _uiPromises.forEach(function (p) {
        p.reject(error);
      });

      _uiPromises = [];
    }

    if (_popupPromise) {
      _popupPromise.reject(error);

      _popupPromise = null;
    }

    cleanup();
  }
};
/**
 * Handle DeviceList changes.
 * If there is uiPromise waiting for device selection update view.
 * Used in initDevice function
 * @param {DeviceTyped} interruptDevice
 * @returns {void}
 * @memberof Core
 */


var handleDeviceSelectionChanges = function handleDeviceSelectionChanges(interruptDevice) {
  if (interruptDevice === void 0) {
    interruptDevice = null;
  }

  // update list of devices in popup
  var uiPromise = findUiPromise(0, _constants.UI.RECEIVE_DEVICE);

  if (uiPromise && _deviceList) {
    var list = _deviceList.asArray();

    var isWebUsb = _deviceList.transportType().indexOf('webusb') >= 0;

    if (list.length === 1 && !isWebUsb) {
      // there is only one device. use it
      // resolve uiPromise to looks like it's a user choice (see: handleMessage function)
      uiPromise.resolve({
        event: _constants.UI.RECEIVE_DEVICE,
        payload: {
          device: list[0]
        }
      });
      removeUiPromise(uiPromise);
    } else {
      // update device selection list view
      postMessage((0, _builder.UiMessage)(_constants.UI.SELECT_DEVICE, {
        webusb: isWebUsb,
        devices: list
      }));
    }
  } // device was disconnected, interrupt pending uiPromises for this device


  if (interruptDevice) {
    var path = interruptDevice.path;
    var shouldClosePopup = false;

    _uiPromises.forEach(function (p) {
      if (p.device && p.device.getDevicePath() === path) {
        if (p.id === _constants.DEVICE.DISCONNECT) {
          p.resolve({
            event: _constants.DEVICE.DISCONNECT,
            payload: null
          });
        }

        shouldClosePopup = true;
      }
    });

    if (_preferredDevice && _preferredDevice.path === path) {
      _preferredDevice = null;
    }

    if (shouldClosePopup) {
      closePopup();
      cleanup();
    }
  }
};
/**
 * Start DeviceList with listeners.
 * @param {ConnectSettings} settings
 * @returns {Promise<void>}
 * @memberof Core
 */


var initDeviceList = /*#__PURE__*/function () {
  var _ref9 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(settings) {
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            _deviceList = new _DeviceList["default"]();

            _deviceList.on(_constants.DEVICE.CONNECT, function (device) {
              handleDeviceSelectionChanges();
              postMessage((0, _builder.DeviceMessage)(_constants.DEVICE.CONNECT, device));
            });

            _deviceList.on(_constants.DEVICE.CONNECT_UNACQUIRED, function (device) {
              handleDeviceSelectionChanges();
              postMessage((0, _builder.DeviceMessage)(_constants.DEVICE.CONNECT_UNACQUIRED, device));
            });

            _deviceList.on(_constants.DEVICE.DISCONNECT, function (device) {
              handleDeviceSelectionChanges(device);
              postMessage((0, _builder.DeviceMessage)(_constants.DEVICE.DISCONNECT, device));
            });

            _deviceList.on(_constants.DEVICE.CHANGED, function (device) {
              postMessage((0, _builder.DeviceMessage)(_constants.DEVICE.CHANGED, device));
            });

            _deviceList.on(_constants.TRANSPORT.ERROR, /*#__PURE__*/function () {
              var _ref10 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(error) {
                return _regenerator["default"].wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _log.error('TRANSPORT ERROR', error);

                        if (_deviceList) {
                          _deviceList.disconnectDevices();

                          _deviceList.removeAllListeners();
                        }

                        _deviceList = null;
                        postMessage((0, _builder.TransportMessage)(_constants.TRANSPORT.ERROR, {
                          error: error
                        })); // if transport fails during app lifetime, try to reconnect

                        if (!settings.transportReconnect) {
                          _context9.next = 9;
                          break;
                        }

                        _context9.next = 7;
                        return (0, _promiseUtils.resolveAfter)(1000, null);

                      case 7:
                        _context9.next = 9;
                        return initDeviceList(settings);

                      case 9:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9);
              }));

              return function (_x17) {
                return _ref10.apply(this, arguments);
              };
            }());

            _deviceList.on(_constants.TRANSPORT.START, function (transportType) {
              return postMessage((0, _builder.TransportMessage)(_constants.TRANSPORT.START, transportType));
            });

            _context10.next = 10;
            return _deviceList.init();

          case 10:
            if (!_deviceList) {
              _context10.next = 13;
              break;
            }

            _context10.next = 13;
            return _deviceList.waitForTransportFirstEvent();

          case 13:
            _context10.next = 27;
            break;

          case 15:
            _context10.prev = 15;
            _context10.t0 = _context10["catch"](0);
            // eslint-disable-next-line require-atomic-updates
            _deviceList = null;
            postMessage((0, _builder.TransportMessage)(_constants.TRANSPORT.ERROR, {
              error: _context10.t0
            }));

            if (settings.transportReconnect) {
              _context10.next = 23;
              break;
            }

            throw _context10.t0;

          case 23:
            _context10.next = 25;
            return (0, _promiseUtils.resolveAfter)(3000, null);

          case 25:
            _context10.next = 27;
            return initDeviceList(settings);

          case 27:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[0, 15]]);
  }));

  return function initDeviceList(_x16) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * An event emitter for communication with parent
 * @extends EventEmitter
 * @memberof Core
 */


var Core = /*#__PURE__*/function (_EventEmitter) {
  (0, _inheritsLoose2["default"])(Core, _EventEmitter);

  function Core() {
    return _EventEmitter.call(this) || this;
  }

  var _proto = Core.prototype;

  _proto.handleMessage = function handleMessage(message, isTrustedOrigin) {
    _handleMessage(message, isTrustedOrigin);
  };

  _proto.onBeforeUnload = function onBeforeUnload() {
    if (_deviceList) {
      _deviceList.onBeforeUnload();
    }

    this.removeAllListeners();
  };

  _proto.getCurrentMethod = function getCurrentMethod() {
    return _callMethods;
  };

  _proto.getTransportInfo = function getTransportInfo() {
    if (_deviceList) {
      return _deviceList.getTransportInfo();
    }

    return {
      type: '',
      version: '',
      outdated: true
    };
  };

  return Core;
}(_events["default"]);
/**
 * Init instance of Core event emitter.
 * @returns {Core}
 * @memberof Core
 */


exports.Core = Core;

var initCore = function initCore() {
  _core = new Core();
  return _core;
};
/**
 * Module initialization.
 * This will download the config.json, start DeviceList, init Core emitter instance.
 * Returns Core, an event emitter instance.
 * @param {Object} settings - optional // TODO
 * @returns {Promise<Core>}
 * @memberof Core
 */


exports.initCore = initCore;

var initData = /*#__PURE__*/function () {
  var _ref11 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(settings) {
    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _context11.prev = 0;
            _context11.next = 3;
            return _DataManager["default"].load(settings);

          case 3:
            _context11.next = 9;
            break;

          case 5:
            _context11.prev = 5;
            _context11.t0 = _context11["catch"](0);

            _log.log('init error', _context11.t0);

            throw _context11.t0;

          case 9:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[0, 5]]);
  }));

  return function initData(_x18) {
    return _ref11.apply(this, arguments);
  };
}();

exports.initData = initData;

var init = /*#__PURE__*/function () {
  var _ref12 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(settings) {
    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.prev = 0;
            _log.enabled = !!settings.debug;
            _context12.next = 4;
            return _DataManager["default"].load(settings);

          case 4:
            _context12.next = 6;
            return initCore();

          case 6:
            // If we're not in popup mode, set the interaction timeout to 0 (= disabled)
            _interactionTimeout = new _interactionTimeout2["default"](settings.popup ? settings.interactionTimeout : 0);
            return _context12.abrupt("return", _core);

          case 10:
            _context12.prev = 10;
            _context12.t0 = _context12["catch"](0);

            // TODO: kill app
            _log.log('init error', _context12.t0);

            throw _context12.t0;

          case 14:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[0, 10]]);
  }));

  return function init(_x19) {
    return _ref12.apply(this, arguments);
  };
}();

exports.init = init;

var initTransport = /*#__PURE__*/function () {
  var _ref13 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(settings) {
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.prev = 0;

            if (settings.transportReconnect) {
              _context13.next = 6;
              break;
            }

            _context13.next = 4;
            return initDeviceList(settings);

          case 4:
            _context13.next = 7;
            break;

          case 6:
            // don't wait for DeviceList result, further communication will be thru TRANSPORT events
            initDeviceList(settings);

          case 7:
            _context13.next = 13;
            break;

          case 9:
            _context13.prev = 9;
            _context13.t0 = _context13["catch"](0);

            _log.log('initTransport', _context13.t0);

            throw _context13.t0;

          case 13:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[0, 9]]);
  }));

  return function initTransport(_x20) {
    return _ref13.apply(this, arguments);
  };
}();

exports.initTransport = initTransport;

var disableWebUSBTransport = /*#__PURE__*/function () {
  var _ref14 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
    var settings;
    return _regenerator["default"].wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            if (_deviceList) {
              _context14.next = 2;
              break;
            }

            return _context14.abrupt("return");

          case 2:
            if (!(_deviceList.transportType() !== 'WebUsbPlugin')) {
              _context14.next = 4;
              break;
            }

            return _context14.abrupt("return");

          case 4:
            // override settings
            settings = _DataManager["default"].getSettings();
            settings.webusb = false;
            _context14.prev = 6;

            // disconnect previous device list
            _deviceList.onBeforeUnload(); // and init with new settings, without webusb


            _context14.next = 10;
            return initDeviceList(settings);

          case 10:
            _context14.next = 14;
            break;

          case 12:
            _context14.prev = 12;
            _context14.t0 = _context14["catch"](6);

          case 14:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, null, [[6, 12]]);
  }));

  return function disableWebUSBTransport() {
    return _ref14.apply(this, arguments);
  };
}();