"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _fs = require("fs");

var _path = require("path");

function _default(theme) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _opts$cwd = opts.cwd,
      cwd = _opts$cwd === void 0 ? process.cwd() : _opts$cwd;
  if (!theme) return {};

  if (typeof theme === 'string') {
    var themePath = (0, _path.isAbsolute)(theme) ? theme : (0, _path.resolve)(cwd, theme);

    if ((0, _fs.existsSync)(themePath)) {
      var themeConfig = require(themePath); // eslint-disable-line


      if (typeof themeConfig === 'function') {
        return themeConfig();
      } else {
        return themeConfig;
      }
    } else {
      throw new Error("theme file don't exists");
    }
  }

  return theme;
}