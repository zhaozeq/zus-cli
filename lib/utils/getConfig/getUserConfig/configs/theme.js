"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

var _lodash = require("lodash");

var _fs = require("fs");

var _path = require("path");

function _default() {
  return {
    name: 'theme',
    validate: function validate(val) {
      (0, _assert["default"])((0, _lodash.isPlainObject)(val) || typeof val === 'string', "The theme config must be Plain Object or String, but got ".concat(val));
      var cwd = this.cwd;

      if (typeof val === 'string') {
        var themeFile = (0, _path.isAbsolute)(val) ? val : (0, _path.join)(cwd, val);
        (0, _assert["default"])((0, _fs.existsSync)(themeFile), "File ".concat(val, " of configure item theme not found."));
      }
    }
  };
}