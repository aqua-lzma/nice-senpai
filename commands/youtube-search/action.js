/**
 * @module template-action Response generator for `template` command
 */
// eslint-disable-next-line no-unused-vars
import { Client } from 'discord.js'
import '../../typedefs.js'

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
  return {
    type: CommandOptionType.AcknowledgeWithSource
  }
}

/*
const request = require('request')

module.exports = {
  title: 'YouTube Search',
  desc: [
    'Search YouTube for an video, will be the top 20 results sorted by relevance.',
    'Or use yt2 to search for an a random video in the top 5 results.',
    'Any of the aliases ending with 2 is valid for a random search.',
    'Bot will stop listening for reactions after 30 seconds.'
  ].join('\n'),
  syntax: [
    '`{prefix}yt <video query>` where query is what you want to search for.',
    '`{prefix}yt2 <video query>` same as above but will return a random result from top 5.'
  ].join('\n'),
  alias: ['yt', 'youtube', 'yt2', 'youtube2'],
  owner_only: false,
  affect_config: false,
  action: function (message) {
    var query = message.content.split(' ').slice(1).join(' ')
    if (query === '') return message.channel.send('Cannot search blank query.')
    var req = {
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      // headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0' }
    }
    request.get(req, (err, res, body) => {
      if (err) return message.channel.send(`Error:\`\`\`\n${String(err)}\`\`\``)
      var videos = body.match(/(\/watch\?v=[^"]*)(?![\s\S]*\1)/g).map(i => 'https://www.youtube.com/' + i.slice(1))
      var results = videos.length
      var index = 0

      if (message.content.split(' ')[0].slice(-1) === '2') {
        index = Math.floor(Math.random() * Math.floor(results / 5))
        return message.channel.send(`${query}: ${index} / ${results}\n${videos[index]}`)
      }

      function awaitReactions (response) {
        response.react('⏪')
          .then(() => response.react('◀'))
          .then(() => response.react('▶'))
          .then(() => response.react('⏩'))
          .then(() => response.react('🔀'))
          .then(() => {
            response.createReactionCollector(
              (reaction, user) => ['⏪', '◀', '▶', '⏩', '🔀'].indexOf(reaction.emoji.name) >= 0 && user.id === message.author.id,
              { max: 1, time: 30000 }
            ).on('collect', reaction => {
              if (reaction.emoji.name === '⏪') index -= 10
              else if (reaction.emoji.name === '◀') index--
              else if (reaction.emoji.name === '▶') index++
              else if (reaction.emoji.name === '⏩') index += 10
              else if (reaction.emoji.name === '🔀') index = Math.floor(Math.random() * results)
              index = ((index % results) + results) % results
              response.edit(`${query}: ${index} / ${results}\n${videos[index]}`)
              response.clearReactions().then(awaitReactions)
            }).on('end', (collected, reason) => {
              if (reason !== 'limit') response.clearReactions()
            })
          })
      }

      message.channel.send(`${query}: ${index} / ${results}\n${videos[index]}`).then(awaitReactions)
    })
  }
}
*/
