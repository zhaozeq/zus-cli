"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _path = require("path");

var _fs = require("fs");

var _glob = _interopRequireDefault(require("glob"));

var _reactDevUtils = require("./reactDevUtils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// entry 支持 4 种格式：
//
// 1. 什么都没配，取 src/index.(j|t)sx?
// 2. 对象
// 3. 字符串
// 4. 数组
function _default() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cwd = opts.cwd,
      entry = opts.entry,
      isBuild = opts.isBuild;
  var entryObj = null;

  if (!entry) {
    entryObj = {
      index: getExistsDefaultEntry(cwd)
    };
  } else if (typeof entry === 'string') {
    var files = getFiles(entry, cwd);
    entryObj = getEntries(files);
  } else if (Array.isArray(entry)) {
    var _files = entry.reduce(function (memo, entryItem) {
      return memo.concat(getFiles(entryItem, cwd));
    }, []);

    entryObj = getEntries(_files);
  } else if (isPlainObject(entry)) {
    entryObj = entry;
  } else {
    throw new Error("entry should be String, Array or Plain Object, but got ".concat(entry));
  }

  if (!isBuild) {
    entryObj = Object.keys(entryObj).reduce(function (memo, key) {
      return !Array.isArray(entryObj[key]) ? _objectSpread(_objectSpread({}, memo), {}, (0, _defineProperty2["default"])({}, key, [_reactDevUtils.webpackHotDevClientPath, entryObj[key]])) : _objectSpread(_objectSpread({}, memo), {}, (0, _defineProperty2["default"])({}, key, entryObj[key]));
    }, {});
  } // add setPublicPath


  var setPublicPathFile = (0, _path.join)(__dirname, '../../template/setPublicPath.js');

  if (process.env.SET_PUBLIC_PATH) {
    entryObj = Object.keys(entryObj).reduce(function (memo, key) {
      return _objectSpread(_objectSpread({}, memo), {}, (0, _defineProperty2["default"])({}, key, [setPublicPathFile].concat((0, _toConsumableArray2["default"])(Array.isArray(entryObj[key]) ? entryObj[key] : [entryObj[key]]))));
    }, {});
  }

  return entryObj;
}

function getEntry(filePath) {
  var key = (0, _path.basename)(filePath).replace(/\.(j|t)sx?$/, '');
  return (0, _defineProperty2["default"])({}, key, filePath);
}

function getFiles(entry, cwd) {
  var files = _glob["default"].sync(entry, {
    cwd: cwd
  });

  return files.map(function (file) {
    return file.charAt(0) === '.' ? file : ".".concat(_path.sep).concat(file);
  });
}

function getEntries(files) {
  return files.reduce(function (memo, file) {
    return _objectSpread(_objectSpread({}, memo), getEntry(file));
  }, {});
}

function getExistsDefaultEntry(cwd) {
  if ((0, _fs.existsSync)((0, _path.join)(cwd, './src/index.js'))) {
    return './src/index.js';
  }

  if ((0, _fs.existsSync)((0, _path.join)(cwd, './src/index.jsx'))) {
    return './src/index.jsx';
  }

  if ((0, _fs.existsSync)((0, _path.join)(cwd, './src/index.ts'))) {
    return './src/index.ts';
  }

  if ((0, _fs.existsSync)((0, _path.join)(cwd, './src/index.tsx'))) {
    return './src/index.tsx';
  } // default


  return './src/index.js';
}

function isPlainObject(obj) {
  if ((0, _typeof2["default"])(obj) !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}
//# sourceMappingURL=getEntry.js.map