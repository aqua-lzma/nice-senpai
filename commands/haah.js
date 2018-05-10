'use strict'

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
