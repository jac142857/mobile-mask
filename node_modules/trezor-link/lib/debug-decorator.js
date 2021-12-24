"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugInOut = debugInOut;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function debugInOut(target, name, descriptor) {
  var original = descriptor.value;

  descriptor.value = function () {
    var debug = this.debug || name === "init" && arguments[0];
    var objName = this.name;
    var argsArr = Array.prototype.slice.call(arguments);

    if (debug) {
      var _console;

      (_console = console).log.apply(_console, ["[trezor-link] Calling ".concat(objName, ".").concat(name, "(")].concat(_toConsumableArray(argsArr.map(function (f) {
        if (typeof f === "string") {
          if (f.length > 1000) {
            return "".concat(f.substring(0, 1000), "...");
          }
        }

        return f;
      })), [")"]));
    } // assuming that the function is a promise


    var resP = original.apply(this, arguments);
    return resP.then(function (res) {
      if (debug) {
        if (res == null) {
          console.log("[trezor-link] Done ".concat(objName, ".").concat(name));
        } else {
          console.log("[trezor-link] Done ".concat(objName, ".").concat(name, ", result "), res);
        }
      }

      return res;
    }, function (err) {
      if (debug) {
        console.error("[trezor-link] Error in ".concat(objName, ".").concat(name), err);
      }

      throw err;
    });
  };

  return descriptor;
}