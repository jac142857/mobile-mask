"use strict";

exports.__esModule = true;
exports.clone = clone;
exports.entries = entries;
exports.deepClone = deepClone;
exports.snapshot = snapshot;
exports.objectValues = objectValues;

function clone(obj) {
  var jsonString = JSON.stringify(obj);

  if (jsonString === undefined) {
    // jsonString === undefined IF and only IF obj === undefined
    // therefore no need to clone
    return obj;
  }

  return JSON.parse(jsonString);
}

function entries(obj) {
  var keys = Object.keys(obj);
  return keys.map(function (key) {
    return [key, obj[key]];
  });
}

function deepClone(obj, hash) {// if (Object(obj) !== obj) return obj; // primitives
  // if (hash.has(obj)) return hash.get(obj); // cyclic reference
  // const result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : Object.create(null);
  // hash.set(obj, result);
  // if (obj instanceof Map) { Array.from(obj, ([key, val]) => result.set(key, deepClone(val, hash))); }
  // return Object.assign(result, ...Object.keys(obj).map(
  //     key => ({ [key]: deepClone(obj[key], hash) })));

  if (hash === void 0) {
    hash = new WeakMap();
  }
}

function snapshot(obj) {
  if (obj == null || typeof obj !== 'object') {
    return obj;
  }

  var temp = new obj.constructor();

  for (var _key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, _key)) {
      temp[_key] = snapshot(obj[_key]);
    }
  }

  return temp;
}

function objectValues(object) {
  return Object.keys(object).map(function (key) {
    return object[key];
  });
}