import yargs from 'yargs'
import Promise from 'bluebird'
import Config from './config'
require('babel-runtime/core-js/promise').default = Promise
require('colors')
import sh from 'shell-helper'
import { exec, query } from './common'
const PushBullet = require('pushbullet')

export default function Sash (config) {

  async function setup () {
    if (!config.apiKey) {
      await exec(`open https://www.pushbullet.com/#settings`, { doNotAsk: true })
      config.apiKey = await sh.getAnswer('Enter your push bullet access token : ')
    }
    return new PushBullet(config.apiKey)
  }

  async function devices () {
    if (!config.device) {
      const push = await setup()
      const devices = await new Promise((resolve, reject) => {
        push.devices((err, res) => {
          (err && reject(err)) || resolve(res.devices)
        })
      })

      const list = devices.map(device => {
        return `[${device.iden}] - ${device.nickname}`
      })
      const index = await sh.pickList('Pick device to send push : ', list)
      config.device = devices[ index ].iden
    }
  }

  async function push () {
    const push = await setup()
    const id = await devices()
    const title = config.title || (await sh.getAnswer('Please specify push title (default = With ♡) : ')) || 'With ♡'
    const msg = config.msg || (await sh.getAnswer('Please specify push message (default = Task finished) : ')) || 'Task finished'

    config.title = title
    config.msg = msg

    await new Promise((resolve, reject) => {
      push.note(id, title, msg, (err) => {
        err ? reject(err) : resolve()
      })
    })
  }

  return {
    push,
  }
}

function runPush (command) {
  const configKey = 'push'
  const config = Config.getByKey(configKey)
  const argv = yargs.argv

  if (argv.reset) {
    Object.keys(config).forEach(k => delete config[ k ])
    Config.write()
    console.log(`Cleared configuration`)
  }

  const sash = Sash(config)
  sash[ command ]().finally(() => {
    Config.write()
  })
}

module.exports = runPush
