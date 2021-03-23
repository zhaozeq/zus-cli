import { resolve } from 'path';
import build from './utils/webpack/build';
// import BuildStatistics from 'build-statistics-webpack-plugin';
// import BigBrother from 'bigbrother-webpack-plugin';
import getUserConfig from './utils/getConfig/getUserConfig';
import getWebpackConfig from './utils/getWebpackConfig';
import getPaths from './utils/common/getPaths';
import registerBabel from './utils/babel/registerBabel';

const debug = require('debug')('zus:build');

export default function(opts = {}) {
  const { cwd = process.cwd(), entry } = opts;

  const babel = resolve(__dirname, './utils/babel/babel.js');
  const paths = getPaths(cwd);
  // const stagesPath = join(__dirname, '../.run/build-statistics/compilation.json');

  // eslint-disable-next-line global-require,import/no-dynamic-require
  // const zusPkg = require(join(__dirname, '../package.json'));

  return new Promise(resolve => {
    // register babel for config files
    registerBabel(babel, {
      cwd,
    });

    // get user config
    const { config } = getUserConfig({ cwd });
    debug(`user config: ${JSON.stringify(config)}`);

    // get webpack config
    const webpackConfig = getWebpackConfig({
      cwd,
      config,
      babel,
      paths,
      entry,
    });

    // webpackConfig.plugins.push(
    //   new BuildStatistics({
    //     path: stagesPath,
    //   }),
    //   new BigBrother({
    //     cwd,
    //     tool: {
    //       name: 'zus',
    //       version: zusPkg.version,
    //       stagesPath,
    //     },
    //   }),
    // );

    build({
      webpackConfig,
      success() {
        resolve();
      },
      fail(err) {
        console.log(err);
      },
    });
  });
}
