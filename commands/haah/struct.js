/**
 * @module haah-struct Command structure for `haah` command
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
  name: 'haah',
  description: 'haah waaw',
  options: [{
    type: CommandOptionType.STRING,
    name: 'haah',
    description: 'haah waaw hooh woow',
    choices: [
      { name: 'haah', value: 'haah' },
      { name: 'waaw', value: 'waaw' },
      { name: 'hooh', value: 'hooh' },
      { name: 'woow', value: 'woow' }
    ]
  }]
}
export default struct
