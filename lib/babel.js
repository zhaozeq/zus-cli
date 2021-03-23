"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _fs = require("fs");

var _stripJsonComments = _interopRequireDefault(require("strip-json-comments"));

var _path = require("path");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _default(context) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    presets: [[getBabel(opts)]]
  };
}

function getBabelRc(_ref) {
  var cwd = _ref.cwd,
      _ref$file = _ref.file,
      file = _ref$file === void 0 ? 'babelrc' : _ref$file;
  var rcFile = (0, _path.resolve)(cwd, file);
  var config = {
    presets: [],
    plugins: []
  };

  if ((0, _fs.existsSync)(rcFile)) {
    config = JSON.parse((0, _stripJsonComments["default"])((0, _fs.readFileSync)(rcFile, 'utf-8')));
  }

  if (!(config.presets instanceof Array)) {
    config.presets = [];
  }

  if (!(config.plugins instanceof Array)) {
    config.plugins = [];
  }

  return config;
}
/**
 * babel plugins
 *
 * @export
 * @param {*} context
 * @param {*} [opts={}]
 * @returns
 */


function getBabel() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  // console.log(context, 'context')
  var nodeEnv = process.env.NODE_ENV;
  var _opts$useBuiltIns = opts.useBuiltIns,
      useBuiltIns = _opts$useBuiltIns === void 0 ? false : _opts$useBuiltIns,
      _opts$loose = opts.loose,
      loose = _opts$loose === void 0 ? false : _opts$loose,
      _opts$targets = opts.targets,
      targets = _opts$targets === void 0 ? {
    browsers: ['last 2 versions']
  } : _opts$targets,
      _opts$cwd = opts.cwd,
      cwd = _opts$cwd === void 0 ? process.cwd() : _opts$cwd,
      _opts$env = opts.env,
      env = _opts$env === void 0 ? {} : _opts$env;
  var transformRuntime = 'transformRuntime' in opts ? opts.transformRuntime : {
    absoluteRuntime: process.env.ZUS_DIR
  };
  var exclude = ['transform-typeof-symbol', 'transform-unicode-regex', 'transform-sticky-regex', 'transform-new-target', 'transform-modules-umd', 'transform-modules-systemjs', 'transform-modules-amd', 'transform-literals'];
  var plugins = [require.resolve('babel-plugin-react-require'), // 不用 require react
  require.resolve('@babel/plugin-syntax-dynamic-import'), [require.resolve('@babel/plugin-proposal-object-rest-spread'), {
    loose: loose,
    useBuiltIns: useBuiltIns
  }], require.resolve('@babel/plugin-proposal-optional-catch-binding'), require.resolve('@babel/plugin-proposal-async-generator-functions'), // 下面两个的顺序的配置都不能动
  [require.resolve('@babel/plugin-proposal-decorators'), {
    legacy: true
  }], [require.resolve('@babel/plugin-proposal-class-properties'), {
    loose: true
  }], require.resolve('@babel/plugin-proposal-export-namespace-from'), require.resolve('@babel/plugin-proposal-export-default-from'), [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), {
    loose: loose
  }], [require.resolve('@babel/plugin-proposal-optional-chaining'), {
    loose: loose
  }], [require.resolve('@babel/plugin-proposal-pipeline-operator'), {
    proposal: 'minimal'
  }], require.resolve('@babel/plugin-proposal-do-expressions'), require.resolve('@babel/plugin-proposal-function-bind'), require.resolve('babel-plugin-macros')];

  if (nodeEnv !== 'test' && transformRuntime) {
    plugins.push([require.resolve('@babel/plugin-transform-runtime'), transformRuntime]);
  }

  if (nodeEnv === 'production') {
    plugins.push(require.resolve('babel-plugin-transform-react-remove-prop-types'));
  }

  var userConfig = getBabelRc({
    cwd: cwd,
    file: '.babelrc'
  });
  return {
    presets: [[require.resolve('@babel/preset-env'), _objectSpread({
      targets: targets,
      loose: loose,
      modules: 'commonjs',
      exclude: exclude
    }, env)], require.resolve('@babel/preset-react')].concat((0, _toConsumableArray2["default"])(userConfig.presets)),
    plugins: [].concat(plugins, (0, _toConsumableArray2["default"])(userConfig.plugins))
  };
}
//# sourceMappingURL=babel.js.map