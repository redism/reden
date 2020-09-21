import Promise from 'bluebird'
import yargs from 'yargs'
import { query } from './common'
import Config from './config'
import GitSash, { ConfigKey } from './git'

require('babel-runtime/core-js/promise').default = Promise

const argv = yargs.argv

const gitRoot = query('git rev-parse --show-toplevel').trim()
const config = Config.getByKey(gitRoot)

if (argv.reset) {
  Object.keys(config).forEach((k) => delete config[k])
  Config.write()
  console.log(`Cleared configuration for git root [${gitRoot.yellow}]`)
}

if (argv.y) {
  config[ConfigKey.askBeforeRunCommand] = false
} else if (config[ConfigKey.askBeforeRunCommand] === undefined) {
  config[ConfigKey.askBeforeRunCommand] = true
}

console.log(`Current configuration\n=================`)
Object.keys(ConfigKey).forEach((k) => {
  console.log(`  ${k.yellow} : ${config[ConfigKey[k]]}`)
})
console.log(`=================`)

let commandMap = {
  pr: 'createAndOpenPullRequest',
  sync: 'synchronizeSpecificBranch',
  master: 'mergeDevelopToMasterAndPush',
  prune: 'pruneFromAllRemotes',
  pp: 'removeRebasedBranches',
  open: 'openRepository',
}

module.exports = function (command) {
  let fn = commandMap[command]
  if (!fn) {
    console.log(`Usage.\n
  pr     : create a pull request from current local branch.
  sync   : pull (fast-forward) from main remote.
  master : fast-forward develop and master branches, and merge develop into master.
  pa     : prune from all remotes.
  pp     : sync and remove rebased local branches. (compared by commit message)
  reset  : reset configuration for current git-root.
  open   : open related github repository.
  y      : (yes) don't ask before command. (will be saved to configuration)
`)
  } else {
    const sash = GitSash(config)

    sash[fn](argv._).finally(() => {
      Config.write()
    })
  }
}
