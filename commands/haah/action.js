/**
 * @module haah-action Response generator for `haah` command
 */
// eslint-disable-next-line no-unused-vars
import { Client, TextChannel } from 'discord.js'
import canvas from 'canvas'
import '../../typedefs.js'
import { InteractionResponseType } from '../../enums.js'
import generateEmbedTemplate from '../../utils/generateEmbedTemplate.js'
import {
  haah,
  waaw,
  hooh,
  woow
} from '../../utils/imageManipulation.js'
import unwrapDict from '../../utils/unwrapDict.js'

/**
 * Get last image posted in a text channel
 * @param {TextChannel} channel
 */
async function getLastImage (channel) {
  const messages = await channel.messages.fetch()
  for (const message of messages.values()) {
    for (const attachment of message.attachments.values()) {
      if (attachment.height != null) {
        return attachment.url
      }
    }
    for (const embed of message.embeds) {
      if (embed.type === 'image') return embed.url
      if (embed.image != null) return embed.image.url
    }
  }
}

/**
 * Respond to command trigger
 * @param {Client} client - bot client
 * @param {Interaction} interaction - interaction that triggered the command
 * @returns {InteractionResponse} interaction to send back
 */
export default async function (client, interaction) {
  const embed = await generateEmbedTemplate(client, interaction)
  const guild = await client.guilds.fetch(interaction.guild_id)
  const channel = guild.channels.resolve(interaction.channel_id)
  const options = unwrapDict(interaction.data.options)
  let imageURL
  if (options.url == null) {
    imageURL = await getLastImage(channel)
  } else {
    imageURL = options.url
    try {
      await canvas.loadImage(imageURL)
    } catch {
      imageURL = null
    }
  }
  let opt = options.haah
  if (opt == null) opt = 'haah'

  embed.title = `**haah:** ${opt}`
  if (imageURL != null) {
    let newURL
    switch (opt) {
      case 'haah':
        newURL = await haah(imageURL)
        break
      case 'waaw':
        newURL = await waaw(imageURL)
        break
      case 'hooh':
        newURL = await hooh(imageURL)
        break
      case 'woow':
        newURL = await woow(imageURL)
        break
    }
    embed.url = imageURL
    embed.image = { url: newURL }
  } else {
    embed.color = 0xff0000
    embed.description = 'No image found'
  }
  return {
    type: InteractionResponseType.Acknowledge,
    data: {
      embeds: [embed]
    }
  }
}

/*

const jimp = require('jimp')
const request = require('request')
const discord = require('discord.js')

const orientations = ['haah', 'waaw', 'woow', 'hooh']

module.exports = {
  title: "Haah waaw",
  desc: [
    'Mirror an image.',
    'haah is left to right.',
    'waaw is right to left.',
    'woow is top to bottom',
    'hooh is bottom to top.'
  ].join('\n'),
  syntax: [
    '`{prefix}haah` + image attachment. Will mirror image.',
    '`{prefix}waaw <image url>` will mirror image in URL.',
    '`{prefix}woow` will try to mirror last image posted.'
  ].join('\n'),
  alias: ['haah', 'waaw', 'woow', 'hooh'],
  owner_only: false,
  affect_config: false,
  action: function (message, config) {
    var content = message.content.toLowerCase().split(' ')
    var urls = content.filter(i => i.startsWith('http'))
    var orient = orientations.indexOf(content[0].slice(1))
    var mirParams = [
      orient === 0 || orient === 1,
      orient === 2 || orient === 3
    ]
    var align = [
      jimp.HORIZONTAL_ALIGN_RIGHT,
      jimp.HORIZONTAL_ALIGN_LEFT,
      jimp.VERTICAL_ALIGN_BOTTOM,
      jimp.VERTICAL_ALIGN_TOP
    ][orient]
    var widthHeights = [
      mirParams[0] ? w => Math.floor(w / 2) : w => w,
      mirParams[1] ? h => Math.floor(h / 2) : h => h,
      orient === 0 ? w => Math.ceil(w / 2) : w => 0,
      orient === 2 ? h => Math.ceil(h / 2) : h => 0
    ]
    var callback = (image) => {
      if (image == null) throw Error('Null image.')
      var whs = [
        widthHeights[0](image.bitmap.width),
        widthHeights[1](image.bitmap.height),
        widthHeights[2](image.bitmap.width),
        widthHeights[3](image.bitmap.height)
      ]
      var split = image.clone()
      split.mirror(mirParams[0], mirParams[1]).cover(whs[0], whs[1], align)
      image.composite(split, whs[2], whs[3])
      image.getBuffer(jimp.MIME_PNG, (err, buff) => {
        if (err) throw err
        let filename = `${content[0].slice(1)}.png`
        message.channel.send('', new discord.Attachment(buff, filename))
      })
    }

    if (message.attachments.size > 0) {
      let url = message.attachments.first().url
      jimp.read(url).then(callback).catch(err => {
        message.channel.send('Invalid image file.')
      })
      return
    }

    if (urls.length > 0) {
      for (let url of urls) {
        jimp.read(url).then(callback).catch(err => {
          message.channel.send('Invalid image file.')
        })
      }
      return
    }

    message.channel.fetchMessages({before: message.id})
    .then(messages => {
      messages = messages.filter(m => {
        return (
          m.attachments.size > 0 || (
            m.embeds.length > 0 &&
            (m.embeds[0].image != null || m.embeds[0].thumbnail != null)
          )
        )
      }).array().reverse()

      var tryNext = err => {
        if (messages.length == 0) {
          return message.channel.send('No images found.')
        }
        var url
        message = messages.pop()
        if (message.attachments.size > 0) {
          url = message.attachments.first().url
        } else {
          let thumb = message.embeds[0].image != null ? 'image' : 'thumbnail'
          url = message.embeds[0][thumb]['url']
        }
        jimp.read(url).then(callback).catch(tryNext)
      }

      tryNext()
    })
  }
}
*/
