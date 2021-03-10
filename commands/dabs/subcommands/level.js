/**
 * @module dabs-level-action Response generator for `dabs level` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../../typedefs.js'
import { InteractionResponseType } from '../../../enums.js'
import generateEmbedTemplate from '../../../utils/generateEmbedTemplate.js'
import unwrapDict from '../../../utils/unwrapDict.js'
import {
  calcLevelCost,
  calcMaxLevel,
  formatNumber,
  readUser,
  saveUser,
  validateLevelInput
} from '../utils.js'

/**
 * Respond to command trigger
 * @param {Client} client - bot client
 * @param {Interaction} interaction - interaction that triggered the command
 * @returns {InteractionResponse} interaction to send back
 */
export default async function (client, interaction) {
  const embed = await generateEmbedTemplate(client, interaction)
  const options = unwrapDict(interaction.data.options[0].options)
  let amount = options.amount
  // Until this issue is fixed: https://github.com/discord/discord-api-docs/issues/2687
  amount = Number(amount)
  let dryRun = options['dry-run']
  if (dryRun == null) dryRun = true
  const userID = interaction.member.user.id
  const user = readUser(userID)
  if (amount === 0) amount = calcMaxLevel(user.level, user.dabs, user.positive)
  const cost = calcLevelCost(user.level, user.level + amount)

  embed.title = `**Level ${amount}${dryRun ? ' (dry run)' : ''}:**`
  embed.description = [
    '```md',
    `<Cost        ${formatNumber(cost)}>`,
    `<Dabs-before ${formatNumber(user.dabs)}>`,
    `<Dabs-after  ${formatNumber(user.dabs - cost)}>`,
    '```'
  ].join('\n')
  const error = validateLevelInput(amount, user.dabs, user.level, user.positive)
  if (error == null) {
    if (!dryRun) {
      embed.description += '\n' + `You are now level: **${user.level + amount}**!`

      user.dabs -= cost
      user.level += amount
      user.highestLevel = Math.max(user.highestLevel, user.level)
      user.lowestLevel = Math.min(user.lowestLevel, user.level)
      saveUser(userID, user)
    } else {
      embed.description += '\n' + 'To confirm, run with `dry-mode: false`'
    }
  } else {
    embed.description = error + '\n' + embed.description
    embed.color = 0xff0000
  }
  return {
    type: InteractionResponseType.Acknowledge,
    data: { embeds: [embed] }
  }
}
