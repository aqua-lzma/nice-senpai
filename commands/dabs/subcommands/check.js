/**
 * @module template-action Response generator for template command
 */
import { readUser, writeUser } from '../utils.js'
import { Client } from 'discord.js'
import '../../../typedefs.js'

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
  let guild = await client.guilds.fetch(interaction.guild_id)
  let invokerGuildUser = await guild.members.fetch(interaction.member.user.id)
  let invokerDisplayName = invokerGuildUser.displayName
  let invokerAvatarURL = invokerGuildUser.user.avatarURL()

  let targetUserID, targetDisplayName, targetAvatarURL, targetDisplayColour
  if (interaction.data.options[0].options != null) {
    targetUserID = interaction.data.options[0].options[0].value
    let guildMember = await guild.members.fetch(targetUserID)
    targetDisplayName = guildMember.displayName
    targetAvatarURL = guildMember.user.avatarURL()
    targetDisplayColour = guildMember.displayColor
  } else {
    targetUserID = interaction.member.user.id
    targetDisplayName = invokerDisplayName
    targetAvatarURL = invokerAvatarURL
    targetDisplayColour = invokerGuildUser.displayColor
  }

  let user = readUser(targetUserID)

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
            '```',
            `Mode:    ${user.positive ? 'positive' : 'negative'}`,
            `Current: ${user.dabs}`,
            `Highest: ${user.highestDabs}`,
            `Lowest:  ${user.lowestDabs}`,
            '```'
          ].join('\n'),
          //inline: true
        }, {
          name: '**Levels:**',
          value: [
            '```',
            `Current: ${user.level}`,
            `Highest: ${user.highestLevel}`,
            `Lowest:  ${user.lowestLevel}`,
            '```'
          ].join('\n'),
          inline: true
        }, {
          name: '**Daily rolls:**',
          value: [
            '```',
            `Claimed?:  ${true}`,
            `Streak:    ${user.claimStreak}`,
            `Total won: ${user.dailyWins}`,
            '```'
          ].join('\n'),
          inline: true
        }, {
          name: '**Gambling:**',
          value: [
            '```',
            `Total bet: ${user.betTotal}`,
            `Total won: ${user.betWon}`,
            `Net:       ${user.betWon - user.betTotal}`,
            '```'
          ].join('\n'),
          inline: true
        }, {
          name: '**Badges:**',
          value: [
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
            '<:that:640311611516518421>',
          ].join(' ')
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
