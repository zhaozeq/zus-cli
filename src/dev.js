import { resolve } from 'path';
// import assert from 'assert'
import chalk from 'chalk';
import webpack from './utils/webpack/dev';

// 用于上报webpack各阶段的耗时信息。
// import BuildStatistics from 'build-statistics-webpack-plugin'
// import BigBrother from 'bigbrother-webpack-plugin'

import getUserConfig, { watchConfigs, unwatchConfigs } from './utils/getConfig/getUserConfig';
import getWebpackConfig from './utils/getWebpackConfig';
import getPaths from './utils/common/getPaths';
import registerBabel from './utils/babel/registerBabel';

const debug = require('debug')('zus:dev');

export default function runDev(opts = {}) {
  const { cwd = process.cwd(), entry } = opts;

  const babel = resolve(__dirname, './utils/babel/babel.js');
  const paths = getPaths(cwd);

  // register babel for config files
  registerBabel(babel, {
    cwd,
  });

  // get user config
  let config = null;
  let returnedWatchConfig = null;
  try {
    const configObj = getUserConfig({ cwd });
    // eslint-disable-next-line prefer-destructuring
    config = configObj.config;
    returnedWatchConfig = configObj.watch;
    debug(`user config: ${JSON.stringify(config)}`);
  } catch (e) {
    console.error(chalk.red(e.message));
    debug('Get .webpackrc config failed, watch config and reload');

    // 监听配置项变更，然后重新执行 dev 逻辑
    watchConfigs().on('all', (event, path) => {
      debug(`[${event}] ${path}, unwatch and reload`);
      unwatchConfigs();
      runDev(opts);
    });
    return;
  }

  // get webpack config
  const webpackConfig = getWebpackConfig({
    cwd,
    config,
    babel,
    paths,
    entry,
  });

  // const stagesPath = join(
  //   __dirname,
  //   '../.run/build-statistics/compilation.json'
  // )

  // const zusPkg from join(__dirname, '../package.json'))
  // webpackConfig.plugins.push(
  //   new BuildStatistics({
  //     path: stagesPath
  //   }),
  //   new BigBrother({
  //     cwd,
  //     tool: {
  //       name: 'zus',
  //       version: zusPkg.version,
  //       stagesPath
  //     }
  //   })
  // )
  webpack({
    base: config.publicPath,
    webpackConfig,
    proxy: config.proxy || {},
    beforeServer(devServer) {
      try {
        if (process.env.MOCK === 'on') {
          // eslint-disable-next-line global-require
          require('./utils/mock').applyMock(devServer);
        }
      } catch (e) {
        console.log(e);
      }
    },
    afterServer(devServer) {
      returnedWatchConfig(devServer);
    },
    openBrowser: true,
    onCompileDone() {
      // console.log(webpackConfig, 'webpackConfig');
    },
  });
}
