"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _terserWebpackPlugin = _interopRequireDefault(require("terser-webpack-plugin"));

var _uglifyjsWebpackPlugin = _interopRequireDefault(require("uglifyjs-webpack-plugin"));

var _lodash = require("lodash");

var _terserOptions = _interopRequireDefault(require("./terserOptions"));

var _uglifyOptions = _interopRequireDefault(require("./uglifyOptions"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function mergeConfig(config, userConfig) {
  if (typeof userConfig === 'function') {
    return userConfig(config);
  } else if ((0, _lodash.isPlainObject)(userConfig)) {
    return _objectSpread(_objectSpread({}, config), userConfig);
  } else {
    return config;
  }
}

function _default(webpackConfig, opts) {
  var disableCompress = process.env.COMPRESS === 'none';
  webpackConfig.mode('production').devtool(opts.devtool);

  if (disableCompress && !process.env.__FROM_UMI_TEST) {
    webpackConfig.output.pathinfo(true);
    webpackConfig.optimization.namedModules(true).namedChunks(true);
  }

  if (opts.hash) {
    webpackConfig.output.filename("[name].[contenthash:8].js").chunkFilename("[name].[contenthash:8].async.js");
  }

  webpackConfig.performance.hints(false);

  if (opts.manifest) {
    webpackConfig.plugin('manifest').use(require('webpack-manifest-plugin'), [_objectSpread({
      fileName: 'asset-manifest.json'
    }, opts.manifest)]);
  }

  webpackConfig.optimization // don't emit files if have error
  .noEmitOnErrors(true);

  if (disableCompress || process.env.__FROM_UMI_TEST) {
    webpackConfig.optimization.minimize(false);
  } else {
    webpackConfig.plugin('hash-module-ids').use(require('webpack/lib/HashedModuleIdsPlugin'));
    var minimizerName = 'uglifyjs';
    var minimizerPlugin = _uglifyjsWebpackPlugin["default"];
    var minimizerOptions = [mergeConfig(_objectSpread(_objectSpread({}, _uglifyOptions["default"]), {}, {
      sourceMap: !!opts.devtool
    }), opts.uglifyJSOptions)];

    if (opts.minimizer === 'terserjs') {
      minimizerName = 'terserjs';
      minimizerPlugin = _terserWebpackPlugin["default"];
      minimizerOptions = [mergeConfig(_objectSpread(_objectSpread({}, _terserOptions["default"]), {}, {
        sourceMap: !!opts.devtool
      }), opts.terserJSOptions)];
    }

    webpackConfig.optimization.minimizer(minimizerName).use(minimizerPlugin, minimizerOptions);
  }
}