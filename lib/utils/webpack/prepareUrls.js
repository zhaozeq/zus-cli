"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = prepareUrls;

var _address = _interopRequireDefault(require("address"));

var _url = _interopRequireDefault(require("url"));

var _chalk = _interopRequireDefault(require("chalk"));

/* eslint-disable */
function prepareUrls(protocol, host, port, pathname) {
  var formatUrl = function formatUrl(hostname) {
    return _url["default"].format({
      protocol: protocol,
      hostname: hostname,
      port: port,
      pathname: pathname || '/'
    });
  };

  var prettyPrintUrl = function prettyPrintUrl(hostname) {
    return _url["default"].format({
      protocol: protocol,
      hostname: hostname,
      port: _chalk["default"].bold(port),
      pathname: pathname || '/'
    });
  };

  var isUnspecifiedHost = host === '0.0.0.0' || host === '::';
  var prettyHost, lanUrlForConfig, lanUrlForTerminal;

  if (isUnspecifiedHost) {
    prettyHost = 'localhost';

    try {
      // This can only return an IPv4 address
      lanUrlForConfig = _address["default"].ip(); // 获取ip地址

      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (/^10[.]|^30[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
          // Address is private, format it for later use
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined;
        }
      }
    } catch (_e) {// ignored
    }
  } else {
    prettyHost = host;
  }

  var localUrlForTerminal = prettyPrintUrl(prettyHost);
  var localUrlForBrowser = formatUrl(prettyHost);
  return {
    lanUrlForConfig: lanUrlForConfig,
    // ip 地址
    lanUrlForTerminal: lanUrlForTerminal,
    // network 地址
    localUrlForTerminal: localUrlForTerminal,
    // local 链接加粗port
    localUrlForBrowser: localUrlForBrowser // local 链接

  };
}
//# sourceMappingURL=prepareUrls.js.map