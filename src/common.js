import sh from 'shell-helper'
import assert from 'assert'
import s from 'shelljs'
require('colors')

export async function exec (command, options) {
  options = Object.assign(options || {}, {
    silent: true,
    doNotAsk: false,
  })

  if (!options.doNotAsk) {
    let ret = await sh.askYesNo(command)
    assert(ret, 'Cancelled by user.')
  }

  console.log(command)
  const r = s.exec(command, { silent: options.silent })
  if (r.code !== 0) {
    console.error(r.stderr)
    throw new Error(`Command [${command}] exited with non-zero ${r.code}`)
  }
  return r.stdout
}

export function query (command, options) {
  options = Object.assign(options || {}, {
    silent: true,
  })

  const r = s.exec(command, { silent: options.silent })
  if (r.code !== 0) {
    console.error(r.stderr)
    throw new Error(`Command [${command}] exited with non-zero ${r.code}`)
  }
  return r.stdout
}
