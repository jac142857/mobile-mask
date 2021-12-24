"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preArrayOf = preArrayOf;
exports.postArrayOf = postArrayOf;
function preArrayOf(index, detect, convert) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (Array.isArray(args[index])) {
      args[index] = args[index].map(function (item) {
        return detect(item) ? convert(item) : item;
      });
    }

    return args;
  };
}

// specify falsey prop for root
function postArrayOf(prop, detect, convert) {
  return function (res) {
    if (prop && res && Array.isArray(res[prop])) {
      res[prop] = res[prop].map(function (item) {
        return detect(item) ? convert(item) : item;
      });
    } else if (!prop && Array.isArray(res)) {
      res = res.map(function (item) {
        return detect(item) ? convert(item) : item;
      });
    }

    return res;
  };
}
//# sourceMappingURL=prepost-array-of.js.map