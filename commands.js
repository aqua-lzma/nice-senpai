const { readdirSync } = require('fs')

/**
 * @typedef {import('discord.js').ChatInputCommandInteraction} ChatInputCommandInteraction
 * @typedef {import('discord.js').SlashCommandBuilder} SlashCommandBuilder
 * @typedef {(interaction: ChatInputCommandInteraction) => Promise<void>} Execute
 */

/**
 * @type {Object.<string, Execute>} commandMap
 */
const commandMap = {}
const commandList = []
for (const name of readdirSync('./commands')) {
  /**
   * @type {{command: SlashCommandBuilder, execute: Execute}}
   */
  const module = require(`./commands/${name}`)
  commandMap[module.command.name] = module.execute
  commandList.push(module.command.toJSON())
}

module.exports = { commandMap, dataList: commandList }
