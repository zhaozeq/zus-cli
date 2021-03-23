"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

var _lodash = require("lodash");

function _default() {
  return {
    name: 'lessLoaderOptions',
    validate: function validate(val) {
      (0, _assert["default"])((0, _lodash.isPlainObject)(val), "The lessLoaderOptions config must be Plain Object, but got ".concat(val));
    }
  };
}