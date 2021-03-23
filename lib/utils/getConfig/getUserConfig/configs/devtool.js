"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

function _default() {
  return {
    name: 'devtool',
    validate: function validate(val) {
      (0, _assert["default"])(typeof val === 'string', "The devtool config must be String, but got ".concat(val));
    }
  };
}
//# sourceMappingURL=devtool.js.map