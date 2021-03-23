import webpack from 'webpack'
import rimraf from 'rimraf'
import assert from 'assert'
import { isPlainObject } from 'lodash'
import { printFileSizesAfterBuild } from 'react-dev-utils/FileSizeReporter'

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

export default function build(opts = {}) {
  const { webpackConfig, cwd = process.cwd(), onSuccess, onFail } = opts
  assert(webpackConfig, 'webpackConfig should be supplied.')
  assert(isPlainObject(webpackConfig), 'webpackConfig should be plain object.')

  // 清空build文件
  rimraf.sync(webpackConfig.output.path)

  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      if (typeof onFail === 'function') {
        onFail({ err, stats })
      }
      process.exit(1)
    }

    console.log('File sizes after gzip:\n')
    printFileSizesAfterBuild(
      stats,
      {
        root: webpackConfig.output.path,
        sizes: {}
      },
      webpackConfig.output.path,
      WARN_AFTER_BUNDLE_GZIP_SIZE,
      WARN_AFTER_CHUNK_GZIP_SIZE
    )
    console.log()

    if (onSuccess) {
      onSuccess({ stats })
    }
  })
}
