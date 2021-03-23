import fs from 'fs';
import openBrowser from 'react-dev-utils/openBrowser';
import webpack from 'webpack';
import assert from 'assert';
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import prepareUrls from './prepareUrls';
import clearConsole from '../common/clearConsole';
import errorOverlayMiddleware from './errorOverlayMiddleware';
import send, { STARTING, DONE } from './send';
import choosePort from './choosePort';

const isInteractive = process.stdout.isTTY; //nodejs否在 TTY 上下文中运行
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 8000;
const HOST = process.env.HOST || '0.0.0.0';
const PROTOCOL = process.env.HTTPS ? 'https' : 'http';
const CERT = process.env.HTTPS && process.env.CERT ? fs.readFileSync(process.env.CERT) : '';
const KEY = process.env.HTTPS && process.env.KEY ? fs.readFileSync(process.env.KEY) : '';
const noop = () => {};

process.env.NODE_ENV = 'development';

export default function dev({
  webpackConfig,
  _beforeServerWithApp,
  beforeMiddlewares,
  afterMiddlewares,
  beforeServer,
  afterServer,
  contentBase,
  onCompileDone = noop,
  proxy,
  port,
  base,
  serverConfig: serverConfigFromOpts = {},
}) {
  assert(webpackConfig, 'webpackConfig must be supplied');
  choosePort(port || DEFAULT_PORT)
    .then(port => {
      if (port === null) {
        return;
      }

      const compiler = webpack(webpackConfig);

      let isFirstCompile = true;
      const IS_CI = !!process.env.CI;
      const SILENT = !!process.env.SILENT;
      const urls = prepareUrls(PROTOCOL, HOST, port, base);
      compiler.hooks.done.tap('zus dev', stats => {
        if (stats.hasErrors()) {
          if (process.env.SYSTEM_BELL !== 'none') {
            process.stdout.write('\x07'); // 蜂鸣响铃
          }
          return;
        }

        if (isFirstCompile && !IS_CI && !SILENT) {
          console.log();
          console.log(
            [
              `  App running at:`,
              `  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`,
              `  - Network: ${chalk.cyan(urls.lanUrlForTerminal)}`,
            ].join('\n'),
          );
          console.log();
        }

        onCompileDone({
          isFirstCompile,
          stats,
        });

        if (isFirstCompile) {
          isFirstCompile = false;
          openBrowser(urls.localUrlForBrowser);
          send({ 'zus:server': DONE });
        }
      });

      const serverConfig = {
        disableHostCheck: true,
        compress: true,
        clientLogLevel: 'none',
        hot: true,
        quiet: true,
        headers: {
          'access-control-allow-origin': '*',
        },
        publicPath: webpackConfig.output.publicPath,
        watchOptions: {
          ignored: /node_modules/,
        },
        historyApiFallback: true,
        overlay: false,
        host: HOST,
        proxy,
        https: !!process.env.HTTPS,
        cert: CERT,
        key: KEY,
        contentBase: contentBase || process.env.CONTENT_BASE,
        before(app) {
          (beforeMiddlewares || []).forEach(middleware => {
            app.use(middleware);
          });
          // internal usage for proxy
          if (_beforeServerWithApp) {
            _beforeServerWithApp(app);
          }
          app.use(errorOverlayMiddleware());
        },
        after(app) {
          (afterMiddlewares || []).forEach(middleware => {
            app.use(middleware);
          });
        },
        ...serverConfigFromOpts,
        ...(webpackConfig.devServer || {}),
      };
      const server = new WebpackDevServer(compiler, serverConfig);

      ['SIGINT', 'SIGTERM'].forEach(signal => {
        process.on(signal, () => {
          server.close(() => {
            process.exit(0);
          });
        });
      });

      if (beforeServer) {
        beforeServer(server);
      }

      server.listen(port, HOST, err => {
        if (err) {
          console.log(err);
          return;
        }
        if (isInteractive) {
          clearConsole();
        }
        send({ 'zus:server': STARTING });
        if (afterServer) {
          afterServer(server, port);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
}
