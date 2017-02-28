import assert from 'assert'
import fs from 'fs'
import path from 'path'
import os from 'os'

export default class Config {
  constructor () {
    this._config = null
    this._configPath = path.join(os.homedir(), '.eden.json')
  }

  initConfig () {
    const configPath = this._configPath
    if (fs.existsSync(configPath)) {
      const stat = fs.statSync(configPath)
      assert(stat.isFile(), 'config file is not a file.')
      this._config = require(configPath)
    } else {
      this._config = {}
    }
  }

  write () {
    fs.writeFileSync(this._configPath, global.JSON.stringify(this._config))
  }

  getByKey (key) {
    if (!this._config[ key ]) {
      this._config[ key ] = {}
    }
    return this._config[ key ]
  }
}

if (require.main === module) {
  const c = new Config()
  c.initConfig()
  c.write()
}

