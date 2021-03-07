/**
 * @module template-action Response generator for `template` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../typedefs.js'

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
  return {
    type: CommandOptionType.AcknowledgeWithSource
  }
}

/*

module.exports = {
    title: "Roll",
    desc: "Roll a number between 0 and 100 inclusive. Announces dubs.",
    alias: ["roll", "r"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        number = Math.floor(Math.random() * 101).toString().padStart(2, "0")
        out = `You rolled ${number}`
        out += (number.substr(-2, 1) === number.substr(-1))?"\nNice dubs!":""
        message.channel.send(out)
    }
}
*/
