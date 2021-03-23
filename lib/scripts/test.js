"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _umiTest = _interopRequireDefault(require("umi-test"));

var args = process.argv.slice(2);
var watch = args.indexOf('-w') > -1 || args.indexOf('--watch') > -1;
var coverage = args.indexOf('--coverage') > -1;
(0, _umiTest["default"])({
  watch: watch,
  coverage: coverage
})["catch"](function (e) {
  console.log(e);
  process.exit(1);
});
//# sourceMappingURL=test.js.map