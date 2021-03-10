/**
 * @module dabs-switch-mode-action Response generator for `dabs switch-mode` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../../typedefs.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'
import {
  animInvert,
  flipInvert
} from '../../../utils/imageManipulation.js'
import {
  readUser,
  saveUser
} from '../utils.js'

/**
 * Enum for InteractionResponseType values.
 * @readonly
 * @enum {number}
 */
const CommandOptionType = {
  Pong: 1, // ACK a Ping
  Acknowledge: 2, // DEPRECATED ACK a command without sending a message, eating the user's input
  ChannelMessage: 3, // DEPRECATED respond with a message, eating the user's input
  ChannelMessageWithSource: 4, // respond to an interaction with a message
  DeferredChannelMessageWithSource: 5 // ACK an interaction and edit to a response later, the user sees a loading state
}

/**
 * Respond to command trigger
 * @param {Client} client - bot client
 * @param {Interaction} interaction - interaction that triggered the command
 * @returns {InteractionResponse} interaction to send back
 */
export default async function (client, interaction) {
  const embed = await generateEmbedTemplate(client, interaction)
  const guild = await client.guilds.fetch(interaction.guild_id)
  const userID = interaction.member.user.id
  const guildMember = await guild.members.fetch(userID)
  const avatarURL = guildMember.user.avatarURL({ format: 'png' })
  const user = readUser(userID)

  embed.title = '**Switch mode**'

  user.levelsDestroyed += Math.abs(user.level)
  user.level = 0
  user.positive = !user.positive
  if (user.positive) {
    embed.description = 'Welcome back to the nice side!'
    const inverted = await flipInvert(avatarURL)
    const imageURL = await animInvert(inverted)
    embed.thumbnail = { url: imageURL }
  } else {
    embed.description = 'Welcome to the ebil side!'
    const imageURL = await animInvert(avatarURL)
    embed.thumbnail = { url: imageURL }
  }
  saveUser(userID, user)
  return {
    type: CommandOptionType.Acknowledge,
    data: {
      embeds: [embed]
    }
  }
}
