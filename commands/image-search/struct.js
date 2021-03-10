/**
 * @module image-search-struct Command structure for `image-search` command
 */
import '../../typedefs.js'
import { ApplicationCommandOptionType } from '../../enums.js'

/**
 * @type {ApplicationCommand}
 */
const struct = {
  name: 'image-search',
  description: 'Search Google for an image',
  options: [{
    type: ApplicationCommandOptionType.STRING,
    name: 'query',
    description: 'What to search Google for',
    required: true
  }]
}
export default struct
