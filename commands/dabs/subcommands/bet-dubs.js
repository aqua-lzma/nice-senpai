/**
 * @module bet-dubs-action Response generator for template command
 */
import { Client } from 'discord.js'
import '../../../typedefs.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'
import {
  readUser,
  writeUser,
  emojiNumbers,
  validateGambleInput,
} from '../utils.js'
import { badgeDescriptions, checkGambleBadges } from '../badges.js'

function doGamble (amount) {
  let number = Math.floor(Math.random() * 1000000)
  let roll = `00000${number}`.slice(-6)
  let dubs = 0
  for (let c = 5; c > 0; c--) {
    if (roll[c] === roll[c-1]) dubs += 1
    else break
  }
  let [flavour, multiplier] = [
    ['Singles, no payout.', 0],
    ['*Dubs!*', 5],
    ['**Trips!**', 20],
    ['**QUADS!**', 50],
    ['***QUINTUPLES!!!***', 500],
    ['***S E X T U P L E S ! ! !***', 5000],
  ][dubs]
  let winnings = amount * multiplier
  return [roll, flavour, winnings]
  return [[
    emojiNumbers(roll),
    flavour,
    `Winnings: **${winnings} dabs**`
  ].join('\n'), winnings]
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
  let embed = await generateEmbedTemplate(client, interaction)
  let amount = interaction.data.options[0].options[0].value
  embed.title = `Bet dubs: ${amount}`
  let user = readUser(interaction.member.user.id)
  if (amount === 0) amount = user.dabs
  let error = validateGambleInput(amount, user.dabs)

  if (error == null) {
    let [roll, flavour, winnings] = doGamble(amount)
    embed.description = [
      emojiNumbers(roll),
      flavour,
      `Winnings: **${winnings} dabs**`
    ].join('\n')
    embed.description = description
    user.dabs -= amount
    user.dabs += winnings
    user.highestDabs = Math.max(user.highestDabs, user.dabs)
    user.lowestDabs = Math.min(user.lowestDabs, user.dabs)
    user.betTotal += Math.abs(amount)
    user.betWon += Math.abs(winnings)
    let badges = checkGambleBadges(user, amount, winnings)
    for (let badge of badges) {
      user.badges.push(badge)
      embed.fields.push({
        name: 'Badge earned.',
        value: `${badgeDescriptions[badge][1]} ${badgeDescriptions[badge][0]} +0.1* daily roll rewards`
      })
    }
    writeUser(interaction.member.user.id, user)
  } else {
    embed.description = error
    embed.color = 0xff0000
  }
  return {
    type: CommandOptionType.ChannelMessage,
    data: { embeds: [embed] }
  }
}
