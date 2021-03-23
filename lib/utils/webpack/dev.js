"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = dev;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = _interopRequireDefault(require("fs"));

var _openBrowser = _interopRequireDefault(require("react-dev-utils/openBrowser"));

var _webpack = _interopRequireDefault(require("webpack"));

var _assert = _interopRequireDefault(require("assert"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _chalk = _interopRequireDefault(require("chalk"));

var _prepareUrls = _interopRequireDefault(require("./prepareUrls"));

var _clearConsole = _interopRequireDefault(require("../common/clearConsole"));

var _errorOverlayMiddleware = _interopRequireDefault(require("./errorOverlayMiddleware"));

var _send = _interopRequireWildcard(require("./send"));

var _choosePort = _interopRequireDefault(require("./choosePort"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var isInteractive = process.stdout.isTTY; //nodejs否在 TTY 上下文中运行

var DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8000;
var HOST = process.env.HOST || '0.0.0.0';
var PROTOCOL = process.env.HTTPS ? 'https' : 'http';
var CERT = process.env.HTTPS && process.env.CERT ? _fs["default"].readFileSync(process.env.CERT) : '';
var KEY = process.env.HTTPS && process.env.KEY ? _fs["default"].readFileSync(process.env.KEY) : '';

var noop = function noop() {};

process.env.NODE_ENV = 'development';

function dev(_ref) {
  var webpackConfig = _ref.webpackConfig,
      _beforeServerWithApp = _ref._beforeServerWithApp,
      beforeMiddlewares = _ref.beforeMiddlewares,
      afterMiddlewares = _ref.afterMiddlewares,
      beforeServer = _ref.beforeServer,
      afterServer = _ref.afterServer,
      contentBase = _ref.contentBase,
      _ref$onCompileDone = _ref.onCompileDone,
      onCompileDone = _ref$onCompileDone === void 0 ? noop : _ref$onCompileDone,
      proxy = _ref.proxy,
      port = _ref.port,
      base = _ref.base,
      _ref$serverConfig = _ref.serverConfig,
      serverConfigFromOpts = _ref$serverConfig === void 0 ? {} : _ref$serverConfig;
  (0, _assert["default"])(webpackConfig, 'webpackConfig must be supplied');
  (0, _choosePort["default"])(port || DEFAULT_PORT).then(function (port) {
    if (port === null) {
      return;
    }

    var compiler = (0, _webpack["default"])(webpackConfig);
    var isFirstCompile = true;
    var IS_CI = !!process.env.CI;
    var SILENT = !!process.env.SILENT;
    var urls = (0, _prepareUrls["default"])(PROTOCOL, HOST, port, base);
    compiler.hooks.done.tap('zus dev', function (stats) {
      if (stats.hasErrors()) {
        if (process.env.SYSTEM_BELL !== 'none') {
          process.stdout.write('\x07'); // 蜂鸣响铃
        }

        return;
      }

      if (isFirstCompile && !IS_CI && !SILENT) {
        console.log();
        console.log(["  App running at:", "  - Local:   ".concat(_chalk["default"].cyan(urls.localUrlForTerminal)), "  - Network: ".concat(_chalk["default"].cyan(urls.lanUrlForTerminal))].join('\n'));
        console.log();
      }

      onCompileDone({
        isFirstCompile: isFirstCompile,
        stats: stats
      });

      if (isFirstCompile) {
        isFirstCompile = false;
        (0, _openBrowser["default"])(urls.localUrlForBrowser);
        (0, _send["default"])({
          'zus:server': _send.DONE
        });
      }
    });

    var serverConfig = _objectSpread(_objectSpread({
      disableHostCheck: true,
      compress: true,
      clientLogLevel: 'none',
      hot: true,
      quiet: true,
      headers: {
        'access-control-allow-origin': '*'
      },
      publicPath: webpackConfig.output.publicPath,
      watchOptions: {
        ignored: /node_modules/
      },
      historyApiFallback: true,
      overlay: false,
      host: HOST,
      proxy: proxy,
      https: !!process.env.HTTPS,
      cert: CERT,
      key: KEY,
      contentBase: contentBase || process.env.CONTENT_BASE,
      before: function before(app) {
        (beforeMiddlewares || []).forEach(function (middleware) {
          app.use(middleware);
        }); // internal usage for proxy

        if (_beforeServerWithApp) {
          _beforeServerWithApp(app);
        }

        app.use((0, _errorOverlayMiddleware["default"])());
      },
      after: function after(app) {
        (afterMiddlewares || []).forEach(function (middleware) {
          app.use(middleware);
        });
      }
    }, serverConfigFromOpts), webpackConfig.devServer || {});

    var server = new _webpackDevServer["default"](compiler, serverConfig);
    ['SIGINT', 'SIGTERM'].forEach(function (signal) {
      process.on(signal, function () {
        server.close(function () {
          process.exit(0);
        });
      });
    });

    if (beforeServer) {
      beforeServer(server);
    }

    server.listen(port, HOST, function (err) {
      if (err) {
        console.log(err);
        return;
      }

      if (isInteractive) {
        (0, _clearConsole["default"])();
      }

      (0, _send["default"])({
        'zus:server': _send.STARTING
      });

      if (afterServer) {
        afterServer(server, port);
      }
    });
  })["catch"](function (err) {
    console.log(err);
  });
}