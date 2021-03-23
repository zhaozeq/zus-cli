"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = require("path");

var _autoprefixer = _interopRequireDefault(require("autoprefixer"));

var _normalizeTheme = _interopRequireDefault(require("./normalizeTheme"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DEFAULT_BROWSERS = ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9' // React doesn't support IE8 anyway
];

function _default(webpackConfig, opts) {
  var isDev = process.env.NODE_ENV === 'development';

  var cssOpts = _objectSpread({
    importLoaders: 1,
    sourceMap: !opts.disableCSSSourceMap
  }, opts.cssLoaderOptions || {}); // should pass down opts.cwd


  var theme = (0, _normalizeTheme["default"])(opts.theme, opts);
  var postcssOptions = {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    plugins: function plugins() {
      return [require('postcss-flexbugs-fixes'), // eslint-disable-line
      (0, _autoprefixer["default"])(_objectSpread({
        overrideBrowserslist: opts.browserslist || DEFAULT_BROWSERS,
        flexbox: 'no-2009'
      }, opts.autoprefixer || {}))].concat((0, _toConsumableArray2["default"])(opts.extraPostCSSPlugins ? opts.extraPostCSSPlugins : []), (0, _toConsumableArray2["default"])(isDev || process.env.CSS_COMPRESS === 'none' || process.env.COMPRESS === 'none' || process.env.NO_COMPRESS ? [] : [// eslint-disable-next-line global-require
      require('cssnano')({
        preset: ['default', opts.cssnano || {
          mergeRules: false,
          // ref: https://github.com/umijs/umi/issues/955
          normalizeUrl: false
        }]
      })]));
    }
  };
  var cssModulesConfig = {
    modules: true,
    localIdentName: cssOpts.localIdentName || (isDev ? '[path][name]__[local]' : '[local]___[hash:base64:5]')
  };

  var lessOptions = _objectSpread({
    modifyVars: theme,
    javascriptEnabled: true
  }, opts.lessLoaderOptions || {});

  var hasSassLoader = true;

  try {
    require.resolve('sass-loader');
  } catch (e) {
    hasSassLoader = false;
  }

  function applyCSSRules(rule, _ref) {
    var cssModules = _ref.cssModules,
        less = _ref.less,
        sass = _ref.sass;
    rule.use('extract-css-loader') // eslint-disable-next-line global-require
    .loader(require('mini-css-extract-plugin').loader).options({
      publicPath: isDev ? '/' : opts.cssPublicPath,
      hmr: isDev
    });
    rule.use('css-loader').loader(require.resolve('css-loader')).options(_objectSpread(_objectSpread({}, cssOpts), cssModules ? cssModulesConfig : {}));
    rule.use('postcss-loader').loader(require.resolve('postcss-loader')).options(postcssOptions);

    if (less) {
      rule.use('less-loader').loader(require.resolve('less-loader')).options(lessOptions);
    }

    if (sass && hasSassLoader) {
      rule.use('sass-loader').loader(require.resolve('sass-loader')).options(opts.sass);
    }
  }

  if (opts.cssModulesExcludes) {
    opts.cssModulesExcludes.forEach(function (exclude, index) {
      var rule = "cssModulesExcludes_".concat(index);
      var config = webpackConfig.module.rule(rule).test(function (filePath) {
        if (exclude instanceof RegExp) {
          return exclude.test(filePath);
        } else {
          return filePath.indexOf(exclude) > -1;
        }
      });
      var ext = (0, _path.extname)(exclude).toLowerCase();
      applyCSSRules(config, {
        less: ext === '.less',
        sass: ext === '.sass' || ext === '.scss'
      });
    });
  }

  if (opts.cssModulesWithAffix) {
    applyCSSRules(webpackConfig.module.rule('.module.css').test(/\.module\.css$/), {
      cssModules: true
    });
    applyCSSRules(webpackConfig.module.rule('.module.less').test(/\.module\.less$/), {
      cssModules: true,
      less: true
    });
    applyCSSRules(webpackConfig.module.rule('.module.sass').test(/\.module\.(sass|scss)$/), {
      cssModules: true,
      sass: true
    });
  }

  function cssExclude(filePath) {
    if (/node_modules/.test(filePath)) {
      return true;
    }

    if (opts.cssModulesWithAffix) {
      if (/\.module\.(css|less|sass|scss)$/.test(filePath)) return true;
    }

    if (opts.cssModulesExcludes) {
      var _iterator = _createForOfIteratorHelper(opts.cssModulesExcludes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var exclude = _step.value;
          if (filePath.indexOf(exclude) > -1) return true;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    return false;
  }

  applyCSSRules(webpackConfig.module.rule('css').test(/\.css$/).exclude.add(cssExclude).end(), {
    cssModules: !opts.disableCSSModules
  });
  applyCSSRules(webpackConfig.module.rule('css-in-node_modules').test(/\.css$/).include.add(/node_modules/).end(), {});
  applyCSSRules(webpackConfig.module.rule('less').test(/\.less$/).exclude.add(cssExclude).end(), {
    cssModules: !opts.disableCSSModules,
    less: true
  });
  applyCSSRules(webpackConfig.module.rule('less-in-node_modules').test(/\.less$/).include.add(/node_modules/).end(), {
    less: true
  });
  applyCSSRules(webpackConfig.module.rule('sass').test(/\.(sass|scss)$/).exclude.add(cssExclude).end(), {
    cssModules: !opts.disableCSSModules,
    sass: true
  });
  applyCSSRules(webpackConfig.module.rule('sass-in-node_modules').test(/\.(sass|scss)$/).include.add(/node_modules/).end(), {
    sass: true
  });
  var hash = !isDev && opts.hash ? '.[contenthash:8]' : ''; // eslint-disable-next-line global-require

  webpackConfig.plugin('extract-css').use(require('mini-css-extract-plugin'), [{
    filename: "[name]".concat(hash, ".css"),
    chunkFilename: "[name]".concat(hash, ".chunk.css")
  }]);
}
//# sourceMappingURL=css.js.map