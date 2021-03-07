/**
 * @module dabs-daily-roll-action Response generator for `dabs daily-roll` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../../typedefs.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'
import { checkDailyRollBadges } from '../badges.js'
import {
  dubsFlavour,
  emojiNumbers,
  formatNumber,
  readUser,
  saveUser
} from '../utils.js'

/**
 * Calculate multiplier based on streak
 * @param {number} days - days in the streak
 */
function calcStreakBonus (days) {
  if (days === 0) return 1
  return ((
    (days % 7 === 0 ? 2 : 1) *
    (days % 14 === 0 ? 2.5 : 1) *
    (days % 28 === 0 ? 5 : 1)
  ) + (
    days > 28 ? (days - 28) / 10 : 0
  ))
}

/**
 * Generate rolls and return 6 lists of rolls per win time from singles to sextuples
 * @param {number} nRolls - number of rolls to generate
 * @returns {[[number]]}
 */
function doRolls (nRolls) {
  const rolls = [[], [], [], [], [], []]
  for (let i = 0; i < nRolls; i++) {
    const roll = Math.floor(Math.random() * 1000000)
    const sRoll = String(roll)
    let win = 0
    for (let c = 5; c > 0; c--) {
      if (sRoll[c] === sRoll[c - 1]) win += 1
      else break
    }
    rolls[win].push(roll)
  }
  return rolls
}

/**
 * Enum for InteractionResponseType values.
 * @readonly
 * @enum {number}
 */
const CommandOptionType = {
  Pong: 1, // ACK a Ping
  Acknowledge: 2, // ACK a command without sending a message, eating the user's input
  ChannelMessage: 3, // respond with a message, eating the user's input
  ChannelMessageWithSource: 4, // respond with a message, showing the user's input
  AcknowledgeWithSource: 5 // ACK a command without sending a message, showing the user's input
}

/**
 * Respond to command trigger
 * @param {Client} client - bot client
 * @param {Interaction} interaction - interaction that triggered the command
 * @returns {InteractionResponse} interaction to send back
 */
export default async function (client, interaction) {
  const embed = await generateEmbedTemplate(client, interaction)
  const userID = interaction.member.user.id
  const user = readUser(userID)
  const today = Math.floor((new Date()).getTime() / (1000 * 60 * 60 * 24))
  const daysPassed = today - user.lastClaim
  const claimStreak = daysPassed === 1 ? user.claimStreak + 1 : 0

  embed.title = '**Daily roll:**'
  if (daysPassed !== 0) {
    const rolls = doRolls(Math.abs(user.level) + 10)
    // Calculate bonus from badges based on badge number
    let multiplier = user.badges.reduce((acc, val) => acc + Number(`0.${val[val.length - 1]}`), 0)
    multiplier += calcStreakBonus(claimStreak)
    // Rounding that hurts my brain, but in this number shouldn't ever be more than 1 decimal place
    multiplier = Math.round((multiplier + Number.EPSILON) * 10) / 10
    // Winnings
    let winnings = Math.floor((
      (rolls[0].length) +
      (rolls[1].length * 22) +
      (rolls[2].length * 333) +
      (rolls[3].length * 5555) +
      (rolls[4].length * 77777) +
      (rolls[5].length * 999999)
    ) * multiplier)
    if (!user.positive) winnings = -winnings
    embed.description = [
      `Dabs won: **${formatNumber(winnings)}**`,
      '```md',
      `<Rolls ${formatNumber(user.level + 10)}> <Streak ${formatNumber(claimStreak)}>`,
      `<Multi ${formatNumber(multiplier)}>`,
      '```'
    ].join('\n')
    // Highlights
    let highestRoll, highlights
    for (let i = 5; i >= 0; i--) {
      highestRoll = i + 1
      if (i !== 0) {
        if (rolls[i].length === 0) continue
        highlights = dubsFlavour(i) + '\n'
        highlights += rolls[i].slice(0, 5).map(num => {
          const roll = String(num).padStart(6, 0)
          return emojiNumbers(roll, 'dancing')
        }).join('\n')
        break
      } else {
        highlights = 'None!'
      }
    }
    embed.fields.push({
      name: '**Highlights:**',
      value: highlights
    })
    // Breakdown
    const breakdown = [
      `<Singles ${formatNumber(rolls[0].length)}>`,
      `<Doubles ${formatNumber(rolls[1].length)}>`,
      `<Triples ${formatNumber(rolls[2].length)}>`,
      `<Quads   ${formatNumber(rolls[3].length)}>`,
      `<Quints  ${formatNumber(rolls[4].length)}>`,
      `<Sextups ${formatNumber(rolls[5].length)}>`
    ].slice(0, highestRoll).join('\n')
    embed.fields.push({
      name: '**Breakdown:**',
      value: [
        '```md',
        breakdown,
        '```'
      ].join('\n')
    })

    user.dabs += winnings
    user.highestDabs = Math.max(user.highestDabs, user.dabs)
    user.lowestDabs = Math.min(user.lowestDabs, user.dabs)
    user.lastClaim = today
    user.claimStreak = claimStreak
    user.dailyWins += winnings
    for (let i = 0; i < 6; i++) {
      user.history[i] += rolls[i].length
    }
    const { badges, messages } = checkDailyRollBadges(user, rolls, winnings)
    if (badges.length !== 0) {
      for (const badge of badges) user.badges.push(badge)
      embed.fields.push({
        name: '**Badges earned:**',
        value: messages.join('\n')
      })
    }
    user.badges.sort()
    saveUser(userID, user)
  } else {
    embed.description = 'Already rolled today.'
    embed.colour = 0xff0000
  }
  return {
    type: CommandOptionType.ChannelMessage,
    data: {
      embeds: [embed]
    }
  }
}
