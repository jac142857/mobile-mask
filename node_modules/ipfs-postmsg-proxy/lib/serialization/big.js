'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBigJson = exports.isBig = exports.bigToJson = exports.bigFromJson = undefined;

var _big = require('big.js');

var _big2 = _interopRequireDefault(_big);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bigFromJson = exports.bigFromJson = function bigFromJson(obj) {
  return (0, _big2.default)(obj.value);
};

var bigToJson = exports.bigToJson = function bigToJson(big) {
  return {
    __ipfsPostMsgProxyType: 'Big',
    value: big.toJSON()
  };
};

var isBig = exports.isBig = function isBig(obj) {
  return obj && obj.constructor && obj.constructor.DP != null;
};
var isBigJson = exports.isBigJson = function isBigJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'Big';
};
//# sourceMappingURL=big.js.map