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
    name: 'entry',
    validate: function validate(val) {
      (0, _assert["default"])((0, _lodash.isPlainObject)(val) || typeof val === 'string', "The entry config must be Plain Object or String, but got ".concat(val));
    }
  };
}
//# sourceMappingURL=entry.js.map