// Node modules
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
// External modules
import { Client } from 'discord.js'
// Local modules
import './typedefs.js'
import { InteractionResponseType } from './enums.js'
import commands from './commands/index.js'
import compareStructs from './utils/compareStructs.js'

function logError (message, error, data) {
  console.error(message)
  console.error(error)
  const errorFileName = `${(new Date()).getTime()}.json`
  const errorPath = join(rootDir, 'logs', errorFileName)
  console.error(`Logging to: ${errorPath}`)
  writeFileSync(errorPath, JSON.stringify(data, null, 2), 'utf8')
}

const client = new Client()

const rootDir = dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(readFileSync(join(rootDir, 'config.json'), 'utf8'))

client.login(config.token)

client.on('ready', async function () {
  console.log('hi . . .')
  if (config.testMode) {
    console.log('Running in test mode . . .')
    const testGuild = await client.guilds.fetch(config.testGuild)
    if (testGuild == null) {
      console.error(`Cannot find test guild id: ${config.testGuild}`)
      process.exit()
    }
  }
  console.log('Comparing live and target commands . . .')
  /** @type {[ApplicationCommand]} */
  const liveCommands = (
    config.testMode
      ? await client.api.applications(client.user.id).guilds(config.testGuild).commands.get()
      : await client.api.applications(client.user.id).commands.get()
  )
  writeFileSync(join(rootDir, 'live-commands.json'), JSON.stringify(liveCommands, null, 2), 'utf8')
  let changesMade = false
  for (const command of commands) {
    const liveCommand = liveCommands.find(c => c.name === command.name)
    if (liveCommand != null) {
      if (compareStructs(liveCommand, command.struct)) {
        console.log(`${command.name}: Matched . . .`)
      } else {
        console.log(`${command.name}: Mismatched, patching . . .`)
        await (config.testMode
          ? client.api.applications(client.user.id).guilds(config.testGuild)
          : client.api.applications(client.user.id)
        ).commands(liveCommand.id).patch({
          data: command.struct
        })
        changesMade = true
      }
    } else {
      console.log(`${command.name}: Missing, uploading . . .`)
      await (config.testMode
        ? client.api.applications(client.user.id).guilds(config.testGuild)
        : client.api.applications(client.user.id)
      ).commands.post({
        data: command.struct
      })
      changesMade = true
    }
  }
  for (const liveCommand of liveCommands) {
    if (!commands.some(command => liveCommand.name === command.name)) {
      console.log(`${liveCommand.name}: Deprecated, deleting . . .`)
      await (config.testMode
        ? client.api.applications(client.user.id).guilds(config.testGuild)
        : client.api.applications(client.user.id)
      ).commands(liveCommand.id).delete()
      changesMade = true
    }
  }
  if (changesMade && !config.testMode) {
    console.warn('WARNING: Changes were made to the command structures. Bot may misbehave for an hour while the changes go live.')
  }
})

client.ws.on('INTERACTION_CREATE', /** @param {Interaction} interaction */ async interaction => {
  await client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: InteractionResponseType.Acknowledge,
      data: {
        embeds: [{
          title: '<a:typing:819337369676808192> Sending command...'
        }]
      }
    }
  })
  const command = commands.find(command => command.name === interaction.data.name)
  if (command != null) {
    /** @type {InteractionResponse} */
    let response
    try {
      response = await command.action(client, interaction)
    } catch (error) {
      logError(
        `Failed running command: ${interaction.data.name}`,
        error,
        { error, interaction }
      )
      response = { type: InteractionResponseType.Acknowledge }
    }
    try {
      await client.api.webhooks(client.user.id, interaction.token).messages('@original').patch(response)
      /*
      const res = await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: response
      })
      */
    } catch (error) {
      logError(
        `Failed to respond to command: ${interaction.data.name}`,
        error,
        { error, interaction, response }
      )
    }
  } else {
    logError(
      `Interaction with unknown command name: ${interaction.data.name}`,
      null,
      { interaction }
    )
  }
})

client.on('message', message => {
  if (Math.random() > 0.99) {
    message.channel.send('^ Interesting')
  }
})
