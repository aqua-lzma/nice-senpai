/**
 * @module dabs-give-action Response generator for `dabs give` command
 */
// eslint-disable-next-line no-unused-vars
import { Client, Util } from 'discord.js'
import '../../../typedefs.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'
import unwrapDict from '../../../utils/unwrapDict.js'
import {
  checkGiverBadges,
  checkGivenBadges
} from '../badges.js'
import {
  formatNumber,
  readUser,
  saveUser,
  validateGiveInput
} from '../utils.js'

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
  const options = unwrapDict(interaction.data.options[0].options)
  const guild = await client.guilds.fetch(interaction.guild_id)
  const giverID = interaction.member.user.id
  const giverName = (await guild.members.fetch(giverID)).displayName
  const giver = readUser(giverID)
  const today = Math.floor((new Date()).getTime() / (1000 * 60 * 60 * 24))
  const given = today - giver.lastGiveDate === 0 ? giver.percentGiven : 0
  const takerID = options.user
  const takerName = (await guild.members.fetch(takerID)).displayName
  const taker = readUser(takerID)
  let amount = options.dabs
  // Until this issue is fixed: https://github.com/discord/discord-api-docs/issues/2687
  amount = Number(amount)

  if (amount === 0) amount = Math.trunc((0.5 - given) * giver.dabs)
  embed.title = `**Give: ${amount}**`
  let error = validateGiveInput(amount, giver.dabs, given)
  if (giverID === takerID) error = 'Cannot give dabs to yourself.'
  if (error == null) {
    const newGiven = given + (amount / giver.dabs)
    embed.description = `Percentage given today: **${Math.round(newGiven * 100)}%**`
    embed.fields.push({
      name: giverName,
      value: [
        '```md',
        `<Was ${formatNumber(giver.dabs)}> <Now ${formatNumber(giver.dabs - amount)}>`,
        '```'
      ].join('\n')
    })
    embed.fields.push({
      name: takerName,
      value: [
        '```md',
        `<Was ${formatNumber(taker.dabs)}> <Now ${formatNumber(taker.dabs + amount)}>`,
        '```'
      ].join('\n')
    })

    let gifted = 0
    let destroyed = 0
    if (
      (amount > 0 && taker.dabs > 0) ||
      (amount < 0 && taker.dabs < 0)
    ) gifted = amount
    else if (
      (amount > 0 && taker.dabs < 0 && taker.dabs + amount <= 0) ||
      (amount < 0 && taker.dabs > 0 && taker.dabs + amount >= 0)
    ) destroyed = amount
    else {
      gifted = taker.dabs + amount
      destroyed = taker.dabs
    }
    giver.dabs -= amount
    taker.dabs += amount
    taker.highestDabs = Math.max(taker.highestDabs, taker.dabs)
    taker.lowestDabs = Math.min(taker.lowestDabs, taker.dabs)
    giver.lastGiveDate = today
    giver.percentGiven = newGiven
    giver.totalGive += gifted
    giver.totalBadGive += destroyed
    taker.totalGot += gifted
    giver.totalBadGot += destroyed
    const { badges: giverBadges, messages: giverMessages } = checkGiverBadges(giver)
    if (giverBadges.length !== 0) {
      for (const badge of giverBadges) giver.badges.push(badge)
      embed.fields.push({
        name: `**Badges earned:** (${giverName})`,
        value: giverMessages.join('\n')
      })
    }
    giver.badges.sort()
    const { badges: takerBadges, messages: takerMessages } = checkGivenBadges(taker)
    if (takerBadges.length !== 0) {
      for (const badge of takerBadges) giver.badges.push(badge)
      embed.fields.push({
        name: `**Badges earned:** (${takerName})`,
        value: takerMessages.join('\n')
      })
    }
    giver.badges.sort()
    saveUser(giverID, giver)
    saveUser(takerID, taker)
  } else {
    embed.description = error
    embed.color = 0xff0000
  }
  return {
    type: CommandOptionType.ChannelMessage,
    data: {
      embeds: [embed]
    }
  }
}
