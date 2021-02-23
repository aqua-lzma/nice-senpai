/**
 * @module template-struct Command structure for template command
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
const struct = {}
export default struct
