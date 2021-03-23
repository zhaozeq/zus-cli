"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _child_process = require("child_process");

var _chalk = _interopRequireDefault(require("chalk"));

var _ora = _interopRequireDefault(require("ora"));

var _solveConfigIntoFiles = _interopRequireDefault(require("./solveConfigIntoFiles"));

var _clearConsole = _interopRequireDefault(require("../../utils/common/clearConsole"));

var cwdPath = process.cwd(); //需要获得命令执行的位置

var endingText = function endingText(projectName, dest) {
  return "\nSuccess! Created ".concat(projectName, " at ").concat(dest, ".\nInside that directory, you can run several commands:\n  * npm run dev: Starts the development server.\n  * npm run build: Bundles the app into dist for production.\n  * npm run test: Run test.\nWe suggest that you begin by typing:\n  cd ").concat(projectName, "\n  npm run dev\nHappy hacking!\n");
};

module.exports = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data, name, npm) {
    var cwd, targetFile, loading;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cwd = "".concat(cwdPath, "/").concat(name);
            targetFile = "".concat(cwdPath, "/").concat(name, "/package.json");

            try {
              (0, _solveConfigIntoFiles["default"])(targetFile, data);
              (0, _clearConsole["default"])();

              if (data.autoDownload) {
                // 自动下载
                loading = (0, _ora["default"])('开始下载依赖...');
                loading.start();
                (0, _child_process.exec)("".concat(npm, " install"), {
                  cwd: cwd
                }, function (err, stdout, stderr) {
                  loading.stop();

                  if (err) {
                    console.error(err);
                    return;
                  }

                  console.log("".concat(_chalk["default"].gray(stderr)));
                  console.log("".concat(_chalk["default"].green(endingText(name, cwd))));
                });
              } else if (data.autoDownload === false) {
                console.log(_chalk["default"].gray('\n  初始化完成！程序员，开始你的表演吧！'));
                console.log(_chalk["default"].gray("  start with ".concat(npm, " install... \n")));
              } else {
                console.log(_chalk["default"].gray('\n  初始化完成！程序员，开始你的表演吧！'));
                console.log(_chalk["default"].gray('  温馨提示：您还未安装npm!\n'));
              }
            } catch (err) {
              console.log(_chalk["default"].red(' package.json 文件损坏，请重试'));
            }

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=writeToPkg.js.map