import { readdirSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { readUser, writeUser } from '../commands/dabs/utils.js'

const templateUser = readUser('template')
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const userDataDir = join(rootDir, 'data', 'users')
const userFileList = readdirSync(userDataDir).filter(a => a !== '.gitignore' && a !== 'template.json')
const config = JSON.parse(readFileSync(join(rootDir, 'config.json'), 'utf8'))

for (const userFile of userFileList) {
  const userID = userFile.split('.')[0]
  const user = readUser(userID)
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
  for (const userID in config.users) {
    const oldUser = config.users[userID]
    const user = readUser(userID)
    user.dabs = oldUser.dabs
    user.highestDabs = oldUser.dab_record
    user.level = oldUser.level
    writeUser(userID, user)
  }
}
