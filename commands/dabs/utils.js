import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { templateUser } from '../../typedefs.js'

const rootDir = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const userDataDir = join(rootDir, 'data', 'users')

/**
 * Converts a string of numbers to Discord number emojis
 * @param {string} string
 */
export function emojiNumbers (string) {
  return string
    .replace(/0/g, ':zero:')
    .replace(/1/g, ':one:')
    .replace(/2/g, ':two:')
    .replace(/3/g, ':three:')
    .replace(/4/g, ':four:')
    .replace(/5/g, ':five:')
    .replace(/6/g, ':six:')
    .replace(/7/g, ':seven:')
    .replace(/8/g, ':eight:')
    .replace(/9/g, ':nine:')
}

/**
 * Format number to string SI suffix and a width of 5
 * @param {number} n
 */
export function formatNumber (n) {
  let s = `    ${n}`
  s = s.slice(-5)
  return s
}

/**
 * Read user from file
 * @param {string} userID
 * @returns {NiceUser} user object tied to ID
 */
export function readUser (userID) {
  const filePath = join(userDataDir, userID + '.json')
  try {
    const user = JSON.parse(readFileSync(filePath, 'utf8'))
    return user
  } catch {
    writeFileSync(filePath, JSON.stringify(templateUser), 'utf8')
    return { ...templateUser }
  }
}

/**
 * Save user to file
 * @param {string} userID
 * @param {NiceUser} userData
 */
export function saveUser (userID, userData) {
  const filePath = join(userDataDir, userID + '.json')
  writeFileSync(filePath, JSON.stringify(userData), 'utf8')
}

/**
 * Gambling restrictions check
 * @param {number} amount - bet amount
 * @param {number} dabs - current dabs user has
 * @returns {string?} `null` if ok, otherwise `string` reason for failure
 */
export function validateGambleInput (amount, dabs) {
  if (dabs === 0) return 'Cannot bet while holding 0 dabs.'
  if (amount < 0 && dabs > 0) return 'Cannot bet negative dabs while holding a positive amount.'
  if (amount > 0 && dabs < 0) return 'Cannot bet positive dabs while holding a negative amount.'
  if (
    (dabs > 0 && amount > dabs) ||
    (dabs < 0 && amount < dabs)
  ) return 'Not enough dabs.'
}
