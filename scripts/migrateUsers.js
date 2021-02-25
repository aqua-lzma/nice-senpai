import { readdirSync, readFileSync, write, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { readUser, writeUser } from '../commands/dabs/utils.js'

const templateUser = readUser('template')
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const userDataDir = join(rootDir, 'data', 'users')
const userFileList = readdirSync(userDataDir).filter(a => a !== '.gitignore' && a !== 'template.json')
const config = JSON.parse(readFileSync(join(rootDir, 'config.json'), 'utf8'))

for (let userFile of userFileList) {
  let userID = userFile.split('.')[0]
  let user = readUser(userID)
  let changed = false
  for (let prop in templateUser) {
    if (!(prop in user)) {
      user[prop] = templateUser[prop]
      changed = true
    }
  }
  if (changed) {
    writeUser(userID, user)
  }
}

if (config.users != null) {
  for (let userID in config.users) {
    let oldUser = config.users[userID]
    let user = readUser(userID)
    user.dabs = oldUser.dabs
    user.highestDabs = oldUser.highestDabs
    user.level = oldUser.level
    writeUser(userID, user)
  }
}
