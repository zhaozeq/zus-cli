"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyMock = applyMock;
exports.outputError = outputError;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _fs = require("fs");

var _assert = _interopRequireDefault(require("assert"));

var _chokidar = require("chokidar");

var _chalk = require("chalk");

var _httpProxyMiddleware = _interopRequireDefault(require("http-proxy-middleware"));

var _url = require("url");

var _bodyParser = require("body-parser");

var _getPaths = _interopRequireDefault(require("./common/getPaths"));

var debug = require('debug')('zus:mock');

var error = null;
var paths = (0, _getPaths["default"])(process.cwd());
var configFile = paths.resolveApp('.zus.mock.js');
var mockDir = paths.resolveApp('./mock/');

function getConfig() {
  if ((0, _fs.existsSync)(configFile)) {
    // disable require cache
    Object.keys(require.cache).forEach(function (file) {
      if (file === configFile || file.indexOf(mockDir) > -1) {
        debug("delete cache ".concat(file));
        delete require.cache[file];
      }
    }); // eslint-disable-next-line global-require,import/no-dynamic-require

    return require(configFile);
  } else {
    return {};
  }
}

function createMockHandler(method, path, value) {
  return function mockHandler() {
    var res = arguments.length <= 1 ? undefined : arguments[1];

    if (typeof value === 'function') {
      value.apply(void 0, arguments);
    } else {
      res.json(value);
    }
  };
}

function createProxy(method, pathPattern, target) {
  var filter = function filter(_, req) {
    return method ? req.method.toLowerCase() === method.toLowerCase() : true;
  };

  var parsedUrl = (0, _url.parse)(target);
  var realTarget = [parsedUrl.protocol, parsedUrl.host].join('//');
  var targetPath = parsedUrl.path;

  var pathRewrite = function pathRewrite(path, req) {
    var matchPath = req.originalUrl;
    var matches = matchPath.match(pathPattern);

    if (matches.length > 1) {
      matchPath = matches[1];
    }

    return path.replace(req.originalUrl.replace(matchPath, ''), targetPath);
  };

  return (0, _httpProxyMiddleware["default"])(filter, {
    target: realTarget,
    pathRewrite: pathRewrite
  });
}

function applyMock(devServer) {
  try {
    realApplyMock(devServer);
    error = null;
  } catch (e) {
    console.log(e);
    error = e;
    console.log();
    outputError();
    var watcher = (0, _chokidar.watch)([configFile, mockDir], {
      ignored: /node_modules/,
      ignoreInitial: true
    });
    watcher.on('change', function (path) {
      console.log((0, _chalk.green)('CHANGED'), path.replace(paths.appDirectory, '.'));
      watcher.close();
      applyMock(devServer);
    });
  }
}

function realApplyMock(devServer) {
  var config = getConfig();
  var app = devServer.app;
  var proxyRules = [];
  var mockRules = [];
  Object.keys(config).forEach(function (key) {
    var keyParsed = parseKey(key);
    (0, _assert["default"])(!!app[keyParsed.method], "method of ".concat(key, " is not valid"));
    (0, _assert["default"])(typeof config[key] === 'function' || (0, _typeof2["default"])(config[key]) === 'object' || typeof config[key] === 'string', "mock value of ".concat(key, " should be function or object or string, but got ").concat((0, _typeof2["default"])(config[key])));

    if (typeof config[key] === 'string') {
      var path = keyParsed.path;

      if (/\(.+\)/.test(path)) {
        path = new RegExp("^".concat(path, "$"));
      }

      proxyRules.push({
        path: path,
        method: keyParsed.method,
        target: config[key]
      });
    } else {
      mockRules.push({
        path: keyParsed.path,
        method: keyParsed.method,
        target: config[key]
      });
    }

    proxyRules.forEach(function (proxy) {
      app.use(proxy.path, createProxy(proxy.method, proxy.path, proxy.target));
    });
    /**
     * body-parser must be placed after http-proxy-middleware
     * https://github.com/chimurai/http-proxy-middleware/blob/master/recipes/modify-post.md
     */

    devServer.use((0, _bodyParser.json)({
      limit: '5mb',
      strict: false
    }));
    devServer.use((0, _bodyParser.urlencoded)({
      extended: true,
      limit: '5mb'
    }));
    mockRules.forEach(function (mock) {
      app[mock.method](mock.path, createMockHandler(mock.method, mock.path, mock.target));
    });
  }); // 调整 stack，把 historyApiFallback 放到最后

  var lastIndex = null;

  app._router.stack.forEach(function (item, index) {
    if (item.name === 'webpackDevMiddleware') {
      lastIndex = index;
    }
  });

  var mockAPILength = app._router.stack.length - 1 - lastIndex;

  if (lastIndex && lastIndex > 0) {
    var newStack = app._router.stack;
    newStack.push(newStack[lastIndex - 1]);
    newStack.push(newStack[lastIndex]);
    newStack.splice(lastIndex - 1, 2);
    app._router.stack = newStack;
  }

  var watcher = (0, _chokidar.watch)([configFile, mockDir], {
    ignored: /node_modules/,
    persistent: true
  });
  watcher.on('change', function (path) {
    console.log((0, _chalk.green)('CHANGED'), path.replace(paths.appDirectory, '.'));
    watcher.close(); // 删除旧的 mock api

    app._router.stack.splice(lastIndex - 1, mockAPILength);

    applyMock(devServer);
  });
}

function parseKey(key) {
  var method = 'get';
  var path = key;

  if (key.indexOf(' ') > -1) {
    var splited = key.split(' ');
    method = splited[0].toLowerCase();
    path = splited[1];
  }

  return {
    method: method,
    path: path
  };
}

function outputError() {
  if (!error) return;
  var filePath = error.message.split(': ')[0];
  var relativeFilePath = filePath.replace(paths.appDirectory, '.');
  var errors = error.stack.split('\n').filter(function (line) {
    return line.trim().indexOf('at ') !== 0;
  }).map(function (line) {
    return line.replace("".concat(filePath, ": "), '');
  });
  errors.splice(1, 0, ['']);
  console.log((0, _chalk.red)('Failed to parse mock config.'));
  console.log();
  console.log("Error in ".concat(relativeFilePath));
  console.log(errors.join('\n'));
  console.log();
}