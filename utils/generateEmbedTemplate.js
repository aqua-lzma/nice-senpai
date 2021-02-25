export default async function (client, interaction) {
  let guild = await client.guilds.fetch(interaction.guild_id)
  let guildUser = await guild.members.fetch(interaction.member.user.id)
  let displayName = guildUser.displayName
  let avatarURL = guildUser.user.avatarURL()
  let displayColor = guildUser.displayColor

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
