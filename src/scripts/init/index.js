#! /usr/bin/env node

const { existsSync } = require('fs');
const { exec } = require('child_process');
const inquirer = require('inquirer');
const rimraf = require('rimraf').sync;
const which = require('which');
const chalk = require('chalk');
const spin = require('ora');
const DATA = require('../../doc/interaction');
const cloneFinished = require('./cloneFinished');

const cwdPath = process.cwd(); //需要获得命令执行的位置

function errConsole(msg) {
  console.log(chalk.red(msg));
  process.exit(0);
}

function cloneProject({ templateName, projectName }) {
  return new Promise(resolve => {
    const cwd = `${cwdPath}/${projectName}`;
    if (which.sync('git', { nothrow: true })) {
      const loading = spin('clone start...');
      loading.start();
      exec(
        `git clone https://github.com/zhaozeq/init_${templateName}_project.git ${projectName}`,
        { cwd: cwdPath, timeout: 10000 },
        err => {
          if (err) {
            console.log(`\n${err}`);
            errConsole(`\n ${templateName}模板获取失败`);
          }
          // 删除.git文件
          rimraf(`${cwd}/.git`);
          console.log(
            chalk.green(`\n  ${templateName} template project has cloned!`),
          );
          loading.stop();
          resolve();
        },
      );
    } else {
      errConsole(
        '\n 检测到您未安装git,请安装后重试(地址：https://git-scm.com/downloads)',
      );
    }
  });
}

/**
 * @param {array} argvs
 *  projectName: 项目名称
 *  type 模板类型
 */
async function newProject([projectName, templateName]) {
  await cloneProject({ templateName, projectName });
  cloneFinished(projectName);
}

module.exports = async function(projectName) {
  if (existsSync(projectName)) {
    errConsole(` 当前目录已存在名为${projectName}的文件夹,请处理`);
  }
  /* 询问模板类型 */
  const answers = await inquirer.prompt(DATA.TEMPCHOICE);
  /* 创建项目 */
  newProject([projectName, answers.template]);
};
