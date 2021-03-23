"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = runDev;

var _path = require("path");

var _chalk = _interopRequireDefault(require("chalk"));

var _dev = _interopRequireDefault(require("./utils/webpack/dev"));

var _getUserConfig = _interopRequireWildcard(require("./utils/getConfig/getUserConfig"));

var _getWebpackConfig = _interopRequireDefault(require("./utils/getWebpackConfig"));

var _getPaths = _interopRequireDefault(require("./utils/common/getPaths"));

var _registerBabel = _interopRequireDefault(require("./utils/babel/registerBabel"));

// import assert from 'assert'
// 用于上报webpack各阶段的耗时信息。
// import BuildStatistics from 'build-statistics-webpack-plugin'
// import BigBrother from 'bigbrother-webpack-plugin'
var debug = require('debug')('zus:dev');

function runDev() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opts$cwd = opts.cwd,
      cwd = _opts$cwd === void 0 ? process.cwd() : _opts$cwd,
      entry = opts.entry;
  var babel = (0, _path.resolve)(__dirname, './utils/babel/babel.js');
  var paths = (0, _getPaths["default"])(cwd); // register babel for config files

  (0, _registerBabel["default"])(babel, {
    cwd: cwd
  }); // get user config

  var config = null;
  var returnedWatchConfig = null;

  try {
    var configObj = (0, _getUserConfig["default"])({
      cwd: cwd
    }); // eslint-disable-next-line prefer-destructuring

    config = configObj.config;
    returnedWatchConfig = configObj.watch;
    debug("user config: ".concat(JSON.stringify(config)));
  } catch (e) {
    console.error(_chalk["default"].red(e.message));
    debug('Get .webpackrc config failed, watch config and reload'); // 监听配置项变更，然后重新执行 dev 逻辑

    (0, _getUserConfig.watchConfigs)().on('all', function (event, path) {
      debug("[".concat(event, "] ").concat(path, ", unwatch and reload"));
      (0, _getUserConfig.unwatchConfigs)();
      runDev(opts);
    });
    return;
  } // get webpack config


  var webpackConfig = (0, _getWebpackConfig["default"])({
    cwd: cwd,
    config: config,
    babel: babel,
    paths: paths,
    entry: entry
  }); // const stagesPath = join(
  //   __dirname,
  //   '../.run/build-statistics/compilation.json'
  // )
  // const zusPkg from join(__dirname, '../package.json'))
  // webpackConfig.plugins.push(
  //   new BuildStatistics({
  //     path: stagesPath
  //   }),
  //   new BigBrother({
  //     cwd,
  //     tool: {
  //       name: 'zus',
  //       version: zusPkg.version,
  //       stagesPath
  //     }
  //   })
  // )

  (0, _dev["default"])({
    webpackConfig: webpackConfig,
    proxy: config.proxy || {},
    beforeServer: function beforeServer(devServer) {
      try {
        if (process.env.MOCK === 'on') {
          // eslint-disable-next-line global-require
          require('./utils/mock').applyMock(devServer);
        }
      } catch (e) {
        console.log(e);
      }
    },
    afterServer: function afterServer(devServer) {
      returnedWatchConfig(devServer);
    },
    openBrowser: true,
    onCompileDone: function onCompileDone() {// console.log(webpackConfig, 'webpackConfig');
    }
  });
}