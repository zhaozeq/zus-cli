"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

function _default() {
  return {
    name: 'extraBabelPlugins',
    validate: function validate(val) {
      (0, _assert["default"])(Array.isArray(val), "The extraBabelPlugins config must be Array, but got ".concat(val));
    }
  };
}
//# sourceMappingURL=extraBabelPlugins.js.map