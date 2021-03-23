import getConfig from './getConfig/getConfig';
import getEntry from './webpack/getEntry';

const defaultBrowsers = ['last 2 versions'];
const isDev = process.env.NODE_ENV === 'development';

export default function(opts = {}) {
  const { cwd, config, babel, paths, entry } = opts;
  const browserslist = config.browserslist || defaultBrowsers;

  return getConfig({
    cwd,
    ...config,

    entry: getEntry({
      cwd: paths.appDirectory,
      entry: entry || config.entry,
      isBuild: !isDev,
    }),
    babel: config.babel || {
      presets: [[babel, { browsers: browserslist }], ...(config.extraBabelPresets || [])],
      plugins: config.extraBabelPlugins || [],
    },
    browserslist,
  });
}
