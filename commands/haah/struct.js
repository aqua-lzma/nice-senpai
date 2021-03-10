/**
 * @module haah-struct Command structure for `haah` command
 */
import '../../typedefs.js'
import { ApplicationCommandOptionType } from '../../enums.js'

/**
 * @type {ApplicationCommand}
 */
const struct = {
  name: 'haah',
  description: 'haah waaw',
  options: [{
    type: ApplicationCommandOptionType.STRING,
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
