import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import { Client } from 'discord.js'

const client = new Client()

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const config = JSON.parse(readFileSync(join(rootDir, 'config.json'), 'utf8'))

client.login(config.token)

client.on('ready', async function () {
  console.log('hi . . .')
  /** @type {[ApplicationCommand]} */
  const commands = await client.api.applications(client.user.id).commands.get()
  console.log(commands)
  for (const command of commands) {
    console.log(`Deleting ${command.name}`)
    await client.api.applications(client.user.id).commands(command.id).delete()
  }
  process.exit()
})
