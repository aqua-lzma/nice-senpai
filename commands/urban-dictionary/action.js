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
  return {
    type: CommandOptionType.AcknowledgeWithSource
  }
}

/*
const request = require('request')
const { RichEmbed, Util } = require('discord.js')

function nameLinks (str) {
  str.match(/\[[\w\-' ]+\]/g).map(namedLink => {
    str = str.replace(
      namedLink,
      namedLink + `(https://www.urbandictionary.com/define.php?term=${encodeURIComponent(namedLink.slice(1, -1))})`)
  })
  return str
}

function buildEmbed (definition, index, total) {
  return new RichEmbed({
    author: { name: `Urban Dictionary ${index === 0 ? 'Top result' : `${index}/${total}`}` },
    title: definition.word,
    url: definition.permalink,
    description: [
      Util.escapeMarkdown(nameLinks(definition.definition)),
      '',
      Util.escapeMarkdown(nameLinks(definition.example))
        .split('\r\n')
        .map(line => line === '' ? line : `*${line}*`)
        .join('\n')
    ].join('\n'),
    footer: { text: definition.author },
    timestamp: definition.written_on
  })
}

module.exports = {
  title: 'Urban dictionary',
  desc: [].join('\n'),
  syntax: [].join('\n'),
  alias: ['ud', 'urban', 'dictionary'],
  owner_only: false,
  affect_config: false,
  action: (message) => {
    const query = message.content.split(' ').slice(1).join(' ')
    if (query === '') return message.channel.send('Cannot search blank query.')
    const req = {
      url: `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(query)}`
      // headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0' }
    }
    request.get(req, (err, res, body) => {
      if (err) return message.channel.send(`Error:\`\`\`\n${String(err)}\`\`\``)
      const results = JSON.parse(body).list
      let index = 0

      if (message.content.split(' ')[0].slice(-1) === '2') {
        return message.channel.send('', buildEmbed(results[0], 0, 0))
      }

      function awaitReactions (response) {
        response.react('◀')
          .then(() => response.react('▶'))
          .then(() => response.react('🔀'))
          .then(() => {
            response.createReactionCollector(
              (reaction, user) => ['◀', '▶', '🔀'].indexOf(reaction.emoji.name) >= 0 && user.id === message.author.id,
              { max: 1, time: 30000 }
            ).on('collect', reaction => {
              if (reaction.emoji.name === '◀') index--
              else if (reaction.emoji.name === '▶') index++
              else if (reaction.emoji.name === '🔀') index = Math.floor(Math.random() * results.length)
              index = ((index % results.length) + results.length) % results.length
              response.edit(buildEmbed(results[index], index, results.length))
              reaction.remove(message.author).then(() => awaitReactions(response)).catch(() => awaitReactions(response))
            }).on('end', (collected, reason) => {
              if (reason !== 'limit') response.clearReactions().catch(() => {})
            })
          })
      }

      message.channel.send(buildEmbed(results[0], 0, 0)).then(awaitReactions)
    })
  }
}
*/
