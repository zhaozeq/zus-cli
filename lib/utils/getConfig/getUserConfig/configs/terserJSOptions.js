"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

var _isPlainObject = _interopRequireDefault(require("is-plain-object"));

function _default() {
  return {
    name: 'terserJSOptions',
    validate: function validate(val) {
      (0, _assert["default"])((0, _isPlainObject["default"])(val) || typeof val === 'function', "The terserJSOptions config must be Plain Object or function, but got ".concat(val));
    }
  };
}