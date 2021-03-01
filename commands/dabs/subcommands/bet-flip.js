/**
 * @module bet-flip-action Response generator for `dabs bet-flip` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../../typedefs.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'
import {
  readUser,
  writeUser,
  validateGambleInput
} from '../utils.js'
import { badgeMap, checkGambleBadges } from '../badges.js'

const headsURL = 'https://raw.githubusercontent.com/aqua-lzma/Nice-Senpai/master/resources/makotocoinheads.png'
const tailsURL = 'https://raw.githubusercontent.com/aqua-lzma/Nice-Senpai/master/resources/makotocointails.png'

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
  const choice = interaction.data.options[0].options.find(o => o.name === 'choice').value
  let amount = interaction.data.options[0].options.find(o => o.name === 'dabs').value
  const userID = interaction.member.user.id
  const user = readUser(userID)

  if (amount === 0) amount = user.dabs
  embed.title = `Bet flip - ${choice}: ${amount}`
  const error = validateGambleInput(amount, user.dabs)
  if (error == null) {
    const n = Math.floor(Math.random() * 2)
    const flip = n === 0 ? 'heads' : 'tails'
    const imgURL = n === 0 ? headsURL : tailsURL
    const won = flip === choice
    const winnings = won ? Math.floor(amount * 2) : 0

    embed.thumbnail = { url: imgURL }
    embed.description = [
      `Result: **${flip}**`,
      `Winnings: **${winnings}**`
    ].join('\n')

    user.dabs -= amount
    user.dabs += winnings
    user.highestDabs = Math.max(user.highestDabs, user.dabs)
    user.lowestDabs = Math.min(user.lowestDabs, user.dabs)
    user.betTotal += Math.abs(amount)
    user.betWon += Math.abs(winnings)
    const badges = checkGambleBadges(user, amount, winnings)
    for (const badge of badges) {
      user.badges.push(badge)
      embed.fields.push({
        name: 'Badge earned',
        value: `${badgeMap[badge].emoji} ${badgeMap[badge].desc} +0.${badge.slice(-1)}* daily roll rewards`
      })
    }
    user.badges = user.badges.sort()
    writeUser(userID, user)
  } else {
    embed.description = error
    embed.color = 0xff0000
  }
  return {
    type: CommandOptionType.ChannelMessage,
    data: { embeds: [embed] }
  }
}
