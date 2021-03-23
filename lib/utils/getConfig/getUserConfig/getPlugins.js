"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _path = require("path");

var _requireindex = _interopRequireDefault(require("requireindex"));

function _default() {
  var pluginsMap = (0, _requireindex["default"])((0, _path.join)(__dirname, './configs'));
  return Object.keys(pluginsMap).map(function (key) {
    return pluginsMap[key]["default"]();
  });
}