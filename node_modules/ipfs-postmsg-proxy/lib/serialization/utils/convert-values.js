'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertValues;
// Convert object or array values
function convertValues(obj, detect, convert) {
  if (!isObjectOrArray(obj)) return obj;

  if (Array.isArray(obj)) {
    return obj.map(function (value, i) {
      return detect(value) ? convert(value) : convertValues(value, detect, convert);
    });
  }

  return Object.keys(obj).reduce(function (clone, key) {
    clone[key] = detect(obj[key]) ? convert(obj[key]) : convertValues(obj[key], detect, convert);
    return clone;
  }, {});
}

function isObjectOrArray(obj) {
  var type = Object.prototype.toString.call(obj);
  return type === '[object Object]' || type === '[object Array]';
}
//# sourceMappingURL=convert-values.js.map