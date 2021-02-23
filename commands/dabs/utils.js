import { readFileSync, write, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const rootDir = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const userDataDir = join(rootDir, 'data', 'users')
const template = {
  // Overall
  positive: true,
  dabs: 0,
  highestDabs: 0,
  lowestDabs: 0,
  // Levels
  level: 0,
  highestLevel: 0,
  lowestLevel: 0,
  // Daily rolls
  lastClaim: 0,
  claimStreak: 0,
  dailyWins: 0,
  // Gambling
  betTotal: 0,
  betWon: 0,
  // Badges
  badges: []
}

export function readUser (userID) {
  let filePath = join(userDataDir, userID + '.json')
  try {
    let user = JSON.parse(readFileSync(filePath, 'utf8'))
    return user
  } catch {
    writeFileSync(filePath, JSON.stringify(template), 'utf8')
    return { ...template }
  }
}

export function writeUser (userID, userData) {
  let filePath = join(userDataDir, userID + '.json')
  writeFileSync(filePath, JSON.stringify(userData), 'utf8')
}
