import { join } from 'path';
import excapeRegExp from 'lodash.escaperegexp'; // 转义字符串中的特殊字符避免影响正则校验

export default function(babelPreset, opts) {
  const { ignore, cwd } = opts;
  const files = ['.zus.mock.js', '.webpackrc.js', 'webpack.config.js', 'mock', 'src'].map(file => {
    return excapeRegExp(join(cwd, file));
  });
  const only = [new RegExp(`(${files.join('|')})`)];

  registerBabel({
    only,
    ignore,
    babelPreset,
  });
}

function registerBabel(opts = {}) {
  const { only, ignore, babelPreset } = opts;
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line global-require
    require('@babel/register')({
      presets: [babelPreset],
      plugins: [],
      only,
      ignore,
      extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
      babelrc: false,
      cache: false,
    });
  }
}
