export default function(webpackConfig, opts) {
  webpackConfig.devtool(opts.devtool || 'cheap-module-source-map').output.pathinfo(true);

  // eslint-disable-next-line global-require
  webpackConfig.plugin('hmr').use(require('webpack/lib/HotModuleReplacementPlugin'));

  webpackConfig.when(!!opts.devServer, webpackConfig => {
    webpackConfig.merge({ devServer: opts.devServer });
  });
}
