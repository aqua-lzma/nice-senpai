const axios = require('axios')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { googleMapsKey } = require('../config.json')

const command = new SlashCommandBuilder()
  .setName('timezone')
  .setDescription('Display the current time at any given location')
  .addStringOption(option => option
    .setName('location')
    .setDescription('Location')
    .setRequired(true))

const geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json'
const timezoneURL = 'https://maps.googleapis.com/maps/api/timezone/json'

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
async function execute (interaction) {
  await interaction.deferReply()
  const embed = new EmbedBuilder()
  let location = interaction.options.getString('location')

  location = encodeURIComponent(location)
  const locationURL = `${geocodeURL}?key=${googleMapsKey}&address=${location}&censor=false`
  const locationData = await axios.get(locationURL)

  if (locationData.data.results.length === 0) {
    embed.setTitle(interaction.options.getString('location'))
    embed.setDescription('No location found.')
    embed.setColor(0xff0000)
    return await interaction.editReply({ embeds: [embed] })
  }

  const timestamp = (new Date()).getTime()
  const { lat, lng } = locationData.data.results[0].geometry.location
  const timeURL = `${timezoneURL}?key=${googleMapsKey}&location=${lat},${lng}&timestamp=${timestamp}`.slice(0, -3)
  const timeData = await axios.get(timeURL)
  const offset = (timeData.data.rawOffset + timeData.data.dstOffset) * 1000
  const localTime = new Date(timestamp + offset)

  let description = localTime.toUTCString().slice(0, -4)
  description += '\n\n UTC' + (offset >= 0 ? '+' : '')
  description += String(Math.floor(offset / 3600000)).padStart(2, '0')
  description += ':' + String((offset % 3600000) / 60000).padStart(2, '0')
  description += '\n' + timeData.data.timeZoneId
  description += '\n' + timeData.data.timeZoneName

  embed.setTitle(locationData.data.results[0].formatted_address)
  embed.setDescription(description)
  embed.setFooter({ text: `${lat}, ${lng}` })
  await interaction.editReply({ embeds: [embed] })
}

module.exports = { command, execute }
