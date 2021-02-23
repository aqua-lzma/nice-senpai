/**
 * @module template-action Response generator for template command
 */
import { Client } from 'discord.js'
import '../../typedefs'

import betDubs from './subcommands/bet-dubs'
import betFlip from './subcommands/bet-flip'
import betRoll from './subcommands/bet-roll'
import check from './subcommands/check'
import dailyRoll from './subcommands/daily-roll'
import give from './subcommands/give'
import leaderboards from './subcommands/leaderboards'
import level from './subcommands/level'

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
 * @returns {InteractionResponse} - interaction to send back
 */
export default async function (client, interaction) {
  switch (interaction.data.options[0].name) {
    case 'bet-dubs':
      return await betDubs(client, interaction)
    case 'bet-flip':
      return await betFlip(client, interaction)
    case 'bet-roll':
      return await betRoll(client, interaction)
    case 'check':
      return await check(client, interaction)
    case 'daily-roll':
      return await dailyRoll(client, interaction)
    case 'give':
      return await give(client, interaction)
    case 'leaderboards':
      return await leaderboards(client, interaction)
    case 'level':
      return await level(client, interaction)
    default:
      return {
        type: CommandOptionType.AcknowledgeWithSource
      }
  }
}
