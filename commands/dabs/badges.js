const thresholdsA = [10000, 100000, 500000, 1000000, 10000000]

/**
 * @typedef Badge
 * @property {string} desc - description of what achieved the badge
 * @property {string} emoji - discord emoji icon for the badge
 */

/**
 * @type {Object.<string, Badge>}
 */
export const badgeMap = {
  dabs1: { desc: 'Have a total of 10,000 dabs.', emoji: '<:that:640311611516518421>' },
  dabs2: { desc: 'Have a total of 100,000 dabs.', emoji: '<:that:640311611516518421>' },
  dabs3: { desc: 'Have a total of 500,000 dabs.', emoji: '<:that:640311611516518421>' },
  dabs4: { desc: 'Have a total of 1,000,000 dabs.', emoji: '<:that:640311611516518421>' },
  dabs5: { desc: 'Have a total of 10,000,000 dabs.', emoji: '<:that:640311611516518421>' },
  nDabs1: { desc: 'Have a total of -10,000 dabs.', emoji: '<:that:640311611516518421>' },
  nDabs2: { desc: 'Have a total of -100,000 dabs.', emoji: '<:that:640311611516518421>' },
  nDabs3: { desc: 'Have a total of -500,000 dabs.', emoji: '<:that:640311611516518421>' },
  nDabs4: { desc: 'Have a total of -1,000,000 dabs.', emoji: '<:that:640311611516518421>' },
  nDabs5: { desc: 'Have a total of -10,000,000 dabs.', emoji: '<:that:640311611516518421>' },
  betWin1: { desc: 'Bet 10,000 dabs in a single bet and win.', emoji: '<:that:640311611516518421>' },
  betWin2: { desc: 'Bet 100,000 dabs in a single bet and win.', emoji: '<:that:640311611516518421>' },
  betWin3: { desc: 'Bet 500,000 dabs in a single bet and win.', emoji: '<:that:640311611516518421>' },
  betWin4: { desc: 'Bet 1,000,000 dabs in a single bet and win.', emoji: '<:that:640311611516518421>' },
  betWin5: { desc: 'Bet 10,000,000 dabs in a single bet and win.', emoji: '<:that:640311611516518421>' },
  betLose1: { desc: 'Lose 10,000 dabs in a single bet.', emoji: '<:that:640311611516518421>' },
  betLose2: { desc: 'Lose 100,000 dabs in a single bet.', emoji: '<:that:640311611516518421>' },
  betLose3: { desc: 'Lose 500,000 dabs in a single bet.', emoji: '<:that:640311611516518421>' },
  betLose4: { desc: 'Lose 1,000,000 dabs in a single bet.', emoji: '<:that:640311611516518421>' },
  betLose5: { desc: 'Lose 10,000,000 dabs in a single bet.', emoji: '<:that:640311611516518421>' }
}

/**
 * Check if user has achieved any new badges
 * - User should already be updated
 * - This function will not update the user
 * @param {NiceUser} user
 * @returns {{badges:[string],messages:[string]}}
 */
export function checkGenericBadges (user) {
  const badges = []
  const messages = []
  for (let i = 0; i < 5; i++) {
    let badgeName = `dabs${i + 1}`
    let badge = badgeMap[badgeName]
    let message = `${badge.emoji} **${badge.desc}** *+0.${i + 1} x daily roll rewards*`
    if (
      !user.badges.includes(badgeName) &&
      user.dabs >= thresholdsA[i]
    ) {
      badges.push(badgeName)
      messages.push(message)
    }
    badgeName = `nDabs${i + 1}`
    badge = badgeMap[badgeName]
    message = `${badge.emoji} **${badge.desc}** *+0.${i + 1} x daily roll rewards*`
    if (
      !user.badges.includes(badgeName) &&
      user.dabs <= -thresholdsA[i]
    ) {
      badges.push(badgeName)
      messages.push(message)
    }
  }
  return { badges, messages }
}

/**
 * Check if user has achieved any new badges after a gamble
 * - User should already be updated
 * - This function will not update the user
 * @param {NiceUser} user
 * @param {number} amount - amount of dabs user bet
 * @param {number} winnings - amount of dabs user won
 * @returns {{badges:[string],messages:[string]}}
 */
export function checkGambleBadges (user, amount, winnings) {
  const { badges, messages } = checkGenericBadges(user)
  for (let i = 0; i < 5; i++) {
    let badgeName = `betWin${i + 1}`
    let badge = badgeMap[badgeName]
    let message = `${badge.emoji} **${badge.desc}** *+0.${i + 1} x daily roll rewards*`
    if (
      !user.badges.includes(badgeName) &&
      amount >= thresholdsA[i] && winnings !== 0
    ) {
      badges.push(badgeName)
      messages.push(message)
    }
    badgeName = `betLose${i + 1}`
    badge = badge = badgeMap[badgeName]
    message = `${badge.emoji} **${badge.desc}** *+0.${i + 1} x daily roll rewards*`
    if (
      !user.badges.includes(badgeName) &&
      amount >= thresholdsA[i] && winnings === 0
    ) {
      badges.push(badgeName)
      messages.push(message)
    }
  }
  return { badges, messages }
}

/**
 * Check if user has achieved any new badges after a daily roll
 * - User should already be updated
 * - This function will not update the user
 * @param {NiceUser} user
 * @param {number} amount - amount of dabs user bet
 * @param {number} winnings - amount of dabs user won
 * @returns {{badges:[string],messages:[string]}}
 */
export function checkDailyRollBadges (user, rolls, winnings) {
  const { badges, messages } = checkGenericBadges(user)
  return { badges, messages }
}
