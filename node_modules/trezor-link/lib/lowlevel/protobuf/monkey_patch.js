"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = patch;

var ProtoBuf = _interopRequireWildcard(require("protobufjs-old-fixed-webpack"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ByteBuffer = ProtoBuf.ByteBuffer;
var patched = false; // monkey-patching ProtoBuf,
// so that bytes are loaded and decoded from hexadecimal
// when we expect bytes and we get string

function patch() {
  if (!patched) {
    ProtoBuf.Reflect.Message.Field.prototype.verifyValueOriginal = ProtoBuf.Reflect.Message.Field.prototype.verifyValue; // note: don't rewrite this function to arrow (value, skipRepeated) => ....
    // since I need `this` from the original context

    ProtoBuf.Reflect.Message.Field.prototype.verifyValue = function (value, skipRepeated) {
      var newValue = value;

      if (this.type === ProtoBuf.TYPES["bytes"]) {
        if (value != null) {
          if (typeof value === "string") {
            newValue = ByteBuffer.wrap(value, "hex");
          }
        }
      }

      return this.verifyValueOriginal(newValue, skipRepeated);
    };
  }

  patched = true;
}