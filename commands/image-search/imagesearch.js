const request = require('request')

module.exports = {
  title: 'Search image',
  desc: [
    'Search googlel for an image, will be the top 100 results sorted by relevance.',
    'Or use i2 to search for an a random image in the top 20 results.',
    'Any of the aliases ending with 2 is valid for a random search.',
    'Bot will stop listening for reactions after 30 seconds.'
  ].join('\n'),
  syntax: [
    '`{prefix}im <image query>` where query is what you want to search for.',
    '`{prefix}im2 <image query>` same as above but will return a random result from top 20.'
  ].join('\n'),
  alias: ['i', 'im', 'img', 'imag', 'image', 'i2', 'im2', 'img2', 'imag2', 'image2'],
  owner_only: false,
  affect_config: false,
  action: function (message) {
    var query = message.content.split(' ').slice(1).join(' ')
    if (query === '') return message.channel.send('Cannot search blank query.')
    var req = {
      url: `https://www.google.co.uk/search?q=${encodeURIComponent(query)}&tbm=isch`,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0' }
    }
    request.get(req, (err, res, body) => {
      require('fs').writeFileSync('test.html', body)
      if (err) return message.channel.send(`Error:\`\`\`\n${String(err)}\`\`\``)
      var images = body.match(/\["http?s:\/\/(?!encrypted[^.]+\.gstatic)[^"]+"/g).map(i => i.slice(2, -1))
      var index = 0

      if (message.content.split(' ')[0].slice(-1) === '2') {
        index = Math.floor(Math.random() * Math.floor(images.length / 5))
        return message.channel.send('', {
          embed: {
            title: query + `: ${index}`,
            description: images[index],
            image: { url: images[index] }
          }
        })
      }

      function awaitReactions (response) {
        response.createReactionCollector(
          (reaction, user) => ['⏪', '◀', '▶', '⏩', '🔀', '⏹️'].indexOf(reaction.emoji.name) >= 0 && user.id === message.author.id,
          { max: 1, time: 30000 }
        ).on('collect', reaction => {
          if (reaction.emoji.name === '⏪') index -= 10
          else if (reaction.emoji.name === '◀') index--
          else if (reaction.emoji.name === '▶') index++
          else if (reaction.emoji.name === '⏩') index += 10
          else if (reaction.emoji.name === '🔀') index = Math.floor(Math.random() * images.length)
          else if (reaction.emoji.name === '⏹️') return response.delete()
          index = ((index % 100) + 100) % 100
          response.edit('', {
            embed: {
              title: query + `: ${index}`,
              description: images[index],
              image: { url: images[index] }
            }
          })
          reaction.remove(message.author).then(() => awaitReactions(response))
        }).on('end', (collected, reason) => {
          if (reason !== 'limit') response.clearReactions()
        })
      }

      message.channel.send('', {
        embed: {
          title: query + `: ${index}`,
          description: images[index],
          image: { url: images[index] }
        }
      }).then(response => {
        response
          .react('⏪')
          .then(() => response.react('◀'))
          .then(() => response.react('▶'))
          .then(() => response.react('⏩'))
          .then(() => response.react('🔀'))
          .then(() => response.react('⏹️'))
          .then(() => awaitReactions(response))
      })
    })
  }
}
