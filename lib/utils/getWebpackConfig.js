"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _getConfig = _interopRequireDefault(require("./getConfig/getConfig"));

var _getEntry = _interopRequireDefault(require("./webpack/getEntry"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaultBrowsers = ['last 2 versions'];
var isDev = process.env.NODE_ENV === 'development';

function _default() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cwd = opts.cwd,
      config = opts.config,
      babel = opts.babel,
      paths = opts.paths,
      entry = opts.entry;
  var browserslist = config.browserslist || defaultBrowsers;
  return (0, _getConfig["default"])(_objectSpread(_objectSpread({
    cwd: cwd
  }, config), {}, {
    entry: (0, _getEntry["default"])({
      cwd: paths.appDirectory,
      entry: entry || config.entry,
      isBuild: !isDev
    }),
    babel: config.babel || {
      presets: [[babel, {
        browsers: browserslist
      }]].concat((0, _toConsumableArray2["default"])(config.extraBabelPresets || [])),
      plugins: config.extraBabelPlugins || []
    },
    browserslist: browserslist
  }));
}