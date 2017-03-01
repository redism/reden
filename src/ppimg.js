import Promise from 'bluebird'
require('babel-runtime/core-js/promise').default = Promise
import sh from 'shell-helper'
import fs from 'fs'
import os from 'os'
import path from 'path'
import yargs from 'yargs'
import { exec } from './common'

export default function ImagePostProcessor () {
  const desktop = path.join(os.homedir(), 'Desktop')

  function getLatestNScreenCaptures (num) {
    const files = fs.readdirSync(desktop)
    return files.filter(s => s.endsWith('.png'))
      .map(f => {
        return [ f, fs.statSync(path.join(desktop, f)) ]
      })
      .sort((a, b) => b[ 1 ].ctime - a[ 1 ].ctime)
      .map(f => f[ 0 ])
      .slice(0, num)
  }

  async function downsizeImage (size, srcPath, dstPath) {
    const sizeOption = size <= 0 ? '' : `-Z ${size}`
    return exec(`sips -s format jpeg ${sizeOption} "${srcPath}" --out "${dstPath}"`, { doNotAsk: true })
  }

  async function process () {
    const options = {}
    const argv = yargs.argv

    if (argv.i) { // interactive
      const n = await sh.getAnswer('How many recent captures? ')
      const size = await sh.getAnswer('Target size (0 for original)? ')
      options.num = parseInt(n, 10)
      options.removeAfter = await sh.askYesNo('Remove original images? ')
      options.size = parseInt(size, 10)
    } else if (yargs.o) {
      options.num = 1
      options.removeAfter = false
      options.size = 0
    } else {
      options.num = 1
      options.removeAfter = false
      options.size = 640
    }

    const files = getLatestNScreenCaptures(options.num)
    const dsts = []
    const lpad = (str, len) => ('0'.repeat(len) + str).substring(Math.min(str.length, len));
    for (let i = 0; i < files.length; i++) {
      const f = files[ i ]
      const src = path.join(desktop, f)
      const dst = path.join(desktop, files.length == 1 ? `screen.jpg` : `screen_${lpad(i + 1, 2)}.jpg`)
      await downsizeImage(options.size, src, dst)
      if (options.removeAfter) {
        await exec(`rm -f ${src}`, { doNotAsk: true })
      }
      dsts.push(dst)
    }

    return exec(`open -R ${dsts.map(s => `"${s}"`).join(' ')}`, { doNotAsk: true })
  }

  return {
    getLatestNScreenCaptures,
    process,
  }
}
