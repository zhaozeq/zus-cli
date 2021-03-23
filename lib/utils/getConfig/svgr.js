"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _loaderUtils = require("loader-utils");

var _core = require("@babel/core");

var _core2 = _interopRequireDefault(require("@svgr/core"));

// ref: https://github.com/smooth-code/svgr/blob/master/packages/webpack/src/index.js
function svgrLoader(source) {
  var _this = this;

  var callback = this.async();

  var _ref = (0, _loaderUtils.getOptions)(this) || {},
      _ref$babel = _ref.babel,
      babel = _ref$babel === void 0 ? true : _ref$babel,
      options = (0, _objectWithoutProperties2["default"])(_ref, ["babel"]);

  var readSvg = function readSvg() {
    return new Promise(function (resolve, reject) {
      _this.fs.readFile(_this.resourcePath, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  };

  var exportMatches = source.toString('utf-8').match(/^module.exports\s*=\s*(.*)/);
  var previousExport = exportMatches ? exportMatches[1] : null;

  var pBabelTransform = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(jsCode) {
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                (0, _core.transform)(jsCode, {
                  babelrc: false,
                  // Unless having this, babel will merge the config with global 'babel.config.js'
                  // which may causes some problems such as using react-hot-loader/babel in babel.config.js
                  configFile: false,
                  presets: [require.resolve('@babel/preset-react'), [require.resolve('@babel/preset-env'), {
                    modules: false
                  }]],
                  plugins: [require.resolve('@babel/plugin-transform-react-constant-elements')]
                }, function (err, result) {
                  if (err) reject(err);else resolve(result.code);
                });
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function pBabelTransform(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var tranformSvg = function tranformSvg(svg) {
    return (0, _core2["default"])(svg, options, {
      webpack: {
        previousExport: previousExport
      },
      filePath: _this.resourcePath
    }).then(function (jsCode) {
      return babel ? pBabelTransform(jsCode) : jsCode;
    }).then(function (result) {
      return callback(null, result);
    })["catch"](function (err) {
      return callback(err);
    });
  };

  if (exportMatches) {
    readSvg().then(tranformSvg);
  } else {
    tranformSvg(source);
  }
}

var _default = svgrLoader;
exports["default"] = _default;
//# sourceMappingURL=svgr.js.map