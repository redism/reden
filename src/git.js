// BRANCH_NAME=`git branch | grep "^* " | cut -d" " -f 2`
// git push --set-upstream origin $BRANCH_NAME
// open https://github.com/taggledev/peeper/compare/develop...redism:$BRANCH_NAME?expand=0

import assert from 'assert'
import Promise from 'bluebird'
import sh from 'shell-helper'
import { exec as _exec, query } from './common'

require('babel-runtime/core-js/promise').default = Promise
require('colors')

export const ConfigKey = {
  askBeforeRunCommand: 'askBeforeRunCommand',
  syncBranch: 'syncBranch',
  syncRemote: 'syncRemote',
}

function wrapBranchNameSafe(branchName) {
  const alreadyWrap = branchName[0] === '"' && branchName[branchName.length - 1] === '"'
  return alreadyWrap ? branchName : `"${branchName}"`
}

function replaceBranchNameForWeb(branchName) {
  return encodeURIComponent(branchName)
}

export default function GitSash(config) {
  const exec = (command) => _exec(command, { silent: true, doNotAsk: !config.askBeforeRunCommand })

  async function iterateRemote(fn) {
    let remoteNames = (await query('git remote')).split('\n').filter((s) => s.trim().length > 0)
    for (let i = 0; i < remoteNames.length; i++) {
      await Promise.resolve(fn(remoteNames[i]))
    }
  }

  async function iterateLocalBranches(fn) {
    const branches = query('git branch -a')
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .filter((s) => !s.startsWith('*'))
      .filter((s) => !s.startsWith('remotes'))
      .filter((s) => !s.startsWith('develop'))
      .filter((s) => !s.startsWith('master'))

    for (let i = 0; i < branches.length; i++) {
      await Promise.resolve(fn(branches[i]))
    }
  }

  async function getRemoteNameToSync() {
    if (!config[ConfigKey.syncRemote]) {
      const remoteNames = (await query('git remote')).split('\n').filter((s) => s.trim().length > 0)
      config[ConfigKey.syncRemote] =
        remoteNames[await sh.pickList(`Which remote do you want to synchronize? `, remoteNames)]
    }
    return config[ConfigKey.syncRemote]
  }

  async function getLocalBranchToSync() {
    if (!config[ConfigKey.syncBranch]) {
      config[ConfigKey.syncBranch] = await pickLocalBranch(`Which branch do you want to sync? `)
    }
    return config[ConfigKey.syncBranch]
  }

  async function getMasterRepoInfo() {
    const remoteName = await getRemoteNameToSync()
    const comps = (await query(`git remote get-url ${remoteName}`))
      .split('://')[1]
      .split('/')
      .map((s) => s.trim())
    return [comps[1], comps[2].substring(0, comps[2].length - 4)] // remove '.git'
  }

  async function pickLocalBranch(msg) {
    const branches = query('git branch -a')
      .split('\n')
      .map((s) => s.substring(2))
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .filter((s) => !s.startsWith('remotes'))
    return branches[await sh.pickList(msg, branches)]
  }

  function getOriginAccountName() {
    return query('git remote get-url origin').split('://')[1].split('/')[1]
  }

  function hasSomethingToStash() {
    return query('git diff --cached').trim() !== ''
  }

  async function createAndOpenPullRequest() {
    let branchName = query('git branch | grep "^*" | cut -d" " -f 2').trim()
    let accountName = getOriginAccountName()
    const [masterAccount, masterRepo] = await getMasterRepoInfo()
    const syncBranch = await getLocalBranchToSync()
    await exec(`git push --set-upstream origin ${wrapBranchNameSafe(branchName)}`)
    await exec(
      `open https://github.com/${masterAccount}/${masterRepo}/compare/${replaceBranchNameForWeb(
        syncBranch
      )}...${accountName}:${replaceBranchNameForWeb(branchName)}?expand=0`
    )
  }

  async function synchronizeSpecificBranch() {
    return stashDecorator(async () => {
      const remoteName = await getRemoteNameToSync()
      const localBranch = wrapBranchNameSafe(await getLocalBranchToSync())

      console.log(`Checking out ${localBranch.yellow} and merging from ${remoteName.yellow}`)
      await exec(`git checkout ${localBranch}`)
      await exec(`git pull ${remoteName} ${localBranch} --ff-only`)
      await exec(`git remote prune origin`)
    })
  }

  async function stashDecorator(fn) {
    const hasStash = hasSomethingToStash()
    if (hasStash) {
      console.log(`You have local changes. Let's stash first.`)
      await exec(`git stash`)
    }

    try {
      await Promise.resolve(fn())
    } catch (ex) {
      if (hasStash) {
        console.error(`Action threw error!`)
        console.error(ex.stack)
        console.error(`You have stashed changes. But I won't pop it. Do it at your will.`)
      }
      throw ex
    }

    if (hasStash) {
      await exec(`git stash pop`)
    }
  }

  async function mergeDevelopToMasterAndPush() {
    return stashDecorator(async () => {
      const remoteName = await getRemoteNameToSync()
      console.log(`Fast-forwarding ${'develop'.yellow} branch.`)
      await exec(`git checkout develop`)
      await exec(`git pull ${remoteName} develop --ff-only`)
      console.log(`Fast-forwarding ${'master'.yellow} branch.`)
      await exec(`git checkout master`)
      await exec(`git pull ${remoteName} master --ff-only`)
      console.log(`Merging ${'develop'.yellow} into ${'master'.yellow}.`)
      await exec(`git merge develop`)
      console.log(`Pushing master's change to ${remoteName}`)
      await exec(`git push ${remoteName} master`)
      console.log(`Checking out ${'develop'.yellow}`)
      await exec(`git checkout develop`)
    })
  }

  async function pruneFromAllRemotes() {
    return iterateRemote(async (remoteName) => {
      console.log(`Pruning from ${remoteName}`)
      await exec(`git remote prune ${remoteName}`)
    })
  }

  function getSha1Of(name) {
    return query(`git rev-parse ${wrapBranchNameSafe(name)}`).trim()
  }

  function getLogOnelinerBetween(s1, s2) {
    return query(`git log ${s1}..${s2} --oneline`)
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => s.split(' ').slice(1).join(' '))
  }

  async function removeRebasedBranches() {
    await synchronizeSpecificBranch()
    return stashDecorator(async () => {
      return iterateLocalBranches(async (branch) => {
        branch = wrapBranchNameSafe(branch)
        const branchToSync = wrapBranchNameSafe(await getLocalBranchToSync())
        const ancestorSha1 = query(`git merge-base ${branchToSync} ${branch}`).trim()
        const branchSha1 = getSha1Of(branch)
        const logsBranch = getLogOnelinerBetween(ancestorSha1, branchSha1)

        const developSha1 = getSha1Of(branchToSync)
        const logsDev = getLogOnelinerBetween(ancestorSha1, developSha1)

        const isDevContainsAllLogsOfBranch = logsBranch.every((log) => logsDev.indexOf(log) >= 0)
        if (isDevContainsAllLogsOfBranch) {
          console.log(`Local branch [${branch}] seems to have been rebased to ${branchToSync}.`)
          await exec(`git branch -D ${branch}`)
        }
      })
    })
  }

  async function openRepository(numOrString) {
    try {
      const r = query('git remote show origin')
      const lines = r.split('\n')
      const url = lines[1].split('URL:')[1].trim()
      let comps
      if (url.indexOf('https') === 0) {
        comps = url.split('github.com/')[1].split('.git')[0].split('/')
      } else {
        comps = url.split('github.com:')[1].split('.git')[0].split('/')
      }
      assert(comps.length === 2)
      const command = `open https://github.com/${comps[0]}/${comps[1]}`

      if (numOrString.length === 0) {
        await exec(command)
      } else {
        numOrString.forEach((c) => {
          if (c === 'i') {
            exec(`${command}/issues`)
          } else if (c === 'p') {
            exec(`${command}/projects`)
          } else if (c === 'pr') {
            exec(`${command}/pulls`)
          } else {
            exec(`${command}/issues/${c}`)
          }
        })
      }
    } catch (ex) {
      console.error('Failed to find related page. (git remote show origin). FETCH URL, Github Only.')
    }
  }

  return {
    pruneFromAllRemotes,
    removeRebasedBranches,
    createAndOpenPullRequest,
    mergeDevelopToMasterAndPush,
    synchronizeSpecificBranch,
    openRepository,
  }
}
