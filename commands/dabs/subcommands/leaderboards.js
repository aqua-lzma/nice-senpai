/**
 * @module template-action Response generator for template command
 */
import { Client } from 'discord.js'
import '../../../typedefs.js'

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

}

function buildFields (lbs, page) {
  var output = []
  for (let user of lbs.slice(10 * page, (10 * page) + 10)) {
    output.push({
      'name': `${lbs.indexOf(user) + 1}. ${user[0]}`,
      'value': `Current: ${user[1]}, Record: ${user[2]}`
    })
  }
  return output
}

let oldStuff = {
  title: 'Leaderboards',
  desc: [
    'Show server members with the **largest** dab collections.',
    'Or alternatively show members with the highest ever held dabs.',
    '*They probably already gambled them away.*'
  ].join('\n'),
  syntax: '`{prefix}lb` show  leader boards for current server.',
  alias: ['lb', 'leaderboards'],
  owner_only: false,
  affect_config: false,
  action: function (message, config) {
    message.guild.fetchMembers().then(guild => {
      var leaderboards = []
      for (let member of guild.members) {
        let user = updateDabs(member[1], config)
        leaderboards.push([member[1].displayName, user.dabs, user.dab_record])
      }
      var sortByCurrent = true
      var page = 0
      var limit = Math.ceil(leaderboards.length / 10)
      leaderboards = leaderboards.sort((a, b) => b[1] - a[1])
      var embed = {
        'author': {
          'name': `Leaderboards for ${guild.name} by ${sortByCurrent ? 'current' : 'record'} dabs:`,
          'icon_url': guild.iconUrl
        },
        'fields': buildFields(leaderboards, page)
      }

      function awaitReactions (response) {
        response.createReactionCollector(
          (reaction, user) => ['◀', '▶', '🔀'].indexOf(reaction.emoji.name) >= 0 && user.id === message.author.id,
          { max: 1, time: 30000 }
        ).on('collect', reaction => {
          if (reaction.emoji.name === '◀') page--
          else if (reaction.emoji.name === '▶') page++
          else if (reaction.emoji.name === '🔀') {
            sortByCurrent = !sortByCurrent
            leaderboards = leaderboards.sort((a, b) => b[sortByCurrent ? 1 : 2] - a[sortByCurrent ? 1 : 2])
            page = 0
          }
          page = ((page % limit) + limit) % limit
          response.edit('', {embed: {
            'author': {
              'name': `Leaderboards for ${guild.name} by ${sortByCurrent ? 'current' : 'record'} dabs:`,
              'icon_url': guild.iconUrl
            },
            'fields': buildFields(leaderboards, page)
          }})
          reaction.remove(message.author).then(() => awaitReactions(response))
        }).on('end', (collected, reason) => {
          if (reason !== 'limit') response.clearReactions()
        })
      }

      message.channel.send('', {embed: embed}).then(response => {
        response
          .react('◀')
          .then(() => response.react('▶'))
          .then(() => response.react('🔀'))
          .then(() => awaitReactions(response))
      })
    })
  }
}
