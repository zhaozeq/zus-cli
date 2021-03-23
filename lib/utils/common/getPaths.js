"use strict";

var _require = require('path'),
    resolve = _require.resolve;

var _require2 = require('fs'),
    realpathSync = _require2.realpathSync;

function resolveOwn(relativePath) {
  return resolve(__dirname, relativePath);
}

module.exports = function (cwd) {
  var appDirectory = realpathSync(cwd);

  function resolveApp(relativePath) {
    return resolve(appDirectory, relativePath);
  }

  return {
    appBuild: resolveApp('dist'),
    appPublic: resolveApp('public'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appNodeModules: resolveApp('node_modules'),
    ownNodeModules: resolveOwn('../../node_modules'),
    resolveApp: resolveApp,
    appDirectory: appDirectory
  };
};