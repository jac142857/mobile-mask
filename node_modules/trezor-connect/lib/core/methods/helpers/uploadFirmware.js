"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.uploadFirmware = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _builder = require("../../../message/builder");

var _Device = _interopRequireDefault(require("../../../device/Device"));

var UI = _interopRequireWildcard(require("../../../constants/ui"));

var DEVICE = _interopRequireWildcard(require("../../../constants/device"));

// firmware does not send button message but user still must press button to continue
// with fw update.
var postConfirmationMessage = function postConfirmationMessage(device) {
  // only if firmware is already installed. fresh device does not require button confirmation
  if (device.features.firmware_present) {
    device.emit(DEVICE.BUTTON, device, 'ButtonRequest_FirmwareUpdate');
  }
};

var postProgressMessage = function postProgressMessage(device, progress, postMessage) {
  postMessage((0, _builder.UiMessage)(UI.FIRMWARE_PROGRESS, {
    device: device.toMessageObject(),
    progress: progress
  }));
};

var uploadFirmware = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(typedCall, postMessage, device, _ref) {
    var payload, response, _yield$typedCall, _message, length, start, end, chunk;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            payload = _ref.payload;
            response = {};

            if (!(device.features.major_version === 1)) {
              _context.next = 13;
              break;
            }

            postConfirmationMessage(device);
            _context.next = 6;
            return typedCall('FirmwareErase', 'Success', {});

          case 6:
            postProgressMessage(device, 0, postMessage);
            _context.next = 9;
            return typedCall('FirmwareUpload', 'Success', {
              payload: payload
            });

          case 9:
            _yield$typedCall = _context.sent;
            _message = _yield$typedCall.message;
            postProgressMessage(device, 100, postMessage);
            return _context.abrupt("return", _message);

          case 13:
            if (!(device.features.major_version === 2)) {
              _context.next = 31;
              break;
            }

            postConfirmationMessage(device);
            length = payload.byteLength; // $FlowIssue typedCall problem with unions in response, TODO: accept unions

            _context.next = 18;
            return typedCall('FirmwareErase', 'FirmwareRequest', {
              length: length
            });

          case 18:
            response = _context.sent;

          case 19:
            if (!(response.type !== 'Success')) {
              _context.next = 29;
              break;
            }

            start = response.message.offset;
            end = response.message.offset + response.message.length;
            chunk = payload.slice(start, end); // in this moment, device is still displaying 'update firmware dialog', no firmware process is in progress yet

            if (start > 0) {
              postProgressMessage(device, Math.round(start / length * 100), postMessage);
            } // $FlowIssue typedCall problem with unions in response, TODO: accept unions


            _context.next = 26;
            return typedCall('FirmwareUpload', 'FirmwareRequest|Success', {
              payload: chunk
            });

          case 26:
            response = _context.sent;
            _context.next = 19;
            break;

          case 29:
            postProgressMessage(device, 100, postMessage); // $FlowIssue typedCall problem with unions in response, TODO: accept unions

            return _context.abrupt("return", response.message);

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function uploadFirmware(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.uploadFirmware = uploadFirmware;