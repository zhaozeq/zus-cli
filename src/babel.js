import { existsSync, readFileSync } from 'fs';
import stripJsonComments from 'strip-json-comments';
import { resolve } from 'path';

export default function(context, opts = {}) {
  return {
    presets: [[getBabel(opts)]],
  };
}

function getBabelRc({ cwd, file = 'babelrc' }) {
  const rcFile = resolve(cwd, file);
  let config = {
    presets: [],
    plugins: [],
  };
  if (existsSync(rcFile)) {
    config = JSON.parse(stripJsonComments(readFileSync(rcFile, 'utf-8')));
  }
  if (!(config.presets instanceof Array)) {
    config.presets = [];
  }
  if (!(config.plugins instanceof Array)) {
    config.plugins = [];
  }
  return config;
}
/**
 * babel plugins
 *
 * @export
 * @param {*} context
 * @param {*} [opts={}]
 * @returns
 */
function getBabel(opts = {}) {
  // console.log(context, 'context')
  const nodeEnv = process.env.NODE_ENV;
  const {
    /**
     *  "usage"：在每个文件中使用polyfill时导入
     *  "entry"：只在入口引入("@babel/polyfill")
     *  false(默认): 不做上述两个操作
     */
    useBuiltIns = false,
    loose = false, // 是否允许松散装换
    targets = { browsers: ['last 2 versions'] },
    cwd = process.cwd(),
    env = {},
  } = opts;
  const transformRuntime = 'transformRuntime' in opts
      ? opts.transformRuntime
      : {
          absoluteRuntime: process.env.ZUS_DIR,
        };
  const exclude = [
    'transform-typeof-symbol',
    'transform-unicode-regex',
    'transform-sticky-regex',
    'transform-new-target',
    'transform-modules-umd',
    'transform-modules-systemjs',
    'transform-modules-amd',
    'transform-literals',
  ];

  const plugins = [
    require.resolve('babel-plugin-react-require'), // 不用 require react
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    [require.resolve('@babel/plugin-proposal-object-rest-spread'), { loose, useBuiltIns }],
    require.resolve('@babel/plugin-proposal-optional-catch-binding'),
    require.resolve('@babel/plugin-proposal-async-generator-functions'),

    // 下面两个的顺序的配置都不能动
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],

    require.resolve('@babel/plugin-proposal-export-namespace-from'),
    require.resolve('@babel/plugin-proposal-export-default-from'),
    [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), { loose }],
    [require.resolve('@babel/plugin-proposal-optional-chaining'), { loose }],
    [
      require.resolve('@babel/plugin-proposal-pipeline-operator'),
      {
        proposal: 'minimal',
      },
    ],
    require.resolve('@babel/plugin-proposal-do-expressions'),
    require.resolve('@babel/plugin-proposal-function-bind'),
    require.resolve('babel-plugin-macros'),
  ];

  if (nodeEnv !== 'test' && transformRuntime) {
    plugins.push([require.resolve('@babel/plugin-transform-runtime'), transformRuntime]);
  }
  if (nodeEnv === 'production') {
    plugins.push(require.resolve('babel-plugin-transform-react-remove-prop-types'));
  }
  const userConfig = getBabelRc({ cwd, file: '.babelrc' });

  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets,
          loose,
          modules: 'commonjs',
          exclude,
          ...env,
        },
      ],
      require.resolve('@babel/preset-react'),
      ...userConfig.presets,
    ],
    plugins: [...plugins, ...userConfig.plugins],
  };
}
