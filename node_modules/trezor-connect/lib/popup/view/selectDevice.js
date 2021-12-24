"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.selectDevice = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _builder = require("../../message/builder");

var UI = _interopRequireWildcard(require("../../constants/ui"));

var POPUP = _interopRequireWildcard(require("../../constants/popup"));

var _common = require("./common");

var _DataManager = _interopRequireDefault(require("../../data/DataManager"));

var initWebUsbButton = function initWebUsbButton(webusb, showLoader) {
  if (!webusb) return;

  var webusbContainer = _common.container.getElementsByClassName('webusb')[0];

  webusbContainer.style.display = 'flex';
  var button = webusbContainer.getElementsByTagName('button')[0];

  if (!_common.iframe) {
    button.innerHTML = '<span class="plus"></span><span class="text">Pair devices</span>';
  }

  var usb = _common.iframe ? _common.iframe.clientInformation.usb : null;

  var onClick = /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (usb) {
                _context.next = 3;
                break;
              }

              window.postMessage({
                type: POPUP.EXTENSION_USB_PERMISSIONS
              }, window.location.origin);
              return _context.abrupt("return");

            case 3:
              _context.prev = 3;
              _context.next = 6;
              return usb.requestDevice({
                filters: _DataManager["default"].getConfig().webusb
              });

            case 6:
              if (showLoader) {
                (0, _common.showView)('loader');
              }

              _context.next = 11;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](3);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 9]]);
    }));

    return function onClick() {
      return _ref.apply(this, arguments);
    };
  }();

  button.onclick = onClick;
};

var selectDevice = function selectDevice(payload) {
  if (!payload) return;

  if (!payload.devices || !Array.isArray(payload.devices) || payload.devices.length === 0) {
    // No device connected
    (0, _common.showView)('connect');
    initWebUsbButton(payload.webusb, true);
    return;
  }

  (0, _common.showView)('select-device');
  initWebUsbButton(payload.webusb, false); // If only 'remember device for now' toggle and no webusb button is available
  // show it right under the table

  if (!payload.webusb) {
    var wrapper = _common.container.getElementsByClassName('wrapper')[0];

    wrapper.style.justifyContent = 'normal';
  } // Populate device list


  var deviceList = _common.container.getElementsByClassName('select-device-list')[0]; // deviceList.innerHTML = '';


  var rememberCheckbox = _common.container.getElementsByClassName('remember-device')[0]; // Show readable devices first


  payload.devices.sort(function (d1, d2) {
    if (d1.type === 'unreadable' && d2.type !== 'unreadable') {
      return 1;
    } else if (d1.type !== 'unreadable' && d2.type === 'unreadable') {
      return -1;
    }

    return 0;
  });
  payload.devices.forEach(function (device) {
    var deviceButton = document.createElement('button');
    deviceButton.className = 'list';

    if (device.type !== 'unreadable') {
      deviceButton.addEventListener('click', function () {
        (0, _common.postMessage)((0, _builder.UiMessage)(UI.RECEIVE_DEVICE, {
          remember: rememberCheckbox && rememberCheckbox.checked,
          device: device
        }));
        (0, _common.showView)('loader');
      });
    }

    var deviceIcon = document.createElement('span');
    deviceIcon.className = 'icon';

    if (device.features) {
      if (device.features.major_version === 2) {
        deviceIcon.classList.add('model-t');
      }
    }

    var deviceName = document.createElement('span');
    deviceName.className = 'device-name';
    deviceName.textContent = device.label;
    var wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    wrapper.appendChild(deviceIcon);
    wrapper.appendChild(deviceName);
    deviceButton.appendChild(wrapper); // device {
    //     status: 'available' | 'occupied' | 'used';
    //     type: 'acquired' | 'unacquired' | 'unreadable';
    // }
    // if (device.status !== 'available') {

    if (device.type !== 'acquired' || device.status === 'occupied') {
      deviceButton.classList.add('device-explain');
      var explanation = document.createElement('div');
      explanation.className = 'explain';
      var htmlUnreadable = 'Please install <a href="https://suite.trezor.io/web/bridge/" target="_blank" rel="noreferrer noopener" onclick="window.closeWindow();">Bridge</a> to use Trezor device.';
      var htmlUnacquired = 'Click to activate. This device is used by another application.';

      if (device.type === 'unreadable') {
        deviceButton.disabled = true;
        deviceIcon.classList.add('unknown');
        deviceName.textContent = 'Unrecognized device';
        explanation.innerHTML = htmlUnreadable;
      }

      if (device.type === 'unacquired' || device.status === 'occupied') {
        deviceName.textContent = 'Inactive device';
        deviceButton.classList.add('unacquired');
        explanation.classList.add('unacquired');
        explanation.innerHTML = htmlUnacquired;

        if (device.type === 'acquired') {
          deviceName.textContent = device.label;
        }
      }

      deviceButton.appendChild(explanation);
    }

    deviceList.appendChild(deviceButton);
  });
};

exports.selectDevice = selectDevice;