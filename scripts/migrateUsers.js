import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { readUser, writeUser } from '../commands/dabs/utils.js'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const userDataDir = join(rootDir, 'data', 'users')
const userList = readdirSync(userDataDir).filter(a => a !== '.gitignore')
const config = JSON.parse(readFileSync(join(rootDir, 'config.json'), 'utf8'))

for (let user of userList) {
  let filePath = join('/')
}

if (config.users != null) {
  for (let userID in config.users) {

  }
}
