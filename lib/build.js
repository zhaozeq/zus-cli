"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _path = require("path");

var _build = _interopRequireDefault(require("./utils/webpack/build"));

var _getUserConfig2 = _interopRequireDefault(require("./utils/getConfig/getUserConfig"));

var _getWebpackConfig = _interopRequireDefault(require("./utils/getWebpackConfig"));

var _getPaths = _interopRequireDefault(require("./utils/common/getPaths"));

var _registerBabel = _interopRequireDefault(require("./utils/babel/registerBabel"));

// import BuildStatistics from 'build-statistics-webpack-plugin';
// import BigBrother from 'bigbrother-webpack-plugin';
var debug = require('debug')('zus:build');

function _default() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opts$cwd = opts.cwd,
      cwd = _opts$cwd === void 0 ? process.cwd() : _opts$cwd,
      entry = opts.entry;
  var babel = (0, _path.resolve)(__dirname, './utils/babel/babel.js');
  var paths = (0, _getPaths["default"])(cwd); // const stagesPath = join(__dirname, '../.run/build-statistics/compilation.json');
  // eslint-disable-next-line global-require,import/no-dynamic-require
  // const zusPkg = require(join(__dirname, '../package.json'));

  return new Promise(function (resolve) {
    // register babel for config files
    (0, _registerBabel["default"])(babel, {
      cwd: cwd
    }); // get user config

    var _getUserConfig = (0, _getUserConfig2["default"])({
      cwd: cwd
    }),
        config = _getUserConfig.config;

    debug("user config: ".concat(JSON.stringify(config))); // get webpack config

    var webpackConfig = (0, _getWebpackConfig["default"])({
      cwd: cwd,
      config: config,
      babel: babel,
      paths: paths,
      entry: entry
    }); // webpackConfig.plugins.push(
    //   new BuildStatistics({
    //     path: stagesPath,
    //   }),
    //   new BigBrother({
    //     cwd,
    //     tool: {
    //       name: 'zus',
    //       version: zusPkg.version,
    //       stagesPath,
    //     },
    //   }),
    // );

    (0, _build["default"])({
      webpackConfig: webpackConfig,
      success: function success() {
        resolve();
      },
      fail: function fail(err) {
        console.log(err);
      }
    });
  });
}
//# sourceMappingURL=build.js.map