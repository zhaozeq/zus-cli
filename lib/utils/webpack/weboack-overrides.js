"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _crypto = _interopRequireDefault(require("crypto"));

/**
 * ref:
 * https://github.com/facebook/create-react-app/blob/master/packages/babel-preset-react-app/webpack-overrides.js
 */
var macroCheck = new RegExp('[./]macro');

function _default() {
  return {
    // This function transforms the Babel configuration on a per-file basis
    config: function config(_config, _ref) {
      var source = _ref.source;

      // Babel Macros are notoriously hard to cache, so they shouldn't be
      // https://github.com/babel/babel/issues/8497
      // We naively detect macros using their package suffix and add a random token
      // to the caller, a valid option accepted by Babel, to compose a one-time
      // cacheIdentifier for the file. We cannot tune the loader options on a per
      // file basis.
      if (macroCheck.test(source)) {
        return Object.assign({}, _config.options, {
          caller: Object.assign({}, _config.options.caller, {
            craInvalidationToken: _crypto["default"].randomBytes(32).toString('hex')
          })
        });
      }

      return _config.options;
    }
  };
}
//# sourceMappingURL=weboack-overrides.js.map