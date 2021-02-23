/**
 * @module dabs-struct Command structure for dab commands
 */
import '../../typedefs.js'

/**
 * Enum for ApplicationCommandOptionType values.
 * @readonly
 * @enum {number}
 */
const CommandOptionType = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8
}

/**
 * @type {ApplicationCommand}
*/
const struct = {
  name: 'dabs',
  description: 'Dab related commands',
  options: [{
    type: CommandOptionType.SUB_COMMAND,
    name: 'check',
    description: 'Check how many dabs you or someone else has',
    options: [{
      type: CommandOptionType.USER,
      name: 'user',
      description: 'User to check'
    }]
  }, {
    type: CommandOptionType.SUB_COMMAND,
    name: 'daily-roll',
    description: 'Roll your daily rolls for some daily dabs'
  }, {
    type: CommandOptionType.SUB_COMMAND,
    name: 'bet-roll',
    description: 'Bet dabs on a roll from 0 to 100, the higher the number the better the payout',
    options: [{
      type: 4,
      name: 'dabs',
      description: 'Number of dabs to bet',
      required: true
    }]
  }, {
    type: CommandOptionType.SUB_COMMAND,
    name: 'bet-flip',
    description: 'Bet dabs on a coin flip',
    options: [{
      type: CommandOptionType.STRING,
      name: 'choice',
      description: 'Your choice of heads or tails',
      required: true,
      choices: [{
        name: 'Heads', value: 'heads'
      }, {
        name: 'Tails', value: 'tails'
      }]
    }, {
      type: CommandOptionType.INTEGER,
      name: 'dabs',
      description: 'Number of dabs to bet',
      required: true
    }]
  }, {
    type: CommandOptionType.SUB_COMMAND,
    name: 'bet-dubs',
    description: 'Bet dabs on a random number from 0 to 1000000 being dubs or better',
    options: [{
      type: 4,
      name: 'dabs',
      description: 'Number of dabs to bet',
      required: true
    }]
  }, {
    type: CommandOptionType.SUB_COMMAND,
    name: 'give',
    description: 'Give some of your dabs to a different user',
    options: [{
      type: CommandOptionType.USER,
      name: 'user',
      description: 'User to give dabs to',
      required: true
    }, {
      type: CommandOptionType.INTEGER,
      name: 'dabs',
      description: 'Number of dabs to give',
      required: true
    }]
  }]
}
export default struct
