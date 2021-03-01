// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../typedefs.js'

/**
 * Generate default template used by every command
 * @param {Client} client
 * @param {Interaction} interaction
 */
export default async function (client, interaction) {
  const guild = await client.guilds.fetch(interaction.guild_id)
  const guildUser = await guild.members.fetch(interaction.member.user.id)
  const displayName = guildUser.displayName
  const avatarURL = guildUser.user.avatarURL()
  const displayColor = guildUser.displayColor

  return {
    color: displayColor,
    fields: [],
    footer: {
      icon_url: avatarURL,
      text: displayName
    },
    timestamp: (new Date()).toISOString()
  }
}
