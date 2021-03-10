/**
 * @module template-struct Command structure for `template` command
 */
import '../../typedefs.js'
import { ApplicationCommandOptionType } from '../../enums.js'

/**
 * @type {ApplicationCommand}
 */
const struct = {
  name: 'last-fm',
  description: 'Create a last.fm collage',
  options: [{
    type: ApplicationCommandOptionType.STRING,
    name: 'user',
    description: 'Username of the user to display info about',
    required: true
  }, {
    type: ApplicationCommandOptionType.STRING,
    name: 'type',
    description: 'Type of collage to make. Default: albums',
    choices: [{
      name: 'albums', value: 'albums'
    }, {
      name: 'artists', value: 'artists'
    }, {
      name: 'tracks', value: 'artists'
    }]
  }, {
    type: ApplicationCommandOptionType.STRING,
    name: 'timeframe',
    description: 'Timeframe to show. Default: 7 days',
    choices: [{
      name: 'overall', value: 'overall'
    }, {
      name: '7 days', value: '7day'
    }, {
      name: '1 month', value: '1month'
    }, {
      name: '3 months', value: '3month'
    }, {
      name: '6 months', value: '6month'
    }, {
      name: '1 year', value: '12month'
    }]
  }, {
    type: ApplicationCommandOptionType.INTEGER,
    name: 'gridsize',
    description: 'Size of grid to display. Default: 3x3',
    choices: [{
      name: '3x3', value: 9
    }, {
      name: '4x4', value: 16
    }, {
      name: '5x5', value: 25
    }]
  }]
}
export default struct
