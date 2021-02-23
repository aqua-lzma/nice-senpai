// Node modules
import { readFileSync, writeFile, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
// External modules
import { Client } from 'discord.js'
// Local modules
import './typedefs.js'
import commands from './commands/index.js'
import compareStructs from './utils/compareStructs.js'

const client = new Client()

const rootDir = dirname(fileURLToPath(import.meta.url))
const config = JSON.parse(readFileSync(join(rootDir, 'config.json'), 'utf8'))

client.login(config.token)

client.on('ready', async function () {
  console.log('hi . . .')
  console.log('Comparing live and target commands . . .')
  /** @type {[ApplicationCommand]} */
  let liveCommands = await client.api.applications(client.user.id).commands.get()
  let changesMade = false
  for (let command of commands) {
    let liveCommand = liveCommands.find(c => c.name === command.name)
    if (liveCommand != null) {
      if (compareStructs(liveCommand, command.struct)) {
        console.log(`${command.name}: Matched . . .`)
      } else {
        console.log(`${command.name}: Mismatched, patching . . .`)
        // The PATCH method is autistic, because it rejects commands with the same name.
        // So we delete and re-upload.
        await client.api.applications(client.user.id).commands(liveCommand.id).delete()
        await client.api.applications(client.user.id).commands.post({
          data: command.struct
        })
        changesMade = true
      }
    } else {
      console.log(`${command.name}: Missing, uploading . . .`)
      await client.api.applications(client.user.id).commands.post({
        data: command.struct
      })
      changesMade = true
    }
  }
  for (let liveCommand of liveCommands) {
    if (!commands.some(command => liveCommand.name === command.name)) {
      console.log(`${liveCommand.name}: Deprecated, deleting . . .`)
      await client.api.applications(client.user.id).commands(liveCommand.id).delete()
      changesMade = true
    }
  }
  if (changesMade) {
    console.warn('WARNING: Changes were made to the command structures. Bot may misbehave for an hour while the changes go live.')
  }
})

client.ws.on('INTERACTION_CREATE', /** @param {Interaction} interaction */ async interaction => {
  let command = commands.find(command => command.name === interaction.data.name)
  if (command != null) {
    let response = await command.action(client, interaction)
    try {
      await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: response
      })
    } catch (e) {
      console.error(`Failed to respond to command: ${interaction.data.name}`)
      console.error(e)
      let errorFileName = `${(new Date()).getTime()}.json`
      let errorPath = join(rootDir, 'logs', errorFileName)
      console.error(`Logging interaction and response to: ${errorPath}`)
      writeFileSync(errorPath, JSON.stringify({ interaction , response }, null, 2), 'utf8')
    }
  } else {
    console.error(`Interaction with unknown command name: ${interaction.data.name}`)
    let errorFileName = `${(new Date()).getTime()}.json`
    let errorPath = join(rootDir, 'logs', errorFileName)
    console.error(`Logging interaction to: ${errorPath}`)
    writeFileSync(errorPath, JSON.stringify(interaction, null, 2), 'utf8')
  }
})
