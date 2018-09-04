const { RichEmbed } = require('discord.js')
const updateDabs = require('../commands/_update_dabs')

module.exports = {
  defaultConfig: [0, 100 + (Math.random() * 100)],
  action: (message, responseData, config) => {
    if (message.content.toLowerCase().includes('dab')) return
    if (responseData[0] < responseData[1]) {
      responseData[0]++
    } else {
      responseData[0] = 0
      responseData[1] = 100 + (Math.random() * 100)
      const award = 1 + Math.floor(Math.random() * 9)
      message.channel.send('', new RichEmbed({
        title: `${award} random dabs have appeared! Dab to get them!`,
        image: { url: 'https://raw.githubusercontent.com/aqua-rar/Nice-Senpai/master/resources/kumiko-dab.jpg' }
      })).then(message => {
        const collector = message.channel.createMessageCollector(
          message => message.content.toLowerCase().includes('dab'),
          { maxMatches: 1 }
        )
        collector.on('collect', userMessage => {
          message.delete()
          const user = updateDabs(message.author, config)
          const prize = Math.floor(award + user.level * 0.02)
          userMessage.channel.send(`${userMessage.author.username} claimed ${prize} dabs!`)
          user.dabs += prize
        })
      })
    }
  }
}
