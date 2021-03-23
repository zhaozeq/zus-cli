"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = build;

var _webpack = _interopRequireDefault(require("webpack"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _assert = _interopRequireDefault(require("assert"));

var _lodash = require("lodash");

var _FileSizeReporter = require("react-dev-utils/FileSizeReporter");

// These sizes are pretty large. We'll warn for bundles exceeding them.
var WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
var WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function build() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var webpackConfig = opts.webpackConfig,
      _opts$cwd = opts.cwd,
      cwd = _opts$cwd === void 0 ? process.cwd() : _opts$cwd,
      onSuccess = opts.onSuccess,
      onFail = opts.onFail;
  (0, _assert["default"])(webpackConfig, 'webpackConfig should be supplied.');
  (0, _assert["default"])((0, _lodash.isPlainObject)(webpackConfig), 'webpackConfig should be plain object.'); // 清空build文件

  _rimraf["default"].sync(webpackConfig.output.path);

  (0, _webpack["default"])(webpackConfig, function (err, stats) {
    if (err || stats.hasErrors()) {
      if (typeof onFail === 'function') {
        onFail({
          err: err,
          stats: stats
        });
      }

      process.exit(1);
    }

    console.log('File sizes after gzip:\n');
    (0, _FileSizeReporter.printFileSizesAfterBuild)(stats, {
      root: webpackConfig.output.path,
      sizes: {}
    }, webpackConfig.output.path, WARN_AFTER_BUNDLE_GZIP_SIZE, WARN_AFTER_CHUNK_GZIP_SIZE);
    console.log();

    if (onSuccess) {
      onSuccess({
        stats: stats
      });
    }
  });
}