// BRANCH_NAME=`git branch | grep "^* " | cut -d" " -f 2`
// git push --set-upstream origin $BRANCH_NAME
// open https://github.com/taggledev/peeper/compare/develop...redism:$BRANCH_NAME?expand=0

import Promise from 'bluebird'
require('babel-runtime/core-js/promise').default = Promise
require('colors')
import assert from 'assert'
import s from 'shelljs'
import sh from 'shell-helper'

export const ConfigKey = {
  askBeforeRunCommand: 'askBeforeRunCommand',
  syncBranch: 'syncBranch',
  syncRemote: 'syncRemote',
}

let config = {}

export function setConfig (c) {
  Object.assign(config, c)
}

export async function exec (command, silent = true, doNotAsk = false) {
  if (!doNotAsk && config[ ConfigKey.askBeforeRunCommand ]) {
    let ret = await sh.askYesNo(command)
    assert(ret, 'Cancelled by user.')
  }

  console.log(command)
  const r = s.exec(command, { silent })
  if (r.code !== 0) {
    console.error(r.stderr)
    throw new Error(`Command [${command}] exited with non-zero ${r.code}`)
  }
  return r.stdout
}

export function query (command, silent = true) {
  const r = s.exec(command, { silent })
  if (r.code !== 0) {
    console.error(r.stderr)
    throw new Error(`Command [${command}] exited with non-zero ${r.code}`)
  }
  return r.stdout
}

async function iterateRemote (fn) {
  let remoteNames = (await query('git remote')).split('\n').filter(s => s.trim().length > 0)
  for (let i = 0; i < remoteNames.length; i++) {
    await Promise.resolve(fn(remoteNames[ i ]))
  }
}

async function iterateLocalBranches (fn) {
  const branches = query('git branch -a').split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter(s => !s.startsWith('*'))
    .filter(s => !s.startsWith('remotes'))
    .filter(s => !s.startsWith('develop'))
    .filter(s => !s.startsWith('master'))

  for (let i = 0; i < branches.length; i++) {
    await Promise.resolve(fn(branches[ i ]))
  }
}

async function getRemoteNameToSync (config) {
  if (!config[ ConfigKey.syncRemote ]) {
    const remoteNames = (await query('git remote')).split('\n').filter(s => s.trim().length > 0)
    config[ ConfigKey.syncRemote ] = remoteNames[ await sh.pickList(`Which remote do you want to synchronize? `, remoteNames) ]
  }
  return config[ ConfigKey.syncRemote ]
}

async function getLocalBranchToSync (config) {
  if (!config[ ConfigKey.syncBranch ]) {
    config[ ConfigKey.syncBranch ] = await pickLocalBranch(`Which branch do you want to sync? `)
  }
  return config[ ConfigKey.syncBranch ]
}

async function getMasterRepoInfo (config) {
  const remoteName = await getRemoteNameToSync(config)
  const comps = (await query(`git remote get-url ${remoteName}`)).split(':')[ 1 ].split('/').map(s => s.trim())
  return [ comps[ 0 ], comps[ 1 ].substring(0, comps[ 1 ].length - 4) ] // remove '.git'
}

async function pickLocalBranch (msg) {
  const branches = query('git branch -a').split('\n')
    .map(s => s.substring(2))
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .filter(s => !s.startsWith('remotes'))
  return branches[ await sh.pickList(msg, branches) ]
}

function getOriginAccountName () {
  return query('git remote get-url origin').split(':')[ 1 ].split('/')[ 0 ]
}

function hasSomethingToStash () {
  return query('git diff').trim() !== ''
}

export async function createAndOpenPullRequest (config) {
  let branchName = query('git branch | grep "^*" | cut -d" " -f 2').trim()
  let accountName = getOriginAccountName()
  const [ masterAccount, masterRepo ] = await getMasterRepoInfo(config)
  const syncBranch = await getLocalBranchToSync(config)
  await exec(`git push --set-upstream origin ${branchName}`)
  await exec(`open https://github.com/${masterAccount}/${masterRepo}/compare/${syncBranch}...${accountName}:${branchName}?expand=0`)
}

export async function synchronizeSpecificBranch (config) {
  return stashDecorator(async () => {
    const remoteName = await getRemoteNameToSync(config)
    const localBranch = await getLocalBranchToSync(config)

    console.log(`Checking out ${localBranch.yellow} and merging from ${remoteName.yellow}`)
    await exec(`git checkout ${localBranch}`)
    await exec(`git pull ${remoteName} ${localBranch} --ff-only`)
    await exec(`git remote prune origin`)
  })
}

async function stashDecorator (fn) {
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

export async function mergeDevelopToMasterAndPush (config) {
  return stashDecorator(async () => {
    const remoteName = await getRemoteNameToSync(config)
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

export async function pruneFromAllRemotes () {
  return iterateRemote(async (remoteName) => {
    console.log(`Pruning from ${remoteName}`)
    await exec(`git remote prune ${remoteName}`)
  })
}

function getSha1Of (name) {
  return query(`git rev-parse ${name}`).trim()
}

function getLogOnelinerBetween (s1, s2) {
  return query(`git log ${s1}..${s2} --oneline`).split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => s.split(' ').slice(1).join(' '))
}

export async function removeRebasedBranches (config) {
  await synchronizeSpecificBranch(config)
  return stashDecorator(async () => {
    return iterateLocalBranches(async (branch) => {
      const branchToSync = await getLocalBranchToSync(config)
      const ancestorSha1 = query(`git merge-base ${branchToSync} ${branch}`).trim()
      const branchSha1 = getSha1Of(branch)
      const logsBranch = getLogOnelinerBetween(ancestorSha1, branchSha1)

      const developSha1 = getSha1Of(branchToSync)
      const logsDev = getLogOnelinerBetween(ancestorSha1, developSha1)

      const isDevContainsAllLogsOfBranch = logsBranch.every(log => logsDev.indexOf(log) >= 0)
      if (isDevContainsAllLogsOfBranch) {
        console.log(`Local branch [${branch}] seems to have been rebased to ${branchToSync}.`)
        await exec(`git branch -D ${branch}`)
      }
    })
  })
}

