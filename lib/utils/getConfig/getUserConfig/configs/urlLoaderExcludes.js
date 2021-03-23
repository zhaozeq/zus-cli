"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

function _default() {
  return {
    name: 'urlLoaderExcludes',
    validate: function validate(val) {
      (0, _assert["default"])(Array.isArray(val), "The urlLoaderExcludes config must be Array, but got ".concat(val));
    }
  };
}
//# sourceMappingURL=urlLoaderExcludes.js.map