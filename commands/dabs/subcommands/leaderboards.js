/**
 * @module dabs-leaderboards-action Response generator for `dabs leaderboards` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../../typedefs.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'
import unwrapDict from '../../../utils/unwrapDict.js'
import struct from '../struct.js'
import { formatNumber, readUser } from '../utils.js'

const leaderboardStruct = struct.options.find(o => o.name === 'leaderboards')
const sortByChoices = leaderboardStruct.options.find(o => o.name === 'sort-by').choices

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
  let sortBy = options['sort-by']
  if (sortBy == null) sortBy = 'dabs'
  const displaySort = sortByChoices.find(c => c.value === sortBy).name
  let type = options.type
  if (type == null) type = 'positive'
  const guild = await client.guilds.fetch(interaction.guild_id)
  const guildUsers = await guild.members.fetch()

  const users = []
  for (const [userID, user] of guildUsers) {
    users.push({
      user: readUser(userID),
      displayName: user.displayName
    })
  }
  if (type === 'positive') {
    users.sort((a, b) => b.user[sortBy] - a.user[sortBy])
  } else {
    users.sort((a, b) => a.user[sortBy] - b.user[sortBy])
  }

  embed.title = `**Leaderboards ${displaySort}${type === 'positive' ? '' : ' (negative)'}:**`
  embed.thumbnail = { url: guild.iconURL() }
  const message = ['```md']
  for (let i = 0; i < 10 && i < users.length; i++) {
    const { user, displayName } = users[i]
    message.push(`[${formatNumber(user[sortBy])}](${displayName})`)
  }
  message.push('```')
  embed.description = message.join('\n')
  return {
    type: CommandOptionType.ChannelMessage,
    data: { embeds: [embed] }
  }
}
