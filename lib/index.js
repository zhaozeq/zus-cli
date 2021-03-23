"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _path = require("path");

var _chalk = _interopRequireDefault(require("chalk"));

var _helper = _interopRequireDefault(require("./doc/helper"));

var _init = _interopRequireDefault(require("./scripts/init"));

// 可以打印fork进程的日志
require('graceful-process')({
  logLevel: 'warn'
});

var nodeVersion = process.versions.node;
var versions = nodeVersion.split('.');
var major = versions[0];
var minor = versions[1];

if (major * 10 + minor * 1 < 90) {
  console.log("Node version must >= 9.0, but got ".concat(major, ".").concat(minor));
  process.exit(1);
}

var updater = require('update-notifier');

var pkg = require('../package.json');

var notifier = updater({
  pkg: pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7
});

if (notifier.update && notifier.update.latest !== pkg.version) {
  // 存在新版本
  var old = notifier.update.current;
  var latest = notifier.update.latest;
  var type = notifier.update.type;

  switch (type) {
    case 'major':
      type = _chalk["default"].red(type);
      break;

    case 'minor':
      type = _chalk["default"].yellow(type);
      break;

    case 'patch':
      type = _chalk["default"].green(type);
      break;

    default:
      break;
  }

  notifier.notify({
    message: "New ".concat(type, " version of ").concat(pkg.name, " available! ").concat(_chalk["default"].red(old), " -> ").concat(_chalk["default"].green(latest), "\nRun ").concat(_chalk["default"].green("npm install -g ".concat(pkg.name)), " to update!")
  });
}

process.env.ZUS_DIR = (0, _path.dirname)(require.resolve('../package'));
process.env.ZUS_VERSION = pkg.version;
var command = process.argv[2];
var args = process.argv.slice(3);
process.nextTick(function () {
  switch (command) {
    case '-v':
    case '--version':
      console.log(pkg.version);
      break;

    case 'init':
      if (args[0]) {
        (0, _init["default"])(args[0]);
      } else {
        (0, _helper["default"])();
      }

      break;

    case 'build':
    case 'server':
    case 'test':
      /* eslint-disable */
      require("./scripts/".concat(command));

      break;

    default:
      (0, _helper["default"])();
      break;
  }
});