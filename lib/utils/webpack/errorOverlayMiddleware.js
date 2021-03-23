"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createLaunchEditorMiddleware;

var _launchEditor = _interopRequireDefault(require("react-dev-utils/launchEditor"));

var _launchEditorEndpoint = _interopRequireDefault(require("react-dev-utils/launchEditorEndpoint"));

function createLaunchEditorMiddleware() {
  return function launchEditorMiddleware(req, res, next) {
    if (req.url.startsWith(_launchEditorEndpoint["default"])) {
      (0, _launchEditor["default"])(req.query.fileName, req.query.lineNumber);
      res.end();
    } else {
      next();
    }
  };
}
//# sourceMappingURL=errorOverlayMiddleware.js.map