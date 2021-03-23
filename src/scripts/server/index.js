const debug = require('debug')('zus:send');
const { fork } = require('child_process');

const usedPorts = [];
/* fork 中端口处理 */
function start(scriptPath) {
  //  调用node的所传入的一些特殊参数(http://nodejs.cn/api/process.html#process_process_execargv)
  const execArgv = process.execArgv.slice(0);
  const inspectArgvIndex = execArgv.findIndex(
    // node --inspect-brk=9229  9229默认ws通信端口 '-brk' 设置断点
    argv => argv.includes('--inspect-brk'),
  );

  // 端口操作
  if (inspectArgvIndex > -1) {
    const inspectArgv = execArgv[inspectArgvIndex];
    execArgv.splice(
      inspectArgvIndex,
      1,
      inspectArgv.replace(/--inspect-brk=(.*)/, (matchedStr, s1) => {
        let port;
        try {
          port = parseInt(s1, 10) + 1;
        } catch (e) {
          port = 9230;
        }
        if (usedPorts.includes(port)) {
          port += 1;
        }
        usedPorts.push(port);
        return `--inspect-brk=${port}`;
      }),
    );
  }

  const child = fork(scriptPath, process.argv.slice(2), { execArgv });

  child.on('message', data => {
    const type = (data && data.type) || null;
    if (type === 'RESTART') {
      child.kill();
      start(scriptPath);
    }
    if (process.send) {
      debug(`send ${JSON.stringify(data)}`);
      process.send(data); // 向父进程发送消息
    }
  });
  child.on('exit', code => {
    if (code === 1) {
      process.exit(code);
    }
  });

  process.on('SIGINT', () => {
    child.kill('SIGINT');
  });

  return child;
}

start(require.resolve('./realDev.js'));
