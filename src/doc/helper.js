const chalk = require('chalk');
module.exports = function help() {
  console.log();
  console.log('Examples:');
  console.log();
  console.log(chalk.gray('  # create a new project'));
  console.log('  $ zus init projectName');
  console.log();
  console.log(chalk.gray('  # start server '));
  console.log('  $ zus server');
  console.log();
  console.log(chalk.gray('  # build project '));
  console.log('  $ zus build');
  console.log();
};
