/**
 * @module bet-flip-action Response generator for `dabs bet-flip` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../../typedefs.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'
import unwrapDict from '../../../utils/unwrapDict.js'
import { checkGambleBadges } from '../badges.js'
import {
  readUser,
  saveUser,
  validateGambleInput
} from '../utils.js'

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
  const options = unwrapDict(interaction.data.options[0].options)
  const choice = options.choice
  let amount = options.dabs
  const userID = interaction.member.user.id
  const user = readUser(userID)

  if (amount === 0) amount = user.dabs
  embed.title = `**Bet flip - ${choice}: ${amount}**`
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
    const { badges, messages } = checkGambleBadges(user, amount, winnings)
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
    embed.description = error
    embed.color = 0xff0000
  }
  return {
    type: CommandOptionType.ChannelMessage,
    data: { embeds: [embed] }
  }
}
