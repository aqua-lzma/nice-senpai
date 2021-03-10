/**
 * @module template-action Response generator for `template` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../typedefs.js'
import { InteractionResponseType } from '../../../enums.js'
import generateEmbedTemplate from '../../utils/generateEmbedTemplate.js'

/**
 * Respond to command trigger
 * @param {Client} client - bot client
 * @param {Interaction} interaction - interaction that triggered the command
 * @returns {InteractionResponse} interaction to send back
 */
export default async function (client, interaction) {
  const embed = await generateEmbedTemplate(client, interaction)
  return {
    type: InteractionResponseType.Acknowledge,
    data: {
      embeds: [embed]
    }
  }
}
