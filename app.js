const { Client, Events, GatewayIntentBits } = require('discord.js')
const config = require('./config.json')

const { commandMap } = require('./commands.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.login(config.token)

client.on('ready', () => {
  console.log('hi . . .')
})

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return
  try {
    const command = commandMap[interaction.commandName]
    await command(interaction)
  } catch (e) {
    console.error(e)
  }
})
