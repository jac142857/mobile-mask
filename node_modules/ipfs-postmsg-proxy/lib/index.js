'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _server = require('./server');

Object.defineProperty(exports, 'createProxyServer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_server).default;
  }
});
Object.defineProperty(exports, 'closeProxyServer', {
  enumerable: true,
  get: function get() {
    return _server.closeProxyServer;
  }
});

var _client = require('./client');

Object.defineProperty(exports, 'createProxyClient', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_client).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map