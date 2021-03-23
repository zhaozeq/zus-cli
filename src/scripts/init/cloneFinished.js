import chalk from 'chalk';
import { existsSync } from 'fs';
import inquirer from 'inquirer';
import which from 'which';

import getUser from './getUser';
import write from './writeToPkg';
import { PACKAGE_LIST } from '../../doc/interaction';
const cwdPath = process.cwd(); //需要获得命令执行的位置
const changeDefault = (name, author) => {
  if (Object.prototype.toString.call(PACKAGE_LIST) === '[object Array]') {
    PACKAGE_LIST.forEach(item => {
      if (item.name === 'name') {
        item.default = name;
      } else if (item.name === 'author') {
        item.default = author;
      }
    });
  }
};

function findNpm() {
  const npms = process.platform === 'win32' ? ['tnpm.cmd', 'cnpm.cmd', 'npm.cmd'] : ['tnpm', 'cnpm', 'npm'];
  for (let i = 0; i < npms.length; i += 1) {
    which.sync(npms[i], { nothrow: true });
    return npms[i];
  }
  return false;
}

module.exports = async function cloneFinished(proName) {
  const targetFile = `${cwdPath}/${proName}/package.json`;
  if (existsSync(targetFile)) {
    const defaultName = getUser();
    const npm = findNpm();
    if (!npm) PACKAGE_LIST.pop();
    changeDefault(proName, defaultName);
    const res = await inquirer.prompt(PACKAGE_LIST);
    write(res, proName, npm);
  } else {
    console.log(`  ${chalk.red('模板已损坏，请联系管理员解决')}
    `);
  }
};
