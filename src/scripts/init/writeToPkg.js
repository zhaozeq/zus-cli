import { exec } from 'child_process';
import chalk from 'chalk';
import spin from 'ora';
import solveFiles from './solveConfigIntoFiles';
import clearConsole from '../../utils/common/clearConsole';

const cwdPath = process.cwd(); //需要获得命令执行的位置

const endingText = (projectName, dest) => `
Success! Created ${projectName} at ${dest}.
Inside that directory, you can run several commands:
  * npm run dev: Starts the development server.
  * npm run build: Bundles the app into dist for production.
  * npm run test: Run test.
We suggest that you begin by typing:
  cd ${projectName}
  npm run dev
Happy hacking!
`;

module.exports = async (data, name, npm) => {
  const cwd = `${cwdPath}/${name}`;
  const targetFile = `${cwdPath}/${name}/package.json`;
  try {
    solveFiles(targetFile, data);
    clearConsole();
    if (data.autoDownload) {
      // 自动下载
      const loading = spin('开始下载依赖...');
      loading.start();
      exec(`${npm} install`, { cwd }, (err, stdout, stderr) => {
        loading.stop();
        if (err) {
          console.error(err);
          return;
        }
        console.log(`${chalk.gray(stderr)}`);
        console.log(`${chalk.green(endingText(name, cwd))}`);
      });
    } else if (data.autoDownload === false) {
      console.log(chalk.gray('\n  初始化完成！程序员，开始你的表演吧！'));
      console.log(chalk.gray(`  start with ${npm} install... \n`));
    } else {
      console.log(chalk.gray('\n  初始化完成！程序员，开始你的表演吧！'));
      console.log(chalk.gray('  温馨提示：您还未安装npm!\n'));
    }
  } catch (err) {
    console.log(chalk.red(' package.json 文件损坏，请重试'));
  }
};
