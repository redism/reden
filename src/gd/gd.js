import path from 'path'
import _ from 'lodash'
import fs from 'fs'
import sh from 'shell-helper'
import assert from 'assert'
import { exec as _exec, query } from '../common'

export const ConfigKey = {
  GoogleDriveLocalPath: 'GoogleDriveLocalPath',
}

function ensureDirectory (root, pathComp) {
  const p = path.join(root, pathComp)
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p)
  } else if (!isDirectory(p)) {
    throw new Error(`Path : ${p} is NOT a directory.`)
  }
  return p
}

function isDirectory (path) {
  if (!fs.existsSync(path)) {
    return false
  }

  try {
    const stat = fs.lstatSync(path)
    return stat.isDirectory()
  } catch (ex) {
    console.error(ex)
    return false
  }
}

export default function GDSash (config) {

  const dir = {
    root: null,
    template: null,
    inbox: null,
    archive: null,
    json: null,
  }

  let db = {
    seq: 1,
    linkMap: {},    // key : link, value : document link.
  }

  async function openDB () {
    // read or create .gd-info.json
    const configPath = dir.json
    if (fs.existsSync(configPath)) {
      const stat = fs.statSync(configPath)
      assert(stat.isFile(), 'config file is not a file.')
      db = require(configPath)
    }
  }

  async function saveDB () {
    fs.writeFileSync(dir.json, global.JSON.stringify(db))
  }

  async function init () {
    const msg = 'Please specify local directory path synced by google drive : '
    let rootDir = config[ ConfigKey.GoogleDriveLocalPath ]

    // ensuring google drive local path.
    do {
      if (!isDirectory(rootDir)) {
        rootDir = await sh.getAnswer(msg)
        if (!fs.existsSync(rootDir)) {
          const r = await sh.askYesNo(`Path [${rootDir}] does not exist. Create one? `)
          if (r) {
            ensureDirectory(rootDir)
          }
        }

        if (isDirectory(rootDir)) {
          config[ ConfigKey.GoogleDriveLocalPath ] = rootDir
          break
        }
      } else {
        break
      }
    } while (true)

    // ensure sub-directory existence.
    dir.root = rootDir
    dir.template = ensureDirectory(rootDir, 'Templates')
    dir.inbox = ensureDirectory(rootDir, 'Inbox')
    dir.archive = ensureDirectory(rootDir, 'Archive')
    dir.json = path.join(rootDir, '.gd-info.json')

    console.log(`Templates directory : ${dir.template.yellow}`)
    console.log(`Inbox directory : ${dir.inbox.yellow}`)
    console.log(`Archive directory : ${dir.archive.yellow}`)
    console.log(`.gd-info.json location : ${dir.json.yellow}`)
    console.log('')

    await openDB()
  }

  async function pickTemplate () {
    const list = fs.readdirSync(dir.template)
      .filter(p => {
        return fs.lstatSync(path.join(dir.template, p)).isFile()
      })

    const r = await sh.pickList('Pick a template : ', list)
    return path.join(dir.template, list[ r ])
  }

  async function getLinkToken (link) {
    return link
  }

  async function createDocument (link) {
    await init()
    const linkToken = await getLinkToken(await sh.getAnswer('Which link do you want to map document to? '))

    const existing = db.linkMap[ linkToken ]

    if (existing) {
      console.log(`Document for given link already exists. Opening the document.`)
      await _exec(`open -R "${existing}"`, { doNotAsk: true })
    } else {
      const templatePath = await pickTemplate()
      let title = ''
      while (title === '') {
        title = await sh.getAnswer('Please enter the title : ')
      }
      const seq = db.seq++
      const now = new Date()

      const titlePrefix = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}-${_.padStart(seq, 5, '0')} ${title}`
      const fullFileName = `${titlePrefix}${path.extname(templatePath)}`
      console.log(`Copying [${fullFileName.yellow}] to the Inbox.`)

      const fullPath = path.join(dir.inbox, fullFileName)
      await _exec(`cp "${templatePath}" "${fullPath}"`, { doNotAsk: true })
      // const docData = global.JSON.parse(fs.readFileSync(fullPath))

      db.linkMap[ linkToken ] = fullPath
      await _exec(`open -R "${fullPath}"`, { doNotAsk: true })
      await saveDB()
    }
  }

  return {
    init,
    createDocument,
  }
}
