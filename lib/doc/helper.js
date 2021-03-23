"use strict";

var chalk = require("chalk");

module.exports = function help() {
  console.log();
  console.log("Examples:");
  console.log();
  console.log(chalk.gray("  # start server"));
  console.log("  $ zus server");
  console.log();
  console.log(chalk.gray("  # create a new project straight from a github template"));
  console.log("  $ cli-master init username/repo my-project");
  console.log();
};
//# sourceMappingURL=helper.js.map