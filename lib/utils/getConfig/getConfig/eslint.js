"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _eslintFormatter = _interopRequireDefault(require("react-dev-utils/eslintFormatter"));

function _default(webpackConfig, opts) {
  var eslintOptions = {
    formatter: _eslintFormatter["default"],
    baseConfig: {
      "extends": [require.resolve('eslint-config-umi')]
    },
    ignore: false,
    eslintPath: require.resolve('eslint'),
    useEslintrc: false
  };
  webpackConfig.module.rule('eslint').test(/\.(js|jsx)$/).include.add(opts.cwd).end().exclude.add(/node_modules/).end().enforce('pre').use('eslint-loader').loader(require.resolve('eslint-loader')).options(eslintOptions);
}