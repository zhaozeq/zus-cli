"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _chalk = _interopRequireDefault(require("chalk"));

var _build = _interopRequireDefault(require("../../build"));

process.env.NODE_ENV = 'production';
(0, _build["default"])({
  cwd: process.cwd()
})["catch"](function (e) {
  console.error(_chalk["default"].red("Build failed: ".concat(e.message)));
  console.log(e);
});