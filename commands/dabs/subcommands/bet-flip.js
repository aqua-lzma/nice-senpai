/**
 * @module template-action Response generator for template command
 */
import { Client } from 'discord.js'
import '../../../typedefs.js'

const headsURL = 'https://raw.githubusercontent.com/aqua-lzma/Nice-Senpai/master/resources/makotocoinheads.png'
const tailsURL = 'https://raw.githubusercontent.com/aqua-lzma/Nice-Senpai/master/resources/makotocointails.png'

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
  let embed = await generateEmbedTemplate(client, interaction)
  let choice = interaction.data.options[0].options.find(o => o.name === 'choice')
  let amount = interaction.data.options[0].options.find(o => o.name === 'dabs')
  embed.title = `Bet flip - ${choice}: ${amount}`
  let user = readUser(interaction.member.user.id)
  if (amount === 0) amount = user.dabs
  let error = validateGambleInput(amount, user.dabs)
  if (error == null) {
    let n = Math.floor(Math.random() * 2)
    let flip = n === 0 ? 'heads' : 'tails'
    let imgURL = n === 0 ? headsURL : tailsURL
    let won = flip === choice
    let winnings = won ? Math.floor(amount * 2) : 0
    embed.thumbnail = { url: imgURL }
    embed.description = [
      `Result: **${flip}**`,
      `Winnings: **${winnings}**`
    ].join('\n')
    user.dabs -= amount
    user.dabs += winnings
    user.highestDabs = Math.max(user.highestDabs, user.dabs)
    user.lowestDabs = Math.min(user.lowestDabs, user.dabs)
    user.betTotal += Math.abs(amount)
    user.betWon += Math.abs(winnings)
    let badges = checkGambleBadges(user, amount, winnings)
    for (let badge of badges) {
      user.badges.push(badge)
      embed.fields.push({
        name: 'Badge earned.',
        value: `${badgeDescriptions[badge][1]} ${badgeDescriptions[badge][0]} +0.1* daily roll rewards`
      })
    }
  } else {
    embed.description = error
    embed.color = 0xff0000
  }
  return {
    type: CommandOptionType.ChannelMessage,
    data: { embeds: [embed] }
  }
}
