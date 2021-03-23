"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

function _default() {
  return {
    name: 'cssModulesWithAffix',
    validate: function validate(val) {
      (0, _assert["default"])(typeof val === 'boolean', "The cssModulesWithAffix config must be Boolean, but got ".concat(val));
    }
  };
}
//# sourceMappingURL=cssModulesWithAffix.js.map