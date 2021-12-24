'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getIpfs, opts) {
  return Object.assign((0, _add2.default)(getIpfs, opts), (0, _cat2.default)(getIpfs, opts), (0, _cp2.default)(getIpfs, opts), (0, _flush2.default)(getIpfs, opts), (0, _get2.default)(getIpfs, opts), (0, _ls2.default)(getIpfs, opts), (0, _mkdir2.default)(getIpfs, opts), (0, _mv2.default)(getIpfs, opts), (0, _read2.default)(getIpfs, opts), (0, _rm2.default)(getIpfs, opts), (0, _stat2.default)(getIpfs, opts), (0, _write2.default)(getIpfs, opts));
};

var _add = require('./add');

var _add2 = _interopRequireDefault(_add);

var _cat = require('./cat');

var _cat2 = _interopRequireDefault(_cat);

var _cp = require('./cp');

var _cp2 = _interopRequireDefault(_cp);

var _flush = require('./flush');

var _flush2 = _interopRequireDefault(_flush);

var _get = require('./get');

var _get2 = _interopRequireDefault(_get);

var _ls = require('./ls');

var _ls2 = _interopRequireDefault(_ls);

var _mkdir = require('./mkdir');

var _mkdir2 = _interopRequireDefault(_mkdir);

var _mv = require('./mv');

var _mv2 = _interopRequireDefault(_mv);

var _read = require('./read');

var _read2 = _interopRequireDefault(_read);

var _rm = require('./rm');

var _rm2 = _interopRequireDefault(_rm);

var _stat = require('./stat');

var _stat2 = _interopRequireDefault(_stat);

var _write = require('./write');

var _write2 = _interopRequireDefault(_write);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map