const { SlashCommandBuilder } = require('discord.js')

const command = new SlashCommandBuilder()
  .setName('minesweep')
  .setDescription('Generate a minesweeper puzzle. 9x9, 10 mines to find. No cheating!!')

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
async function execute (interaction) {
  const size = 9
  const width = size
  const height = size
  const mines = 10
  const charMap = [
    '🟦',
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣'
  ]
  charMap[-1] = '💣'

  const grid = new Array(height).fill().map(() => new Array(width).fill(0))
  for (let i = 0; i < mines; i++) {
    let x, y
    do {
      x = Math.floor(Math.random() * width)
      y = Math.floor(Math.random() * height)
    } while (grid[y][x] === -1)
    grid[y][x] = -1
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue
        const tx = x + dx
        const ty = y + dy
        if (tx < 0 || ty < 0 || tx >= width || ty >= height) continue
        if (grid[ty][tx] === -1) continue
        grid[ty][tx]++
      }
    }
  }

  const out = grid.map(row => row.map(char => '||' + charMap[char] + '||').join('')).join('\n')
  interaction.reply(out)
}

module.exports = { command, execute }
