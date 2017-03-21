import yargs from 'yargs'
import Promise from 'bluebird'
import sh from 'shell-helper'
require('babel-runtime/core-js/promise').default = Promise
import Config from '../config'
import GDSash, { ConfigKey } from './gd'

module.exports = function (command) {
  const argv = yargs.argv
  const config = Config.getByKey("_gd_setting_")

  const COMMANDS = [
    { cmd: 'createDocument', desc: 'Create a new document from a link.' },
    { cmd: 'openDocument', desc: 'List all inbox documents and open a document.' },
  ]

  let getCommand = () => Promise.resolve(command)
  if (!command) {
    getCommand = () => sh.pickList('What to do? ', COMMANDS.map(x => `[${x.cmd}] ${x.desc}`))
      .then(index => COMMANDS[ index ].cmd)
  }

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

  Promise.resolve(getCommand())
    .then(x => {
      console.log(x)
      return x
    })
    .then(command => sash[ command ]()).finally(() => {
    Config.write()
  })
}

if (require.main === module) {
  module.exports()
}
