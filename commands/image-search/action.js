/**
 * @module image-search-action Response generator for `image-search` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import axios from 'axios'
import '../../typedefs.js'
import { InteractionResponseType } from '../../enums.js'
import generateEmbedTemplate from '../../utils/generateEmbedTemplate.js'
import unwrapDict from '../../utils/unwrapDict.js'

/**
 * Respond to command trigger
 * @param {Client} client - bot client
 * @param {Interaction} interaction - interaction that triggered the command
 * @returns {InteractionResponse} interaction to send back
 */
export default async function (client, interaction) {
  const embed = await generateEmbedTemplate(client, interaction)
  const options = unwrapDict(interaction.data.options)
  embed.title = `**Image search:** ${options.query}`
  try {
    const res = await axios.get(`https://www.google.co.uk/search?q=${encodeURIComponent(options.query)}&tbm=isch`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0'
      }
    })
    const images = res.data.match(/\["http?s:\/\/(?!encrypted[^.]+\.gstatic)[^"]+"/g).map(i => i.slice(2, -1))
    embed.image = { url: images[0] }
    embed.description = '*Cycling through image results not ready yet*'
  } catch (err) {
    console.error('Image search error')
    console.error(err)
    embed.description = 'Error searching.'
    embed.color = 0xff0000
  }
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      embeds: [embed]
    }
  }
}
