"use strict";

var debug = require('debug')('zus:send');

var _require = require('child_process'),
    fork = _require.fork;

var usedPorts = [];
/* fork 中端口处理 */

function start(scriptPath) {
  //  调用node的所传入的一些特殊参数(http://nodejs.cn/api/process.html#process_process_execargv)
  var execArgv = process.execArgv.slice(0);
  var inspectArgvIndex = execArgv.findIndex( // node --inspect-brk=9229  9229默认ws通信端口 '-brk' 设置断点
  function (argv) {
    return argv.includes('--inspect-brk');
  }); // 端口操作

  if (inspectArgvIndex > -1) {
    var inspectArgv = execArgv[inspectArgvIndex];
    execArgv.splice(inspectArgvIndex, 1, inspectArgv.replace(/--inspect-brk=(.*)/, function (matchedStr, s1) {
      var port;

      try {
        port = parseInt(s1, 10) + 1;
      } catch (e) {
        port = 9230;
      }

      if (usedPorts.includes(port)) {
        port += 1;
      }

      usedPorts.push(port);
      return "--inspect-brk=".concat(port);
    }));
  }

  var child = fork(scriptPath, process.argv.slice(2), {
    execArgv: execArgv
  });
  child.on('message', function (data) {
    var type = data && data.type || null;

    if (type === 'RESTART') {
      child.kill();
      start(scriptPath);
    }

    if (process.send) {
      debug("send ".concat(JSON.stringify(data)));
      process.send(data); // 向父进程发送消息
    }
  });
  child.on('exit', function (code) {
    if (code === 1) {
      process.exit(code);
    }
  });
  process.on('SIGINT', function () {
    child.kill('SIGINT');
  });
  return child;
}

start(require.resolve('./realDev.js'));
//# sourceMappingURL=index.js.map