/**
 * @module template-struct Command structure for `template` command
 */
import '../../typedefs.js'
import { ApplicationCommandOptionType } from '../../enums.js'

/**
 * @type {ApplicationCommand}
 */
const struct = {
  name: 'tempalte',
  description: 'template description',
  options: [{
    type: ApplicationCommandOptionType.INTEGER,
    name: 'template option',
    description: 'template option description'
  }]
}
export default struct
