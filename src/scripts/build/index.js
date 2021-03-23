import chalk from 'chalk'
import runBuild from '../../build'

process.env.NODE_ENV = 'production'
runBuild({
  cwd: process.cwd()
}).catch(e => {
  console.error(chalk.red(`Build failed: ${e.message}`))
  console.log(e)
})
