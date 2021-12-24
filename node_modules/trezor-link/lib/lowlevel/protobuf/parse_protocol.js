"use strict"; // Module for loading the protobuf description from serialized description

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseConfigure = parseConfigure;

var ProtoBuf = _interopRequireWildcard(require("protobufjs-old-fixed-webpack"));

var _messages = require("./messages.js");

var _to_json = require("./to_json.js");

var compiledConfigProto = _interopRequireWildcard(require("./config_proto_compiled.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Parse configure data (it has to be already verified)
function parseConfigure(data) {
  // incoming data are in JSON format
  if (data && typeof data === "object" && Object.prototype.hasOwnProperty.call(data, "messages")) {
    var _protobufMessages = ProtoBuf.newBuilder({})["import"](data).build();

    return new _messages.Messages(_protobufMessages);
  }

  if (typeof data !== "string") throw new Error("Unexpected messages format"); // incoming data are in JSON.stringify format

  if (data.match(/^\{.*\}$/)) {
    var _protobufMessages2 = ProtoBuf.newBuilder({})["import"](JSON.parse(data)).build();

    return new _messages.Messages(_protobufMessages2);
  } // incoming data are in binary format


  var buffer = Buffer.from(data.slice(64 * 2), "hex");
  var configBuilder = compiledConfigProto["Configuration"];
  var loadedConfig = configBuilder.decode(buffer);
  var validUntil = loadedConfig.valid_until;
  var timeNow = Math.floor(Date.now() / 1000);

  if (timeNow >= validUntil) {
    throw new Error("Config too old; " + timeNow + " >= " + validUntil);
  }

  var wireProtocol = loadedConfig.wire_protocol;
  var protocolJSON = (0, _to_json.protocolToJSON)(wireProtocol.toRaw());
  var protobufMessages = ProtoBuf.newBuilder({})["import"](protocolJSON).build();
  return new _messages.Messages(protobufMessages);
}