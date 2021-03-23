"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _require = require('fs'),
    existsSync = _require.existsSync,
    readFileSync = _require.readFileSync,
    writeFileSync = _require.writeFileSync;

var handlebars = require('handlebars');
/**
 * solveFile
 * @param {*} targetFile 目标文件路径
 * @param {*} data 变量对象
 * @returns
 */


module.exports = /*#__PURE__*/function () {
  var _solveFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(targetFile, data) {
    var content, result;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!existsSync(targetFile)) {
              _context.next = 10;
              break;
            }

            _context.next = 3;
            return readFileSync(targetFile).toString();

          case 3:
            content = _context.sent;
            _context.next = 6;
            return handlebars.compile(content)(data);

          case 6:
            result = _context.sent;
            writeFileSync(targetFile, result);
            _context.next = 11;
            break;

          case 10:
            console.log("\n ".concat(targetFile, " is not found!"));

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  function solveFile(_x, _x2) {
    return _solveFile.apply(this, arguments);
  }

  return solveFile;
}();