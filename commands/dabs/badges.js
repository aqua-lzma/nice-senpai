/**
 * @type {Object.<string, [string, string]>}
 * - Key: badge name
 * - List[0]: description
 * - List[1]: emoji string
 */
export const badgeDescriptions = {
  'dabs1': ['Have a total of 10,000 dabs.', 'emoji'],
  'dabs2': ['Have a total of 100,000 dabs.', 'emoji'],
  'dabs3': ['Have a total of 500,000 dabs.', 'emoji'],
  'dabs4': ['Have a total of 1,000,000 dabs.', 'emoji'],
  'dabs5': ['Have a total of 10,000,000 dabs.', 'emoji'],
  '-dabs1': ['Have a total of -10,000 dabs.', 'emoji'],
  '-dabs2': ['Have a total of -100,000 dabs.', 'emoji'],
  '-dabs3': ['Have a total of -500,000 dabs.', 'emoji'],
  '-dabs4': ['Have a total of -1,000,000 dabs.', 'emoji'],
  '-dabs5': ['Have a total of -10,000,000 dabs.', 'emoji'],
  'betWin1': ['Bet 10,000 dabs in a single bet and win.', 'emoji'],
  'betWin2': ['Bet 100,000 dabs in a single bet and win.', 'emoji'],
  'betWin3': ['Bet 500,000 dabs in a single bet and win.', 'emoji'],
  'betWin4': ['Bet 1,000,000 dabs in a single bet and win.', 'emoji'],
  'betWin5': ['Bet 10,000,000 dabs in a single bet and win.', 'emoji'],
  'betLose1': ['Lose 10,000 dabs in a single bet.', 'emoji'],
  'betLose2': ['Lose 100,000 dabs in a single bet.', 'emoji'],
  'betLose3': ['Lose 500,000 dabs in a single bet.', 'emoji'],
  'betLose4': ['Lose 1,000,000 dabs in a single bet.', 'emoji'],
  'betLose5': ['Lose 10,000,000 dabs in a single bet.', 'emoji'],
}

/**
 * Check if user has achieved any new badges
 * - User should already be updated
 * - This function will not update the user
 * @param {NiceUser} user
 * @returns {[string]} new badges user has achieved, empty if none
 */
export function checkGenericBadges (user) {
  let badges = []
  [10000, 100000, 500000, 1000000, 10000000].map((threshold, index) => {
    if (
      !user.badges.includes(`dabs${index + 1}`) &&
      user.dabs > threshold
    ) badges.push(`dabs${index + 1}`)
  })
  [-10000, -100000, -500000, -1000000, -10000000].map((threshold, index) => {
    if (
      !user.badges.includes(`-dabs${index + 1}`) &&
      user.dabs < threshold
    ) badges.push(`-dabs${index + 1}`)
  })
  return badges
}

/**
 * Check if user has achieved any new badges
 * - User should already be updated
 * - This function will not update the user
 * @param {NiceUser} user
 * @param {number} amount - amount of dabs user bet
 * @param {number} winnings - amount of dabs user won
 * @returns {[string]} new badges user has achieved, empty if none
 */
export function checkGambleBadges (user, amount, winnings) {
  let badges = checkGenericBadges(user)
  [10000, 100000, 500000, 1000000, 10000000].map((threshold, index) => {
    if (
      !user.badges.includes(`betWin${index + 1}`) &&
      amount > threshold && winnings !== 0
    ) badges.push(`betWin${index + 1}`)
  })
  [10000, 100000, 500000, 1000000, 10000000].map((threshold, index) => {
    if (
      !user.badges.includes(`betLose${index + 1}`) &&
      amount > threshold && winnings === 0
    ) badges.push(`betLose${index + 1}`)
  })
  return badges
}
