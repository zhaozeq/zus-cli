"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = choosePort;

var _detectPort = _interopRequireDefault(require("detect-port"));

var _getProcessForPort = _interopRequireDefault(require("react-dev-utils/getProcessForPort"));

var _chalk = _interopRequireDefault(require("chalk"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _isRoot = _interopRequireDefault(require("is-root"));

var _clearConsole = _interopRequireDefault(require("../common/clearConsole"));

// 检查进程是否以提升的权限运行
var isInteractive = process.stdout.isTTY; // 判断Node.js是否运行在TTY上下文

function choosePort(defaultPort) {
  if (process.env.DETECT_PORT === 'none') {
    return Promise.resolve(defaultPort);
  }

  return (0, _detectPort["default"])(defaultPort).then(function (port) {
    return new Promise(function (resolve) {
      if (port === defaultPort) {
        return resolve(port);
      }

      var message = process.platform !== 'win32' && defaultPort < 1024 && !(0, _isRoot["default"])() ? "Admin permissions are required to run a server on a port below 1024." : "Something is already running on port ".concat(defaultPort, ".");

      if (isInteractive) {
        (0, _clearConsole["default"])();
        var existingProcess = (0, _getProcessForPort["default"])(defaultPort); // 是否存在进程占用端口

        var question = {
          type: 'confirm',
          name: 'shouldChangePort',
          message: "".concat(_chalk["default"].yellow("message".concat(existingProcess // eslint-disable-line
          ? " Probably:\n  ".concat(existingProcess) : '')), "\n\nWould you like to run the app on another port instead?"),
          "default": true
        };

        _inquirer["default"].prompt(question).then(function (answer) {
          if (answer.shouldChangePort) {
            resolve(port);
          } else {
            resolve(null);
          }
        });
      } else {
        console.log(_chalk["default"].red(message));
        resolve(null);
      }
    });
  }, function (err) {
    throw new Error(_chalk["default"].red("Could not find an open port.\nNetwork error message: ".concat(err.message || err, "\n")));
  });
}
//# sourceMappingURL=choosePort.js.map