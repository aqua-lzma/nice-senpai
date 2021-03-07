/**
 * @module fortune-action Response generator for `fortune` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../typedefs.js'
import generateEmbedTemplate from '../../utils/generateEmbedTemplate.js'

/** @type {[[number,string]]} */
const rareFortunes = [
  [0x2600D0, 'Your fortune: le ebin dubs xDDDDDDDDDDDD'],
  [0x2A56FB, "Your fortune: you gon' get some dick"],
  [0xE941E3, 'Your fortune: ayy lmao'],
  [0xFF0000, 'Your fortune: (YOU ARE BANNED)'],
  [0x68923A, 'Your fortune: Get Shrekt'],
  [0x8C8C8C, 'Your fortune: YOU JUST LOST THE GAME']
]

/** @type {[[number,string]]} */
const fortunes = [
  [0xF51C6A, 'Your fortune: Reply hazy, try again'],
  [0xFD4D32, 'Your fortune: Excellent Luck'],
  [0xE7890C, 'Your fortune: Good Luck'],
  [0xBAC200, 'Your fortune: Average Luck'],
  [0x7FEC11, 'Your fortune: Bad Luck'],
  [0x43FD3B, 'Your fortune: Good news will come to you by mail'],
  [0x16F174, 'Your fortune: （　´_ゝ`）ﾌｰﾝ '],
  [0x00CBB0, 'Your fortune: ｷﾀ━━━━━━(ﾟ∀ﾟ)━━━━━━ !!!!'],
  [0x0893E1, 'Your fortune: You will meet a dark handsome stranger'],
  [0x2A56FB, 'Your fortune: Better not tell you now'],
  [0x6023F8, 'Your fortune: Outlook good'],
  [0x9D05DA, 'Your fortune: Very Bad Luck'],
  [0xD302A7, 'Your fortune: Godly Luck']
]

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
  const embed = await generateEmbedTemplate(client, interaction)
  let fortune
  if (Math.random() > 0.99) {
    fortune = rareFortunes[Math.floor(Math.random() * rareFortunes.length)]
  } else {
    fortune = fortunes[Math.floor(Math.random() * fortunes.length)]
  }
  embed.title = '🔮 **Fortune**'
  embed.color = fortune[0]
  embed.description = fortune[1]
  return {
    type: CommandOptionType.ChannelMessage,
    data: {
      embeds: [embed]
    }
  }
}
