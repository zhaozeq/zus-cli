"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watch = watch;
exports.unwatch = unwatch;

var _chokidar = _interopRequireDefault(require("chokidar"));

// 按 key 存，值为数组
var watchers = {};

function watch(key, files) {
  if (process.env.WATCH_FILES === 'none') return;

  if (!watchers[key]) {
    watchers[key] = [];
  }

  var watcher = _chokidar["default"].watch(files, {
    ignoreInitial: true
  });

  watchers[key].push(watcher);
  return watcher;
}

function unwatch(key) {
  if (!key) {
    return Object.keys(watchers).forEach(unwatch);
  }

  if (watchers[key]) {
    watchers[key].forEach(function (watcher) {
      watcher.close();
    });
    delete watchers[key];
  }
}
//# sourceMappingURL=watch.js.map