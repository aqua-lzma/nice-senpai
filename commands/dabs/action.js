/**
 * @module dabs-action Response generator for `dab` commands
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../typedefs.js'

import betDubs from './subcommands/bet-dubs.js'
import betFlip from './subcommands/bet-flip.js'
import betRoll from './subcommands/bet-roll.js'
import check from './subcommands/check.js'
import dailyRoll from './subcommands/daily-roll.js'
import give from './subcommands/give.js'
import leaderboards from './subcommands/leaderboards.js'
import level from './subcommands/level.js'
import switchMode from './subcommands/switch-mode.js'

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
    case 'switch-mode':
      return await switchMode(client, interaction)
    default:
      return {
        type: CommandOptionType.AcknowledgeWithSource
      }
  }
}
