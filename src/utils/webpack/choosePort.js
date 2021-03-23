import detect from 'detect-port';
import getProcessForPort from 'react-dev-utils/getProcessForPort';
import chalk from 'chalk';
import inquirer from 'inquirer';
import isRoot from 'is-root'; // 检查进程是否以提升的权限运行
import clearConsole from '../common/clearConsole';

const isInteractive = process.stdout.isTTY; // 判断Node.js是否运行在TTY上下文

export default function choosePort(defaultPort) {
  if (process.env.DETECT_PORT === 'none') {
    return Promise.resolve(defaultPort);
  }

  return detect(defaultPort).then(
    port => new Promise(resolve => {
        if (port === defaultPort) {
          return resolve(port);
        }
        const message = process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
            ? `Admin permissions are required to run a server on a port below 1024.`
            : `Something is already running on port ${defaultPort}.`;
        if (isInteractive) {
          clearConsole();
          const existingProcess = getProcessForPort(defaultPort); // 是否存在进程占用端口
          const question = {
            type: 'confirm',
            name: 'shouldChangePort',
            message: `${chalk.yellow(
              `message${
                existingProcess // eslint-disable-line
                  ? ` Probably:\n  ${existingProcess}`
                  : ''
              }`,
            )}\n\nWould you like to run the app on another port instead?`,
            default: true,
          };
          inquirer.prompt(question).then(answer => {
            if (answer.shouldChangePort) {
              resolve(port);
            } else {
              resolve(null);
            }
          });
        } else {
          console.log(chalk.red(message));
          resolve(null);
        }
      }),
    err => {
      throw new Error(
        chalk.red(`Could not find an open port.\nNetwork error message: ${err.message || err}\n`),
      );
    },
  );
}
