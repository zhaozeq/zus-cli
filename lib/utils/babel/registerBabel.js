"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _path = require("path");

var _lodash = _interopRequireDefault(require("lodash.escaperegexp"));

// 转义字符串中的特殊字符避免影响正则校验
function _default(babelPreset, opts) {
  var ignore = opts.ignore,
      cwd = opts.cwd;
  var files = ['.zus.mock.js', '.webpackrc.js', 'webpack.config.js', 'mock', 'src'].map(function (file) {
    return (0, _lodash["default"])((0, _path.join)(cwd, file));
  });
  var only = [new RegExp("(".concat(files.join('|'), ")"))];
  registerBabel({
    only: only,
    ignore: ignore,
    babelPreset: babelPreset
  });
}

function registerBabel() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var only = opts.only,
      ignore = opts.ignore,
      babelPreset = opts.babelPreset;

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line global-require
    require('@babel/register')({
      presets: [babelPreset],
      plugins: [],
      only: only,
      ignore: ignore,
      extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
      babelrc: false,
      cache: false
    });
  }
}