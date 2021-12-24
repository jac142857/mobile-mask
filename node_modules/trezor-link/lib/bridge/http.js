'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFetch = setFetch;
exports.request = request;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// slight hack to make Flow happy, but to allow Node to set its own fetch
// Request, RequestOptions and Response are built-in types of Flow for fetch API
var _fetch = typeof window === "undefined" ? function () {
  return Promise.reject();
} : window.fetch;

var _isNode = false;

function setFetch(fetch, isNode) {
  _fetch = fetch;
  _isNode = !!isNode;
}

function contentType(body) {
  if (typeof body === "string") {
    if (body === "") {
      return "text/plain";
    }

    return "application/octet-stream";
  } else {
    return "application/json";
  }
}

function wrapBody(body) {
  if (typeof body === "string") {
    return body;
  } else {
    return JSON.stringify(body);
  }
}

function parseResult(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

function request(_x) {
  return _request.apply(this, arguments);
}

function _request() {
  _request = _asyncToGenerator( /*#__PURE__*/_regenerator["default"].mark(function _callee(options) {
    var fetchOptions, res, resText, resJson;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fetchOptions = {
              method: options.method,
              body: wrapBody(options.body),
              credentials: "same-origin",
              headers: {}
            }; // this is just for flowtype

            if (options.skipContentTypeHeader == null || options.skipContentTypeHeader === false) {
              fetchOptions.headers = _objectSpread(_objectSpread({}, fetchOptions.headers), {}, {
                'Content-Type': contentType(options.body == null ? "" : options.body)
              });
            } // Node applications must spoof origin for bridge CORS


            if (_isNode) {
              fetchOptions.headers = _objectSpread(_objectSpread({}, fetchOptions.headers), {}, {
                'Origin': "https://node.trezor.io"
              });
            }

            _context.next = 5;
            return _fetch(options.url, fetchOptions);

          case 5:
            res = _context.sent;
            _context.next = 8;
            return res.text();

          case 8:
            resText = _context.sent;

            if (!res.ok) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return", parseResult(resText));

          case 13:
            resJson = parseResult(resText);

            if (!(_typeof(resJson) === "object" && resJson != null && resJson.error != null)) {
              _context.next = 18;
              break;
            }

            throw new Error(resJson.error);

          case 18:
            throw new Error(resText);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _request.apply(this, arguments);
}