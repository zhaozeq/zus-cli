"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = require("fs");

var _inquirer = _interopRequireDefault(require("inquirer"));

var _which = _interopRequireDefault(require("which"));

var _getUser = _interopRequireDefault(require("./getUser"));

var _writeToPkg = _interopRequireDefault(require("./writeToPkg"));

var _interaction = require("../../doc/interaction");

var cwdPath = process.cwd(); //需要获得命令执行的位置

var changeDefault = function changeDefault(name, author) {
  if (Object.prototype.toString.call(_interaction.PACKAGE_LIST) === '[object Array]') {
    _interaction.PACKAGE_LIST.forEach(function (item) {
      if (item.name === 'name') {
        item["default"] = name;
      } else if (item.name === 'author') {
        item["default"] = author;
      }
    });
  }
};

function findNpm() {
  var npms = process.platform === 'win32' ? ['tnpm.cmd', 'cnpm.cmd', 'npm.cmd'] : ['tnpm', 'cnpm', 'npm'];

  for (var i = 0; i < npms.length; i += 1) {
    _which["default"].sync(npms[i], {
      nothrow: true
    });

    return npms[i];
  }

  return false;
}

module.exports = /*#__PURE__*/function () {
  var _cloneFinished = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(proName) {
    var targetFile, defaultName, npm, res;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            targetFile = "".concat(cwdPath, "/").concat(proName, "/package.json");

            if (!(0, _fs.existsSync)(targetFile)) {
              _context.next = 12;
              break;
            }

            defaultName = (0, _getUser["default"])();
            npm = findNpm();
            if (!npm) _interaction.PACKAGE_LIST.pop();
            changeDefault(proName, defaultName);
            _context.next = 8;
            return _inquirer["default"].prompt(_interaction.PACKAGE_LIST);

          case 8:
            res = _context.sent;
            (0, _writeToPkg["default"])(res, proName, npm);
            _context.next = 13;
            break;

          case 12:
            console.log("  ".concat(_chalk["default"].red('模板已损坏，请联系管理员解决'), "\n    "));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  function cloneFinished(_x) {
    return _cloneFinished.apply(this, arguments);
  }

  return cloneFinished;
}();