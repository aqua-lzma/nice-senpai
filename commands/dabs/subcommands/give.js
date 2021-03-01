/**
 * @module template-action Response generator for `template` command
 */
// eslint-disable-next-line no-unused-vars
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
  return {
    type: CommandOptionType.AcknowledgeWithSource
  }
}

let oldStuff = {
    title: "Give",
    desc: "Give mentioned users <amount> dabs. Positive amounts only.",
    syntax: "`{prefix}give <amount> [user-mentions ...]`",
    alias: ["give", "gib", "g"],
    owner_only: false,
    affect_config: false,
    action: function(message, config) {
        message_words = message.content.split(" ")

        for (word of message_words) {
            if (!Number.isNaN(Number(word)))
                amount = Number(word)
        }

        if (amount === undefined)
            return message.channel.send("Specify an amount. No dabs given.")
        if (amount <= 0 || (Number.isInteger(amount) == false))
            return message.channel.send("Specify a valid amount. No dabs given.")

        sender = message.author
        receivers = message.mentions.users
        user = update_dabs(sender, config)
        total_amount = amount * receivers.size
        if (user.dabs < total_amount)
            return message.channel.send("Not enough dabs to give. No dabs given.")

        for (receiver of receivers.values()) {
            update_dabs(sender, config, -1 * amount)
            update_dabs(receiver, config, amount)
        }

        message.channel.send("Sent " + total_amount + " dabs to " + 
            receivers.size + " users")
    }
}
