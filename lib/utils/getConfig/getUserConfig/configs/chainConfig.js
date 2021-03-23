"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

function _default() {
  return {
    name: 'chainConfig',
    validate: function validate(val) {
      (0, _assert["default"])(typeof val === 'function', "The chainConfig config must be Function, but got ".concat(val));
    }
  };
}