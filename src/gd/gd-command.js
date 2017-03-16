import yargs from 'yargs'
import Promise from 'bluebird'
require('babel-runtime/core-js/promise').default = Promise
import Config from '../config'
import GDSash, { ConfigKey } from './gd'

module.exports = function (command) {
  const argv = yargs.argv
  const config = Config.getByKey("_gd_setting_")

  if (argv.reset) {
    Object.keys(config).forEach(k => delete config[ k ])
    Config.write()
    console.log(`Cleared local configuration for gd`)
  }

  console.log(`Current configuration\n=================`)
  Object.keys(ConfigKey).forEach(k => {
    console.log(`  ${k.yellow} : ${config[ ConfigKey[ k ] ]}`)
  })
  console.log(`=================`)
  const sash = GDSash(config)

  sash[ command ]().finally(() => {
    Config.write()
  })
}

if (require.main === module) {
  module.exports('createDocument')
}
