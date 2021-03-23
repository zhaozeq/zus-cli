"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _assert = _interopRequireDefault(require("assert"));

function _default() {
  return {
    name: 'minimizer',
    validate: function validate(val) {
      (0, _assert["default"])(val === 'terserjs' || val === 'uglifyjs', "minimizer should be terserjs or uglifyjs, but got ".concat(val));
    }
  };
}
//# sourceMappingURL=minimizer.js.map