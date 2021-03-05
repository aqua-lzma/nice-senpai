/**
 * @module dabs-check-action Response generator for `dabs check` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../../typedefs.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'
import unwrapDict from '../../../utils/unwrapDict.js'
import { badgeMap } from '../badges.js'
import { formatNumber, readUser } from '../utils.js'

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
  const guild = await client.guilds.fetch(interaction.guild_id)
  let userID = options.user
  if (userID == null) userID = interaction.member.user.id
  const detailed = Boolean(options.detailed)
  const guildMember = await guild.members.fetch(userID)
  const user = readUser(userID)
  const today = Math.floor((new Date()).getTime() / (1000 * 60 * 60 * 24))

  embed.title = `**${guildMember.displayName}**`
  embed.thumbnail = { url: guildMember.user.avatarURL() }

  if (!detailed) {
    embed.description = [
      '```md',
      `<Dabs  ${formatNumber(user.dabs)}>`,
      `<Level ${formatNumber(user.level)}>`,
      `<Daily ${Math.random() > 0.5 ? 'ready' : ' done'}>`,
      '```'
    ].join('\n')
  } else {
    embed.fields.push({
      name: '**Dabs:**',
      value: [
        '```md',
        `<Mode    ${user.positive ? ' nice' : ' ebil'}>`,
        `<Current ${formatNumber(user.dabs)}>`,
        `<Highest ${formatNumber(user.highestDabs)}>`,
        `<Lowest  ${formatNumber(user.lowestDabs)}>`,
        '```'
      ].join('\n')
    })
    embed.fields.push({
      name: '**Levels:**',
      value: [
        '```md',
        `<Current ${formatNumber(user.level)}>`,
        `<Highest ${formatNumber(user.highestLevel)}>`,
        `<Lowest  ${formatNumber(user.lowestLevel)}>`,
        '```'
      ].join('\n'),
      inline: true
    })
    embed.fields.push({
      name: '**Gambling:**',
      value: [
        '```md',
        `<Bet ${formatNumber(user.betTotal)}>`,
        `<Won ${formatNumber(user.betWon)}>`,
        `<Net ${formatNumber(user.betWon - user.betTotal)}>`,
        '```'
      ].join('\n'),
      inline: true
    })
    embed.fields.push({
      name: '**Daily rolls:**',
      value: [
        '```md',
        `<Claimed ${user.lastClaim < today ? '  yes' : '   no'}>`,
        `<Streak  ${formatNumber(user.claimStreak)}>`,
        `<Won     ${formatNumber(user.dailyWins)}>`,
        '```'
      ].join('\n'),
      inline: true
    })
    embed.fields.push({
      name: '**Roll history:**',
      value: [
        '```md',
        `<Singles ${formatNumber(user.history[0])}> <Doubles ${formatNumber(user.history[1])}>`,
        `<Triples ${formatNumber(user.history[2])}> <Quads   ${formatNumber(user.history[3])}>`,
        `<Quints  ${formatNumber(user.history[4])}> <Sextups ${formatNumber(user.history[5])}>`,
        '```'
      ].join('\n')
    })
    embed.fields.push({
      name: '**Badges:**',
      value: (
        user.badges.length !== 0
          ? user.badges.map(badge => badgeMap[badge].emoji).join(' ')
          : 'None'
      )
    })
  }

  return {
    type: CommandOptionType.ChannelMessage,
    data: {
      embeds: [embed]
    }
  }
}
