import yargs from 'yargs'
import Promise from 'bluebird'
require('babel-runtime/core-js/promise').default = Promise
import Config from './config'
import {
  query,
  ConfigKey,
  createAndOpenPullRequest,
  synchronizeSpecificBranch,
  mergeDevelopToMasterAndPush,
  pruneFromAllRemotes,
  removeRebasedBranches,
  setConfig,
} from './git'

const argv = yargs.argv
let fn = () => Promise.resolve()

const db = new Config()
db.initConfig()
const gitRoot = query('git rev-parse --show-toplevel').trim()
const config = db.getByKey(gitRoot)

if (argv.reset) {
  Object.keys(config).forEach(k => delete config[ k ])
  db.write()
  console.log(`Cleared configuration for git root [${gitRoot.yellow}]`)
}

if (argv.y) {
  config[ ConfigKey.askBeforeRunCommand ] = false
} else if (config[ ConfigKey.askBeforeRunCommand ] === undefined) {
  config[ ConfigKey.askBeforeRunCommand ] = true
}

console.log(`Current configuration\n=================`)
Object.keys(ConfigKey).forEach(k => {
  console.log(`  ${k.yellow} : ${config[ ConfigKey[ k ] ]}`)
})
console.log(`=================`)

setConfig(config)

let commandMap = {
  'pr': createAndOpenPullRequest,
  'sync': synchronizeSpecificBranch,
  'master': mergeDevelopToMasterAndPush,
  'prune': pruneFromAllRemotes,
  'pp': removeRebasedBranches,
}

module.exports = function (command) {
  let fn = commandMap[ command ]
  if (!fn) {
    console.log(`Usage.\n
  pr     : create a pull request from current local branch.
  sync   : pull (fast-forward) from main remote.
  master : fast-forward develop and master branches, and merge develop into master.
  prune  : prune from all remotes.
  pp     : sync and remove rebased local branches. (compared by commit message)
  reset  : reset configuration for current git-root.
  y      : (yes) don't ask before command. (will be saved to configuration)
`)
  } else {
    fn(config).finally(() => {
      db.write()
    })
  }
}


