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

}

let oldStuff = {
    owner_only: false,
    affect_config: true,
    action: function(message, config) {
        user = update_dabs(message.author, config)
        content = message.content.toLowerCase().split(" ")[1]
        bonus = 1
        if (content === "all") {
            amount = user.dabs
            bonus = 2
        } else {
            amount = Number(content)
            if (amount === NaN || Math.floor(amount) != amount || amount < 0)
                return message.channel.send("Invalid amount.")
            if (amount > user.dabs) {
                return message.channel.send("You don't have enough dabs.")
            }
        }

        user.dabs -= amount
        number = Math.floor(Math.random() * 1000001)
        roll = ("000000" + number).slice(-6)
        win = 0
        for (c = 5; c > 0; c--) {
            if (roll[c] === roll[c-1]) win += 1
            else break
        }
        if (win == 0) {
            suffix = "no dabs."
            winnings = 0
        } else if (win == 1) {
            winnings = amount * 5 * bonus
            suffix = `${winnings} dabs! *Dubs!* ${config.dab_emoji}`
        } else if (win == 2) {
            winnings = amount * 20 * bonus
            suffix = `${winnings} dabs! **Trips!** ${config.dab_emoji}`
        } else if (win == 3) {
            winnings = amount * 50 * bonus
            suffix = `${winnings} dabs! **QUADS!** ${config.dab_emoji}`
        } else if (win == 4) {
            winnings = amount * 500 * bonus
            suffix = `${winnings} dabs! ***QUINTUPLES*** ${config.dab_emoji}`
        } else if (win == 5) {
            winnings = amount * 5000 * bonus
            suffix = `${winnings} dabs! ***S E X T U P L E S*** ${config.dab_emoji}`
        } else
            suffix = "Something went wrong."
        user.dabs += winnings
        message.channel.send(`You rolled \`${roll}\` and won ${suffix}`)
    }
}
