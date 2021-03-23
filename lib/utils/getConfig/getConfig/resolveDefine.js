"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* eslint-disable guard-for-in */
var prefixRE = /^UMI_APP_/;

function _default(opts) {
  var env = {};
  Object.keys(process.env).forEach(function (key) {
    if (prefixRE.test(key) || key === 'NODE_ENV' || key === 'HMR' || key === 'SOCKET_SERVER') {
      env[key] = process.env[key];
    }
  });

  for (var key in env) {
    env[key] = JSON.stringify(env[key]);
  }

  var define = {};

  if (opts.define) {
    for (var _key in opts.define) {
      define[_key] = JSON.stringify(opts.define[_key]);
    }
  }

  return _objectSpread({
    'process.env': env
  }, define);
}
//# sourceMappingURL=resolveDefine.js.map