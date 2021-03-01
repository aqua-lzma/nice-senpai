/**
 * @module dabs-check-action Response generator for `dabs check` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../../typedefs.js'
import { readUser } from '../utils.js'
import { badgeMap } from '../badges.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'

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
  const guild = await client.guilds.fetch(interaction.guild_id)
  const invokerGuildUser = await guild.members.fetch(interaction.member.user.id)
  const invokerDisplayName = invokerGuildUser.displayName
  const invokerAvatarURL = invokerGuildUser.user.avatarURL()

  let targetUserID, targetDisplayName, targetAvatarURL, targetDisplayColour
  if (interaction.data.options[0].options != null) {
    targetUserID = interaction.data.options[0].options[0].value
    const guildMember = await guild.members.fetch(targetUserID)
    targetDisplayName = guildMember.displayName
    targetAvatarURL = guildMember.user.avatarURL()
    targetDisplayColour = guildMember.displayColor
  } else {
    targetUserID = interaction.member.user.id
    targetDisplayName = invokerDisplayName
    targetAvatarURL = invokerAvatarURL
    targetDisplayColour = invokerGuildUser.displayColor
  }

  const user = readUser(targetUserID)

  embed.title = `**${targetDisplayName}**`
  embed.thumbnail = { url: targetAvatarURL }
  embed.color = targetDisplayColour

  return {
    type: CommandOptionType.ChannelMessage,
    data: {
      embeds: [{
        title: `**${targetDisplayName}**`,
        thumbnail: { url: targetAvatarURL },
        color: targetDisplayColour,
        fields: [{
          name: '**Dabs:**',
          value: [
            '```md',
            `<Mode:    ${user.positive ? 'nice' : 'ebil'}>`,
            `<Current: ${user.dabs}>`,
            `<Highest: ${user.highestDabs}>`,
            `<Lowest:  ${user.lowestDabs}>`,
            '```'
          ].join('\n')
        }, {
          name: '**Levels:**',
          value: [
            '```md',
            `<Current ${user.level}>`,
            `<Highest ${user.highestLevel}>`,
            `<Lowest  ${user.lowestLevel}>`,
            '```'
          ].join('\n'),
          inline: true
        }, {
          name: '**Gambling:**',
          value: [
            '```md',
            `<Bet     ${user.betTotal}>`,
            `<Won     ${user.betWon}>`,
            `<Net    ${user.betWon - user.betTotal}>`,
            '```'
          ].join('\n'),
          inline: true
        }, {
          name: '**Daily rolls:**',
          value: [
            '```md',
            `<Claimed ${Math.random() > 0.5 ? ' yes' : '  no'}>`,
            `<Streak  ${user.claimStreak}>`,
            `<Won     ${user.dailyWins}>`,
            '```'
          ].join('\n'),
          inline: true
        }, {
          name: '**Roll History**',
          value: [
            '```md',
            `<Singles: ${1234}> <Doubles: ${1234}>`,
            `<Triples: ${1234}> <Quads:   ${1234}>`,
            `<Quints:  ${1234}> <Sextups: ${1234}>`,
            '```'
          ].join('\n')
        }, {
          name: '**Badges:**',
          value: (
            user.badges.length !== 0
              ? user.badges.map(name => badgeMap[name].emoji).join(' ')
              : 'None'
          )
        }],
        footer: {
          icon_url: invokerAvatarURL,
          text: invokerDisplayName
        },
        timestamp: (new Date()).toISOString()
      }]
    }
  }
}
