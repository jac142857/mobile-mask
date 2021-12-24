"use strict"; // This is a simple class that represents information about messages,
// as they are loaded from the protobuf definition,
// so they are understood by both sending and recieving code.

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Messages = void 0;

var ProtoBuf = _interopRequireWildcard(require("protobufjs-old-fixed-webpack"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Messages = function Messages(messages) {
  _classCallCheck(this, Messages);

  this.messagesByName = messages;
  var messagesByType = {};
  Object.keys(messages.MessageType).forEach(function (longName) {
    var typeId = messages.MessageType[longName];
    var shortName = longName.split("_")[1]; // hack hack hack. total lib refactor needed.

    var indexOfDeprecated = longName.indexOf("Deprecated");

    if (indexOfDeprecated >= 0) {
      shortName = longName.substr(indexOfDeprecated);
    }

    messagesByType[typeId] = {
      name: shortName,
      constructor: messages[shortName]
    };
  });
  this.messagesByType = messagesByType;
  this.messageTypes = messages.MessageType;
};

exports.Messages = Messages;