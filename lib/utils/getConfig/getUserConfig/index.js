"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getUserConfig;
exports.watchConfigs = watchConfigs;
exports.unwatchConfigs = unwatchConfigs;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _fs = require("fs");

var _path = require("path");

var _assert = _interopRequireDefault(require("assert"));

var _stripJsonComments = _interopRequireDefault(require("strip-json-comments"));

var _didyoumean = _interopRequireDefault(require("didyoumean"));

var _chalk = _interopRequireDefault(require("chalk"));

var _lodash = require("lodash");

var _clearConsole = _interopRequireDefault(require("../../common/clearConsole"));

var _watch = require("./watch");

var _getPlugins = _interopRequireDefault(require("./getPlugins"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var debug = require('debug')('af-webpack:getUserConfig');

var plugins = (0, _getPlugins["default"])();
var pluginNames = plugins.map(function (p) {
  return p.name;
});
var pluginsMapByName = plugins.reduce(function (memo, p) {
  memo[p.name] = p;
  return memo;
}, {});
var devServer = null;
var USER_CONFIGS = 'USER_CONFIGS';

function throwError(msg) {
  printError(msg);
  throw new Error(msg);
}

function printError(messages) {
  if (devServer) {
    devServer.sockWrite(devServer.sockets, 'errors', typeof messages === 'string' ? [messages] : messages);
  }
}

function reload() {
  devServer.sockWrite(devServer.sockets, 'content-changed');
}

function restart(why) {
  (0, _clearConsole["default"])();
  console.log(_chalk["default"].green("Since ".concat(why, ", try to restart the server")));
  (0, _watch.unwatch)();
  devServer.close();
  process.send({
    type: 'RESTART'
  });
}

function merge(oldObj, newObj) {
  for (var key in newObj) {
    if (Array.isArray(newObj[key]) && Array.isArray(oldObj[key])) {
      oldObj[key] = oldObj[key].concat(newObj[key]);
    } else if ((0, _lodash.isPlainObject)(newObj[key]) && (0, _lodash.isPlainObject)(oldObj[key])) {
      oldObj[key] = Object.assign(oldObj[key], newObj[key]);
    } else {
      oldObj[key] = newObj[key];
    }
  }
}

function replaceNpmVariables(value, pkg) {
  if (typeof value === 'string') {
    return value.replace('$npm_package_name', pkg.name).replace('$npm_package_version', pkg.version);
  } else {
    return value;
  }
}
/**
 * getUserConfig
 * @export
 * @param {*} [opts={cwd,configFile,disabledConfigs,preprocessor}]
 * @returns
 */


function getUserConfig() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opts$cwd = opts.cwd,
      cwd = _opts$cwd === void 0 ? process.cwd() : _opts$cwd,
      _opts$configFile = opts.configFile,
      configFile = _opts$configFile === void 0 ? '.webpackrc' : _opts$configFile,
      _opts$disabledConfigs = opts.disabledConfigs,
      disabledConfigs = _opts$disabledConfigs === void 0 ? [] : _opts$disabledConfigs,
      preprocessor = opts.preprocessor; // TODO: 支持数组的形式？
  // Read config from configFile and `${configFile}.js`

  var rcFile = (0, _path.resolve)(cwd, configFile);
  var jsRCFile = (0, _path.resolve)(cwd, "".concat(configFile, ".js"));
  (0, _assert["default"])(!((0, _fs.existsSync)(rcFile) && (0, _fs.existsSync)(jsRCFile)), "".concat(configFile, " file and ").concat(configFile, ".js file can not exist at the same time."));
  var config = {};

  if ((0, _fs.existsSync)(rcFile)) {
    config = JSON.parse((0, _stripJsonComments["default"])((0, _fs.readFileSync)(rcFile, 'utf-8')));
  }

  if ((0, _fs.existsSync)(jsRCFile)) {
    // no cache
    delete require.cache[jsRCFile];
    config = require(jsRCFile); // eslint-disable-line

    if (config["default"]) {
      config = config["default"];
    }
  }

  if (typeof preprocessor === 'function') {
    config = preprocessor(config);
  } // Context for validate function


  var context = {
    cwd: cwd
  }; // Validate

  var errorMsg = null;
  Object.keys(config).forEach(function (key) {
    // 禁用项
    if (disabledConfigs.includes(key)) {
      errorMsg = "Configuration item ".concat(key, " is disabled, please remove it.");
    } // 非法的项


    if (!pluginNames.includes(key)) {
      var guess = (0, _didyoumean["default"])(key, pluginNames);
      var affix = guess ? "do you meen ".concat(guess, " ?") : 'please remove it.';
      errorMsg = "Configuration item ".concat(key, " is not valid, ").concat(affix);
    } else {
      // run config plugin's validate
      var plugin = pluginsMapByName[key];

      if (plugin.validate) {
        try {
          plugin.validate.call(context, config[key]);
        } catch (e) {
          errorMsg = e.message;
        }
      }
    }
  }); // 确保不管校验是否出错，下次 watch 判断时能拿到正确的值

  if (errorMsg) {
    if (
    /* from watch */
    opts.setConfig) {
      opts.setConfig(config);
    }

    throwError(errorMsg);
  } // Merge config with current env


  if (config.env) {
    if (config.env[process.env.NODE_ENV]) {
      merge(config, config.env[process.env.NODE_ENV]);
    }

    delete config.env;
  } // Replace npm variables


  var pkgFile = (0, _path.resolve)(cwd, 'package.json');

  if (Object.keys(config).length && (0, _fs.existsSync)(pkgFile)) {
    var pkg = JSON.parse((0, _fs.readFileSync)(pkgFile, 'utf-8'));
    config = Object.keys(config).reduce(function (memo, key) {
      memo[key] = replaceNpmVariables(config[key], pkg);
      return memo;
    }, {});
  }

  var configFailed = false;

  function watchConfigsAndRun(_devServer) {
    var watchOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    devServer = _devServer;
    var watcher = watchConfigs(opts);

    if (watcher) {
      watcher.on('all', function () {
        try {
          if (watchOpts.beforeChange) {
            watchOpts.beforeChange();
          }

          var _getUserConfig = getUserConfig(_objectSpread(_objectSpread({}, opts), {}, {
            setConfig: function setConfig(newConfig) {
              config = newConfig;
            }
          })),
              newConfig = _getUserConfig.config; // 从失败中恢复过来，需要 reload 一次


          if (configFailed) {
            configFailed = false;
            reload();
          } // 比较，然后执行 onChange


          var _iterator = _createForOfIteratorHelper(plugins),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var plugin = _step.value;
              var name = plugin.name,
                  onChange = plugin.onChange;

              if (!(0, _lodash.isEqual)(newConfig[name], config[name])) {
                debug("Config ".concat(name, " changed, from ").concat(JSON.stringify(config[name]), " to ").concat(JSON.stringify(newConfig[name])));
                (onChange || restart.bind(null, "".concat(name, " changed"))).call(null, {
                  name: name,
                  val: config[name],
                  newVal: newConfig[name],
                  config: config,
                  newConfig: newConfig
                });
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } catch (e) {
          configFailed = true;
          console.error(_chalk["default"].red("Watch handler failed, since ".concat(e.message)));
          console.error(e);
        }
      });
    }
  }

  debug("UserConfig: ".concat(JSON.stringify(config)));
  return {
    config: config,
    watch: watchConfigsAndRun
  };
}

function watchConfigs() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opts$cwd2 = opts.cwd,
      cwd = _opts$cwd2 === void 0 ? process.cwd() : _opts$cwd2,
      _opts$configFile2 = opts.configFile,
      configFile = _opts$configFile2 === void 0 ? '.webpackrc' : _opts$configFile2;
  var rcFile = (0, _path.resolve)(cwd, configFile);
  var jsRCFile = (0, _path.resolve)(cwd, "".concat(configFile, ".js"));
  return (0, _watch.watch)(USER_CONFIGS, [rcFile, jsRCFile]);
}

function unwatchConfigs() {
  (0, _watch.unwatch)(USER_CONFIGS);
}