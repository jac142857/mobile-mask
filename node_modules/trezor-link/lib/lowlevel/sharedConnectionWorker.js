"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postModuleMessage = postModuleMessage;

var _defered = require("../defered");

// To ensure that two website don't read from/to Trezor at the same time, I need a sharedworker
// to synchronize them.
// However, sharedWorker cannot directly use webusb API... so I need to send messages
// about intent to acquire/release and then send another message when that is done.
// Other windows then can acquire/release
// eslint-disable-next-line no-undef
// $FlowIssue
if (typeof onconnect !== "undefined") {
  // eslint-disable-next-line no-undef
  onconnect = function onconnect(e) {
    var port = e.ports[0];

    port.onmessage = function (e) {
      handleMessage(e.data, port);
    };
  };
}

// path => session
var normalSessions = {};
var debugSessions = {};
var lock = null;
var waitPromise = Promise.resolve();

function startLock() {
  var newLock = (0, _defered.create)();
  lock = newLock;
  setTimeout(function () {
    return newLock.reject(new Error("Timed out"));
  }, 10 * 1000);
}

function releaseLock(obj) {
  if (lock == null) {
    // TODO: ???
    return;
  }

  lock.resolve(obj);
}

function waitForLock() {
  if (lock == null) {
    // TODO: ???
    return Promise.reject(new Error("???"));
  }

  return lock.promise;
}

function waitInQueue(fn) {
  var res = waitPromise.then(function () {
    return fn();
  });
  waitPromise = res["catch"](function () {});
}

function handleMessage(_ref, port) {
  var id = _ref.id,
      message = _ref.message;

  if (message.type === "acquire-intent") {
    var _path = message.path;
    var previous = message.previous;
    var debug = message.debug;
    waitInQueue(function () {
      return handleAcquireIntent(_path, previous, debug, id, port);
    });
  }

  if (message.type === "acquire-done") {
    handleAcquireDone(id); // port is the same as original
  }

  if (message.type === "acquire-failed") {
    handleAcquireFailed(id); // port is the same as original
  }

  if (message.type === "get-sessions") {
    waitInQueue(function () {
      return handleGetSessions(id, port);
    });
  }

  if (message.type === "get-sessions-and-disconnect") {
    var devices = message.devices;
    waitInQueue(function () {
      return handleGetSessions(id, port, devices);
    });
  }

  if (message.type === "release-onclose") {
    var session = message.session;
    waitInQueue(function () {
      return handleReleaseOnClose(session);
    });
  }

  if (message.type === "release-intent") {
    var _session = message.session;
    var _debug = message.debug;
    waitInQueue(function () {
      return handleReleaseIntent(_session, _debug, id, port);
    });
  }

  if (message.type === "release-done") {
    handleReleaseDone(id); // port is the same as original
  }

  if (message.type === "enumerate-intent") {
    waitInQueue(function () {
      return handleEnumerateIntent(id, port);
    });
  }

  if (message.type === "enumerate-done") {
    handleReleaseDone(id); // port is the same as original
  }
}

function handleEnumerateIntent(id, port) {
  startLock();
  sendBack({
    type: "ok"
  }, id, port); // if lock times out, promise rejects and queue goes on

  return waitForLock().then(function (obj) {
    sendBack({
      type: "ok"
    }, obj.id, port);
  });
}

function handleReleaseDone(id) {
  releaseLock({
    id: id
  });
}

function handleReleaseOnClose(session) {
  var path_ = null;
  Object.keys(normalSessions).forEach(function (kpath) {
    if (normalSessions[kpath] === session) {
      path_ = kpath;
    }
  });

  if (path_ == null) {
    return Promise.resolve();
  }

  var path = path_;
  delete normalSessions[path];
  delete debugSessions[path];
  return Promise.resolve();
}

function handleReleaseIntent(session, debug, id, port) {
  var path_ = null;
  var sessions = debug ? debugSessions : normalSessions;
  var otherSessions = !debug ? debugSessions : normalSessions;
  Object.keys(sessions).forEach(function (kpath) {
    if (sessions[kpath] === session) {
      path_ = kpath;
    }
  });

  if (path_ == null) {
    sendBack({
      type: "double-release"
    }, id, port);
    return Promise.resolve();
  }

  var path = path_;
  var otherSession = otherSessions[path];
  startLock();
  sendBack({
    type: "path",
    path: path,
    otherSession: otherSession
  }, id, port); // if lock times out, promise rejects and queue goes on

  return waitForLock().then(function (obj) {
    // failure => nothing happens, but still has to reply "ok"
    delete sessions[path];
    sendBack({
      type: "ok"
    }, obj.id, port);
  });
}

function handleGetSessions(id, port, devices) {
  if (devices != null) {
    var connected = {};
    devices.forEach(function (d) {
      connected[d.path] = true;
    });
    Object.keys(normalSessions).forEach(function (path) {
      if (!normalSessions[path]) {
        delete normalSessions[path];
      }
    });
    Object.keys(debugSessions).forEach(function (path) {
      if (!debugSessions[path]) {
        delete debugSessions[path];
      }
    });
  }

  sendBack({
    type: "sessions",
    debugSessions: debugSessions,
    normalSessions: normalSessions
  }, id, port);
  return Promise.resolve();
}

var lastSession = 0;

function handleAcquireDone(id) {
  releaseLock({
    good: true,
    id: id
  });
}

function handleAcquireFailed(id) {
  releaseLock({
    good: false,
    id: id
  });
}

function handleAcquireIntent(path, previous, debug, id, port) {
  var error = false;
  var thisTable = debug ? debugSessions : normalSessions;
  var otherTable = !debug ? debugSessions : normalSessions;
  var realPrevious = thisTable[path];

  if (realPrevious == null) {
    error = previous != null;
  } else {
    error = previous !== realPrevious;
  }

  if (error) {
    sendBack({
      type: "wrong-previous-session"
    }, id, port);
    return Promise.resolve();
  } else {
    startLock();
    sendBack({
      type: "other-session",
      otherSession: otherTable[path]
    }, id, port); // if lock times out, promise rejects and queue goes on

    return waitForLock().then(function (obj) {
      if (obj.good) {
        lastSession++;
        var session = lastSession.toString();

        if (debug) {
          session = "debug" + session;
        }

        thisTable[path] = session;
        sendBack({
          type: "session-number",
          number: session
        }, obj.id, port);
      } else {
        // failure => nothing happens, but still has to reply "ok"
        sendBack({
          type: "ok"
        }, obj.id, port);
      }
    });
  }
}

function sendBack(message, id, port) {
  port.postMessage({
    id: id,
    message: message
  });
} // when shared worker is not loaded as a shared loader, use it as a module instead


function postModuleMessage(_ref2, fn) {
  var id = _ref2.id,
      message = _ref2.message;
  handleMessage({
    id: id,
    message: message
  }, {
    postMessage: fn
  });
}