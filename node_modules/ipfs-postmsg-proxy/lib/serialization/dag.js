'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preDagLinkToJson = exports.preDagLinkFromJson = exports.isDagLinkJson = exports.isDagLink = exports.dagLinkToJson = exports.dagLinkFromJson = exports.preDagNodeToJson = exports.preDagNodeFromJson = exports.isDagNodeJson = exports.isDagNode = exports.dagNodeToJson = exports.dagNodeFromJson = undefined;

var _ipldDagPb = require('ipld-dag-pb');

var _buffer = require('./buffer');

var dagNodeFromJson = exports.dagNodeFromJson = function dagNodeFromJson(obj) {
  return new Promise(function (resolve, reject) {
    var links = obj.links.map(dagLinkFromJson);
    _ipldDagPb.DAGNode.create((0, _buffer.bufferFromJson)(obj.data), links, function (err, dagNode) {
      if (err) return reject(err);
      resolve(dagNode);
    });
  });
};

var dagNodeToJson = exports.dagNodeToJson = function dagNodeToJson(dagNode) {
  return {
    __ipfsPostMsgProxyType: 'DAGNode',
    links: dagNode.links.map(dagLinkToJson),
    data: (0, _buffer.bufferToJson)(dagNode.data)
  };
};

var isDagNode = exports.isDagNode = function isDagNode(obj) {
  return _ipldDagPb.DAGNode.isDAGNode(obj);
};
var isDagNodeJson = exports.isDagNodeJson = function isDagNodeJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'DAGNode';
};

var preDagNodeFromJson = exports.preDagNodeFromJson = function preDagNodeFromJson(index) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isDagNodeJson(args[index])) {
      return dagNodeFromJson(args[index]).then(function (dagNode) {
        args[index] = dagNode;
        return args;
      });
    }
    return args;
  };
};

var preDagNodeToJson = exports.preDagNodeToJson = function preDagNodeToJson(index) {
  return function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (isDagNode(args[index])) {
      args[index] = dagNodeToJson(args[index]);
    }
    return args;
  };
};

var dagLinkFromJson = exports.dagLinkFromJson = function dagLinkFromJson(obj) {
  return new _ipldDagPb.DAGLink(obj.name, obj.size, obj.multihash);
};

var dagLinkToJson = exports.dagLinkToJson = function dagLinkToJson(link) {
  return Object.assign({ __ipfsPostMsgProxyType: 'DAGLink' }, link.toJSON());
};

var isDagLink = exports.isDagLink = function isDagLink(obj) {
  return _ipldDagPb.DAGLink.isDAGLink(obj);
};
var isDagLinkJson = exports.isDagLinkJson = function isDagLinkJson(obj) {
  return obj && obj.__ipfsPostMsgProxyType === 'DAGLink';
};

var preDagLinkFromJson = exports.preDagLinkFromJson = function preDagLinkFromJson(index) {
  return function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    if (isDagLinkJson(args[index])) {
      args[index] = dagLinkFromJson(args[index]);
    }
    return args;
  };
};

var preDagLinkToJson = exports.preDagLinkToJson = function preDagLinkToJson(index) {
  return function () {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    if (isDagLink(args[index])) {
      args[index] = dagLinkToJson(args[index]);
    }
    return args;
  };
};
//# sourceMappingURL=dag.js.map