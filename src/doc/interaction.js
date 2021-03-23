const TEMPCHOICE = [
  {
    type: 'list',
    message: '是否选用一种模板:',
    name: 'template',
    default: 'none',
    choices: ['none', 'vue', 'vue-mobile', 'react', 'react-mobile'],
  },
];

const IS_COVER = [
  {
    type: 'confirm',
    message: '存在相同文件名，是否覆盖？',
    name: 'cover',
  },
];

const PACKAGE_LIST = [
  {
    type: 'input',
    message: '填写项目名称：',
    name: 'name',
    default: 'Project name',
  },
  {
    type: 'input',
    message: '填写项目描述：',
    name: 'description',
    default: '',
  },
  {
    type: 'input',
    message: '填写作者：',
    name: 'author',
    default: '',
  },
  {
    type: 'confirm',
    message: '是否自动下载依赖',
    name: 'autoDownload',
    default: true,
  },
];
module.exports = {
  TEMPCHOICE,
  IS_COVER,
  PACKAGE_LIST,
};
