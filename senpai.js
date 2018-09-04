const Discord = require('discord.js')
const fs = require('fs')
const commands = require('./commands.js')
const responses = require('./responses')
const config = require('./config.json')
const client = new Discord.Client()

client.login(config.token)

client.on('ready', function () {
  console.log('hi')
})

client.on('message', function (message) {
  if (
    message.author.id === client.user.id ||
        !message.guild ||
        config.ignore.server.indexOf(message.guild.id) >= 0 ||
        config.ignore.channel.indexOf(message.channel.id) >= 0 ||
        config.ignore.user.indexOf(message.author.id) >= 0
  ) return

  let prefix = config.command_prefix
  if (config.server_prefix[message.guild.id]) { prefix = config.server_prefix[message.guild.id] }
  if (message.content.startsWith(prefix)) {
    let input = message.content.split(' ')[0].slice(1).toLowerCase()
    if (message.content.slice(0, 2) === prefix + prefix) input = 'info'
    for (const command of commands) {
      if (command.alias.indexOf(input) >= 0) {
        if (command.owner_only && message.author.id !== config.owner_id) return
        command.action(message, config)
        if (command.affect_config) {
          fs.writeFile('./config.json', JSON.stringify(config, null, 4), (err) => {
            if (err) return message.channel.send('Error saving file, progress might be lost.')
            console.log('Config saved.')
          })
        }
        return
      }
    }
  } else if (message.author.id !== client.id && !message.author.bot) {
    if (config.responses[message.guild.id]) {
      for (const [response, responseData] of Object.entries(config.responses[message.guild.id])) {
        responses[response].action(message, responseData, config)
        console.log(response, responseData)
        fs.writeFile('./config.json', JSON.stringify(config, null, 4), (err) => {
          if (err) return message.channel.send('Error saving file, progress might be lost.')
          console.log('Config saved.')
        })
      }
    }
  }
})
