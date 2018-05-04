const jimp = require('jimp')
const request = require('request')
const discord = require('discord.js')

function mirror (url, orientation, channel) {
    jimp.read(url, (err, image) => {
        console.log(err)
        if (err) throw err
        var split = image.clone()
        split.mirror(true, false).cover(
            Math.floor(image.bitmap.width / 2),
            image.bitmap.height,
            jimp.HORIZONTAL_ALIGN_RIGHT
        )
        image.composite(split, Math.ceil(image.bitmap.width / 2), 0)
        image.getBuffer(jimp.MIME_PNG, (err, buff) => {
            if (err) throw err
            channel.send("", new discord.Attachment(buff, 'haah.png'))
        })
    })
}

function checkImage (message) {
    return (
        message.attachments.size > 0 ||
        (
            message.embeds.length > 0 &&
            (message.embeds[0].image != null || message.embeds[0].thumbnail != null)
        )
    )
}


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
        var url
        if (message.attachments.size > 0) {
            url = message.attachments.first().url
            // mirror(url, 1, message.channel)
            try {
                mirror(url, content[0].slice(1), message.channel)
            } catch (e) {
                message.channel.send('Invalid image file.')
            }
            return
        }

        if (content.length > 1 && content[1].startsWith('http')) {
            url = message.content.slice(6)
            try {
                mirror(url, content[0].slice(1), message.channel)
            } catch (e) {
                message.channel.send('Invalid image URL.')
            }
            return
        }

        message.channel.fetchMessages({before: message.id})
        .then(messages => {
            messages = messages.filter(checkImage)
            if (messages.size === 0) return message.channel.send('No images found.')
            message = messages.first()
            if (message.attachments.size > 0) {
                url = message.attachments.first().url
            } else {
                let thumb = messages.first().embeds[0].image != null ? 'image' : 'thumbnail'
                url = messages.first().embeds[0][thumb]['url']
            }
            try {
                mirror(url, content[0].slice(1), message.channel)
            } catch (e) {
                message.channel.send('Could not find valid image.')
            }
        })
    }
}
