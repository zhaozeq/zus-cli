const { existsSync, readFileSync, writeFileSync } = require('fs');
const handlebars = require('handlebars');

/**
 * solveFile
 * @param {*} targetFile 目标文件路径
 * @param {*} data 变量对象
 * @returns
 */
module.exports = async function solveFile(targetFile, data) {
  if (existsSync(targetFile)) {
    const content = await readFileSync(targetFile).toString();
    const result = await handlebars.compile(content)(data);
    writeFileSync(targetFile, result);
  } else {
    console.log(`\n ${targetFile} is not found!`);
  }
};
