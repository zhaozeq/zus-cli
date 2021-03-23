"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _webpackChain = _interopRequireDefault(require("webpack-chain"));

var _path = require("path");

var _fs = require("fs");

var _os = require("os");

var _assert = _interopRequireDefault(require("assert"));

var _es5ImcompatibleVersions = require("./es5ImcompatibleVersions");

var _resolveDefine = _interopRequireDefault(require("./resolveDefine"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function makeArray(item) {
  if (Array.isArray(item)) return item;
  return [item];
}
/**
 * 链式生成webpack配置
 */


function _default(opts) {
  var cwd = opts.cwd;
  var isDev = process.env.NODE_ENV === 'development';
  var webpackConfig = new _webpackChain["default"](); // mode

  webpackConfig.mode('development'); // entry

  if (opts.entry) {
    var _loop = function _loop() {
      var key = _Object$keys[_i];
      var entry = webpackConfig.entry(key);
      makeArray(opts.entry[key]).forEach(function (file) {
        entry.add(file);
      });
    };

    for (var _i = 0, _Object$keys = Object.keys(opts.entry); _i < _Object$keys.length; _i++) {
      _loop();
    }
  } // output


  var absOutputPath = (0, _path.resolve)(cwd, opts.outputPath || 'dist');
  webpackConfig.output.path(absOutputPath).filename("[name].js").chunkFilename("[name].async.js").publicPath(opts.publicPath || undefined).devtoolModuleFilenameTemplate(function (info) {
    return (0, _path.relative)(opts.cwd, info.absoluteResourcePath).replace(/\\/g, '/');
  }); // resolve

  webpackConfig.resolve // 不能设为 false，因为 tnpm 是通过 link 处理依赖，设为 false tnpm 下会有大量的冗余模块
  .set('symlinks', true).modules.add('node_modules').add((0, _path.join)(__dirname, '../../../../node_modules')) // Fix yarn global resolve problem
  // .add(join(__dirname, '../../../../'))
  .end().extensions.merge(['.web.js', '.wasm', '.mjs', '.js', '.web.jsx', '.jsx', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json']);

  if (opts.alias) {
    for (var _i2 = 0, _Object$keys2 = Object.keys(opts.alias); _i2 < _Object$keys2.length; _i2++) {
      var key = _Object$keys2[_i2];
      webpackConfig.resolve.alias.set(key, opts.alias[key]);
    }
  } // resolveLoader


  webpackConfig.resolveLoader.modules.add('node_modules') // .add(join(__dirname, '../../../../node_modules'))
  .end();

  if (!opts.disableDynamicImport && !process.env.__FROM_UMI_TEST) {
    webpackConfig.optimization.splitChunks({
      chunks: 'async',
      name: 'vendors'
    }).runtimeChunk(false);
  } // module -> exclude


  var DEFAULT_INLINE_LIMIT = 10000;
  var rule = webpackConfig.module.rule('exclude').exclude.add(/\.json$/).add(/\.(js|jsx|ts|tsx|mjs|wasm)$/).add(/\.(css|less|scss|sass)$/);

  if (opts.urlLoaderExcludes) {
    opts.urlLoaderExcludes.forEach(function (exclude) {
      rule.add(exclude);
    });
  }

  rule.end().use('url-loader').loader(require.resolve('umi-url-pnp-loader')).options({
    limit: opts.inlineLimit || DEFAULT_INLINE_LIMIT,
    name: 'static/[name].[hash:8].[ext]'
  });
  var babelOptsCommon = {
    // Tell babel to guess the type, instead assuming all files are modules
    // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
    sourceType: 'unambiguous',
    cacheDirectory: process.env.BABEL_CACHE !== 'none',
    // enable by default
    babelrc: !!process.env.BABELRC,
    // disable by default
    customize: require.resolve('../../webpack/weboack-overrides.js')
  };
  var babel = opts.babel || {};

  var babelOpts = _objectSpread({
    presets: [].concat((0, _toConsumableArray2["default"])(babel.presets || []), (0, _toConsumableArray2["default"])(opts.extraBabelPresets || [])),
    plugins: [].concat((0, _toConsumableArray2["default"])(babel.plugins || []), (0, _toConsumableArray2["default"])(opts.extraBabelPlugins || []), [[require.resolve('babel-plugin-named-asset-import'), {
      loaderMap: {
        svg: {
          ReactComponent: "".concat(require.resolve('../svgr'), "?-prettier,-svgo![path]")
        }
      }
    }]])
  }, babelOptsCommon);

  if (opts.disableDynamicImport) {
    babelOpts.plugins = [].concat((0, _toConsumableArray2["default"])(babelOpts.plugins || []), [require.resolve('babel-plugin-dynamic-import-node')]);
  } // module -> eslint


  if (process.env.ESLINT && process.env.ESLINT !== 'none') {
    require('./eslint')["default"](webpackConfig, opts);
  } // Avoid "require is not defined" errors


  webpackConfig.module.rule('mjs-require').test(/\.mjs$/).type('javascript/auto').include.add(opts.cwd); // module -> mjs

  webpackConfig.module.rule('mjs').test(/\.mjs$/).include.add(opts.cwd).end().use('babel-loader').loader(require.resolve('babel-loader')).options(babelOpts); // module -> js

  webpackConfig.module.rule('js').test(/\.js$/).include.add(opts.cwd).end().exclude.add(/node_modules/).end().use('babel-loader').loader(require.resolve('babel-loader')).options(babelOpts); // module -> jsx
  // jsx 不 exclude node_modules

  webpackConfig.module.rule('jsx').test(/\.jsx$/).include.add(opts.cwd).end().use('babel-loader').loader(require.resolve('babel-loader')).options(babelOpts); // module -> extraBabelIncludes
  // suport es5ImcompatibleVersions

  var extraBabelIncludes = opts.extraBabelIncludes || [];
  extraBabelIncludes.push(function (a) {
    if (!a.includes('node_modules')) return false;
    var pkgPath = (0, _es5ImcompatibleVersions.getPkgPath)(a);
    return (0, _es5ImcompatibleVersions.shouldTransform)(pkgPath);
  });
  extraBabelIncludes.forEach(function (include, index) {
    var rule = "extraBabelInclude_".concat(index);
    webpackConfig.module.rule(rule).test(/\.jsx?$/).include.add(include).end().use('babel-loader').loader(require.resolve('babel-loader')).options(babelOpts);
  }); // module -> tsx?

  var tsConfigFile = opts.tsConfigFile || (0, _path.join)(opts.cwd, 'tsconfig.json');
  webpackConfig.module.rule('ts').test(/\.tsx?$/).use('babel-loader').loader(require.resolve('babel-loader')).options(babelOpts).end().use('ts-loader').loader(require.resolve('ts-loader')).options(_objectSpread({
    configFile: tsConfigFile,
    transpileOnly: true,
    // ref: https://github.com/TypeStrong/ts-loader/blob/fbed24b/src/utils.ts#L23
    errorFormatter: function errorFormatter(error, colors) {
      var messageColor = error.severity === 'warning' ? colors.bold.yellow : colors.bold.red;
      return colors.grey('[tsl] ') + messageColor(error.severity.toUpperCase()) + (error.file === '' ? '' : messageColor(' in ') + colors.bold.cyan("".concat((0, _path.relative)(cwd, (0, _path.join)(error.context, error.file)), "(").concat(error.line, ",").concat(error.character, ")"))) + _os.EOL + messageColor("      TS".concat(error.code, ": ").concat(error.content));
    }
  }, opts.typescript || {})); // module -> css

  require('./css')["default"](webpackConfig, opts); // plugins -> define


  webpackConfig.plugin('define').use(require('webpack/lib/DefinePlugin'), [(0, _resolveDefine["default"])(opts)]); // plugins -> progress bar

  var NO_PROGRESS = process.env.PROGRESS === 'none';

  if (!process.env.__FROM_UMI_TEST) {
    if (!process.env.CI && !NO_PROGRESS) {
      if (process.platform === 'win32') {
        webpackConfig.plugin('progress').use(require('progress-bar-webpack-plugin'));
      } else {
        webpackConfig.plugin('progress').use(require('webpackbar'), [{
          color: 'green',
          reporters: ['fancy']
        }]);
      }
    }
  } // plugins -> ignore moment locale


  if (opts.ignoreMomentLocale) {
    webpackConfig.plugin('ignore-moment-locale').use(require('webpack/lib/IgnorePlugin'), [/^\.\/locale$/, /moment$/]);
  } // plugins -> analyze


  if (process.env.ANALYZE) {
    webpackConfig.plugin('bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [{
      analyzerMode: 'server',
      analyzerPort: process.env.ANALYZE_PORT || 8888,
      openAnalyzer: true,
      // generate stats file while ANALYZE_DUMP exist
      generateStatsFile: !!process.env.ANALYZE_DUMP,
      statsFilename: process.env.ANALYZE_DUMP || 'stats.json'
    }]);
  }

  if (process.env.DUPLICATE_CHECKER) {
    webpackConfig.plugin('duplicate-package-checker').use(require('duplicate-package-checker-webpack-plugin'));
  }

  if (process.env.FORK_TS_CHECKER) {
    webpackConfig.plugin('fork-ts-checker').use(require('fork-ts-checker-webpack-plugin'), [{
      formatter: 'codeframe'
    }]);
  } // plugins -> copy


  if ((0, _fs.existsSync)((0, _path.join)(opts.cwd, 'public'))) {
    webpackConfig.plugin('copy-public').use(require('copy-webpack-plugin'), [[{
      from: (0, _path.join)(opts.cwd, 'public'),
      to: absOutputPath,
      toType: 'dir'
    }]]);
  }

  if (opts.copy) {
    makeArray(opts.copy).forEach(function (copy, index) {
      if (typeof copy === 'string') {
        copy = {
          from: (0, _path.join)(opts.cwd, copy),
          to: absOutputPath
        };
      }

      webpackConfig.plugin("copy-".concat(index)).use(require('copy-webpack-plugin'), [[copy]]);
    });
  }

  if (!process.env.__FROM_UMI_TEST) {
    // filter `Conflicting order between` warning
    webpackConfig.plugin('filter-css-conflicting-warnings').use(require('./FilterCSSConflictingWarning')["default"]); // plugins -> friendly-errors

    var _process$env$CLEAR_CO = process.env.CLEAR_CONSOLE,
        CLEAR_CONSOLE = _process$env$CLEAR_CO === void 0 ? 'none' : _process$env$CLEAR_CO;
    webpackConfig.plugin('friendly-errors').use(require('friendly-errors-webpack-plugin'), [{
      clearConsole: CLEAR_CONSOLE !== 'none'
    }]);
  } // externals


  if (opts.externals) {
    webpackConfig.externals(opts.externals);
  } // node


  webpackConfig.node.merge({
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  });

  if (isDev) {
    require('./dev')["default"](webpackConfig, opts);
  } else {
    require('./prod')["default"](webpackConfig, opts);
  }

  if (opts.chainConfig) {
    (0, _assert["default"])(typeof opts.chainConfig === 'function', "opts.chainConfig should be function, but got ".concat(opts.chainConfig));
    opts.chainConfig(webpackConfig);
  }

  var config = webpackConfig.toConfig();

  if (process.env.SPEED_MEASURE) {
    var SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

    var smpOption = process.env.SPEED_MEASURE === 'CONSOLE' ? {
      outputFormat: 'human',
      outputTarget: console.log
    } : {
      outputFormat: 'json',
      outputTarget: (0, _path.join)(process.cwd(), 'speed-measure.json')
    };
    var smp = new SpeedMeasurePlugin(smpOption);
    config = smp.wrap(config);
  }

  return config;
}