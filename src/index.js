import { dirname } from 'path';
import chalk from 'chalk';
import helper from './doc/helper';
import init from './scripts/init';

// 可以打印fork进程的日志
require('graceful-process')({ logLevel: 'warn' });

const nodeVersion = process.versions.node;
const versions = nodeVersion.split('.');
const major = versions[0];
const minor = versions[1];

if (major * 10 + minor * 1 < 90) {
  console.log(`Node version must >= 9.0, but got ${major}.${minor}`);
  process.exit(1);
}

const updater = require('update-notifier');
const pkg = require('../package.json');
const notifier = updater({ pkg, updateCheckInterval: 1000 * 60 * 60 * 24 * 7 });
if (notifier.update && notifier.update.latest !== pkg.version) {
  // 存在新版本
  const old = notifier.update.current;
  const latest = notifier.update.latest;
  let type = notifier.update.type;
  switch (type) {
    case 'major':
      type = chalk.red(type);
      break;
    case 'minor':
      type = chalk.yellow(type);
      break;
    case 'patch':
      type = chalk.green(type);
      break;
    default:
      break;
  }
  notifier.notify({
    message: `New ${type} version of ${pkg.name} available! ${chalk.red(old)} -> ${chalk.green(
      latest,
    )}\nRun ${chalk.green(`npm install -g ${pkg.name}`)} to update!`,
  });
}

process.env.ZUS_DIR = dirname(require.resolve('../package'));
process.env.ZUS_VERSION = pkg.version;

const command = process.argv[2];
const args = process.argv.slice(3);

process.nextTick(() => {
  switch (command) {
    case '-v':
    case '--version':
      console.log(pkg.version);
      break;
    case 'init':
      if (args[0]) {
        init(args[0]);
      } else {
        helper();
      }
      break;
    case 'build':
    case 'server':
    case 'test':
      /* eslint-disable */
      require(`./scripts/${command}`);
      break;
    default:
      helper();
      break;
  }
});
