"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var FilterCSSConflictingWarning = /*#__PURE__*/function () {
  function FilterCSSConflictingWarning() {
    (0, _classCallCheck2["default"])(this, FilterCSSConflictingWarning);
  }

  (0, _createClass2["default"])(FilterCSSConflictingWarning, [{
    key: "apply",
    value: function apply(compiler) {
      compiler.hooks.afterEmit.tap('FilterWarning', function (compilation) {
        compilation.warnings = (compilation.warnings || []).filter(function (warning) {
          return !warning.message.includes('Conflicting order between:');
        });
      });
    }
  }]);
  return FilterCSSConflictingWarning;
}();

var _default = FilterCSSConflictingWarning;
exports["default"] = _default;