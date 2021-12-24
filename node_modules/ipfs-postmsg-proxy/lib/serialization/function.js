'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var functionToJson = exports.functionToJson = function functionToJson(name) {
  return {
    __ipfsPostMsgProxyType: 'Function',
    name: name
  };
};

var isFunctionJson = exports.isFunctionJson = function isFunctionJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'Function';
};
//# sourceMappingURL=function.js.map