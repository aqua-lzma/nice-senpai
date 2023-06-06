const { REST, Routes } = require('discord.js')
const { dataList } = require('../commands.js')
const config = require('../config.json')

const rest = new REST().setToken(config.token)

;(async () => {
  try {
    if (config.testMode) {
      console.log(`Uploading ${dataList.length} commands to guild: ${config.testGuild}.`)
      const data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.testGuild),
        { body: dataList }
      )
      console.log(`Finished: ${data.length}.`)
    } else {
      console.log(`Uploading ${dataList.length} commands bot-wide . . .`)
      const data = await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: dataList }
      )
      console.log(`Finished: ${data.length}.`)
    }
  } catch (e) {
    console.error(e)
  }
})()
