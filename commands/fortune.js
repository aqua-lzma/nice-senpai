const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

const command = new SlashCommandBuilder()
  .setName('fortune')
  .setDescription('[s4s] Rule #1: You must check your #fortune in order to post on this board.')

const rareFortunes = [
  [0x2600D0, 'Your fortune: le ebin dubs xDDDDDDDDDDDD'],
  [0x2A56FB, "Your fortune: you gon' get some dick"],
  [0xE941E3, 'Your fortune: ayy lmao'],
  [0xFF0000, 'Your fortune: (YOU ARE BANNED)'],
  [0x68923A, 'Your fortune: Get Shrekt'],
  [0x8C8C8C, 'Your fortune: YOU JUST LOST THE GAME']
]

const fortunes = [
  [0xF51C6A, 'Your fortune: Reply hazy, try again'],
  [0xFD4D32, 'Your fortune: Excellent Luck'],
  [0xE7890C, 'Your fortune: Good Luck'],
  [0xBAC200, 'Your fortune: Average Luck'],
  [0x7FEC11, 'Your fortune: Bad Luck'],
  [0x43FD3B, 'Your fortune: Good news will come to you by mail'],
  [0x16F174, 'Your fortune: （　´_ゝ`）ﾌｰﾝ '],
  [0x00CBB0, 'Your fortune: ｷﾀ━━━━━━(ﾟ∀ﾟ)━━━━━━ !!!!'],
  [0x0893E1, 'Your fortune: You will meet a dark handsome stranger'],
  [0x2A56FB, 'Your fortune: Better not tell you now'],
  [0x6023F8, 'Your fortune: Outlook good'],
  [0x9D05DA, 'Your fortune: Very Bad Luck'],
  [0xD302A7, 'Your fortune: Godly Luck']
]

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
async function execute (interaction) {
  const embed = new EmbedBuilder()
  let fortune
  if (Math.random() > 0.99) {
    fortune = rareFortunes[Math.floor(Math.random() * rareFortunes.length)]
  } else {
    fortune = fortunes[Math.floor(Math.random() * fortunes.length)]
  }
  embed.setTitle('🔮 **Fortune**')
  embed.setColor(fortune[0])
  embed.setDescription(fortune[1])
  interaction.reply({ embeds: [embed] })
}

module.exports = { command, execute }
